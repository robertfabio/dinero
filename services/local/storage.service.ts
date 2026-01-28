import { createMMKV } from "react-native-mmkv";
import type {
    IAuthStorage,
    ITransactionLocalStorage,
    IWalletLocalStorage,
    Transaction,
    User,
    UserSession,
    Wallet,
} from "../../types";

const mainStorage = createMMKV({ id: "dinero-main" });
const secureStorage = createMMKV({
  id: "dinero-secure",
  encryptionKey: "dinero-2026-secure",
});

const KEYS = {
  SESSION: "@auth:session",
  USER: "@auth:user",
  CURRENT_WALLET: "@wallet:current",
  WALLETS: "@wallets:all",
  LAST_SYNC: (walletId: string) => `@sync:${walletId}:last`,
  TRANSACTIONS: (walletId: string) => `@transactions:${walletId}`,
} as const;

function safeJsonParse<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export class AuthStorageService implements IAuthStorage {
  async persistSession(session: UserSession): Promise<void> {
    secureStorage.set(KEYS.SESSION, JSON.stringify(session));
  }

  async getSession(): Promise<UserSession | null> {
    const data = secureStorage.getString(KEYS.SESSION);
    return safeJsonParse<UserSession | null>(data, null);
  }

  async clearSession(): Promise<void> {
    secureStorage.set(KEYS.SESSION, "");
  }

  async persistUser(user: User): Promise<void> {
    secureStorage.set(KEYS.USER, JSON.stringify(user));
  }

  async getUser(): Promise<User | null> {
    const data = secureStorage.getString(KEYS.USER);
    return safeJsonParse<User | null>(data, null);
  }
}

export class WalletStorageService implements IWalletLocalStorage {
  saveWallet(wallet: Wallet): void {
    const wallets = this.getAllWallets();
    const index = wallets.findIndex((w) => w.id === wallet.id);

    if (index >= 0) {
      wallets[index] = wallet;
    } else {
      wallets.push(wallet);
    }

    mainStorage.set(KEYS.WALLETS, JSON.stringify(wallets));
  }

  getWallet(id: string): Wallet | null {
    const wallets = this.getAllWallets();
    return wallets.find((w) => w.id === id && !w.deleted_at) ?? null;
  }

  getAllWallets(): Wallet[] {
    const data = mainStorage.getString(KEYS.WALLETS);
    const wallets = safeJsonParse<Wallet[]>(data, []);
    return wallets.filter((w) => !w.deleted_at);
  }

  deleteWallet(id: string): void {
    const wallets = safeJsonParse<Wallet[]>(
      mainStorage.getString(KEYS.WALLETS),
      [],
    );
    const index = wallets.findIndex((w) => w.id === id);

    if (index >= 0) {
      wallets[index] = {
        ...wallets[index],
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        needs_sync: true,
      };
      mainStorage.set(KEYS.WALLETS, JSON.stringify(wallets));
    }
  }

  getCurrentWalletId(): string | null {
    return mainStorage.getString(KEYS.CURRENT_WALLET) ?? null;
  }

  setCurrentWalletId(id: string): void {
    mainStorage.set(KEYS.CURRENT_WALLET, id);
  }

  getWalletsNeedingSync(): Wallet[] {
    const data = mainStorage.getString(KEYS.WALLETS);
    const wallets = safeJsonParse<Wallet[]>(data, []);
    return wallets.filter((w) => w.needs_sync);
  }

  markAsSynced(id: string): void {
    const wallets = safeJsonParse<Wallet[]>(
      mainStorage.getString(KEYS.WALLETS),
      [],
    );
    const index = wallets.findIndex((w) => w.id === id);

    if (index >= 0) {
      wallets[index] = { ...wallets[index], needs_sync: false };
      mainStorage.set(KEYS.WALLETS, JSON.stringify(wallets));
    }
  }
}

export class TransactionStorageService implements ITransactionLocalStorage {
  private getStorageKey(walletId: string): string {
    return KEYS.TRANSACTIONS(walletId);
  }

  private getRawTransactions(walletId: string): Transaction[] {
    const data = mainStorage.getString(this.getStorageKey(walletId));
    return safeJsonParse<Transaction[]>(data, []);
  }

  saveTransaction(walletId: string, transaction: Transaction): void {
    const transactions = this.getRawTransactions(walletId);
    const index = transactions.findIndex((t) => t.id === transaction.id);

    const updatedTransaction: Transaction = {
      ...transaction,
      wallet_id: walletId,
      updated_at: new Date().toISOString(),
      needs_sync: true,
    };

    if (index >= 0) {
      transactions[index] = updatedTransaction;
    } else {
      transactions.push({
        ...updatedTransaction,
        created_at: new Date().toISOString(),
      });
    }

    mainStorage.set(this.getStorageKey(walletId), JSON.stringify(transactions));
  }

  getTransaction(walletId: string, id: string): Transaction | null {
    const transactions = this.getRawTransactions(walletId);
    return transactions.find((t) => t.id === id && !t.deleted_at) ?? null;
  }

  getAllTransactions(walletId: string, includeDeleted = false): Transaction[] {
    const transactions = this.getRawTransactions(walletId);

    if (includeDeleted) {
      return transactions;
    }

    return transactions.filter((t) => !t.deleted_at);
  }

  softDeleteTransaction(walletId: string, id: string): void {
    const transactions = this.getRawTransactions(walletId);
    const index = transactions.findIndex((t) => t.id === id);

    if (index >= 0) {
      transactions[index] = {
        ...transactions[index],
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        needs_sync: true,
      };
      mainStorage.set(
        this.getStorageKey(walletId),
        JSON.stringify(transactions),
      );
    }
  }

  getTransactionsNeedingSync(walletId: string): Transaction[] {
    const transactions = this.getRawTransactions(walletId);
    return transactions.filter((t) => t.needs_sync);
  }

  markAsSynced(walletId: string, id: string): void {
    const transactions = this.getRawTransactions(walletId);
    const index = transactions.findIndex((t) => t.id === id);

    if (index >= 0) {
      transactions[index] = { ...transactions[index], needs_sync: false };
      mainStorage.set(
        this.getStorageKey(walletId),
        JSON.stringify(transactions),
      );
    }
  }

  bulkSave(walletId: string, newTransactions: Transaction[]): void {
    const existingTransactions = this.getRawTransactions(walletId);
    const transactionMap = new Map(existingTransactions.map((t) => [t.id, t]));

    newTransactions.forEach((transaction) => {
      const existing = transactionMap.get(transaction.id);

      if (
        !existing ||
        new Date(transaction.updated_at) > new Date(existing.updated_at)
      ) {
        transactionMap.set(transaction.id, {
          ...transaction,
          wallet_id: walletId,
          needs_sync: false,
        });
      }
    });

    mainStorage.set(
      this.getStorageKey(walletId),
      JSON.stringify(Array.from(transactionMap.values())),
    );
  }

  getLastSyncTimestamp(walletId: string): string | null {
    return mainStorage.getString(KEYS.LAST_SYNC(walletId)) ?? null;
  }

  setLastSyncTimestamp(walletId: string, timestamp: string): void {
    mainStorage.set(KEYS.LAST_SYNC(walletId), timestamp);
  }
}

export const authStorage = new AuthStorageService();
export const walletStorage = new WalletStorageService();
export const transactionStorage = new TransactionStorageService();
