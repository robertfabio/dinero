import type {
    ITransactionLocalStorage,
    ITransactionRepository,
    IWalletLocalStorage,
    IWalletRepository,
    SyncStatus,
    Transaction,
    Wallet,
} from "../../types";

export interface ISyncService {
  syncTransactions(walletId: string): Promise<void>;
  syncWallets(): Promise<void>;
  syncAll(): Promise<void>;
  getSyncStatus(walletId: string): SyncStatus;
}

export class SyncService implements ISyncService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private transactionStorage: ITransactionLocalStorage,
    private walletRepo: IWalletRepository,
    private walletStorage: IWalletLocalStorage,
  ) {}

  async syncTransactions(walletId: string): Promise<void> {
    const pendingTransactions =
      this.transactionStorage.getTransactionsNeedingSync(walletId);

    if (pendingTransactions.length > 0) {
      const result =
        await this.transactionRepo.syncToRemote(pendingTransactions);

      if (result.success && result.data) {
        result.data.forEach((transaction: Transaction) => {
          this.transactionStorage.markAsSynced(walletId, transaction.id);
        });
      }
    }

    const lastSync = this.transactionStorage.getLastSyncTimestamp(walletId);
    const remoteResult = await this.transactionRepo.fetchFromRemote(lastSync);

    if (
      remoteResult.success &&
      remoteResult.data &&
      remoteResult.data.length > 0
    ) {
      this.transactionStorage.bulkSave(walletId, remoteResult.data);

      const latestTimestamp = remoteResult.data.reduce((latest, t) => {
        return t.updated_at > latest ? t.updated_at : latest;
      }, lastSync ?? "");

      if (latestTimestamp) {
        this.transactionStorage.setLastSyncTimestamp(walletId, latestTimestamp);
      }
    }
  }

  async syncWallets(): Promise<void> {
    const pendingWallets = this.walletStorage.getWalletsNeedingSync();

    for (const wallet of pendingWallets) {
      if (wallet.deleted_at) {
        await this.walletRepo.delete(wallet.id);
      } else {
        await this.walletRepo.update(wallet.id, {
          name: wallet.name,
          type: wallet.type,
          icon: wallet.icon ?? undefined,
          color: wallet.color ?? undefined,
          isDefault: wallet.isDefault,
        });
      }

      this.walletStorage.markAsSynced(wallet.id);
    }

    const remoteResult = await this.walletRepo.getAll();

    if (remoteResult.success && remoteResult.data) {
      remoteResult.data.forEach((wallet: Wallet) => {
        const localWallet = this.walletStorage.getWallet(wallet.id);

        if (
          !localWallet ||
          new Date(wallet.updated_at) > new Date(localWallet.updated_at)
        ) {
          this.walletStorage.saveWallet({ ...wallet, needs_sync: false });
        }
      });
    }
  }

  async syncAll(): Promise<void> {
    await this.syncWallets();

    const wallets = this.walletStorage.getAllWallets();

    for (const wallet of wallets) {
      await this.syncTransactions(wallet.id);
    }
  }

  getSyncStatus(walletId: string): SyncStatus {
    const pendingTransactions =
      this.transactionStorage.getTransactionsNeedingSync(walletId);
    const lastSync = this.transactionStorage.getLastSyncTimestamp(walletId);

    const pendingUploads = pendingTransactions.filter(
      (t) => !t.deleted_at,
    ).length;
    const pendingDeletes = pendingTransactions.filter(
      (t) => t.deleted_at,
    ).length;

    return {
      lastSyncAt: lastSync,
      pendingUploads,
      pendingDeletes,
      isSyncing: false,
    };
  }
}

export function createSyncService(
  transactionRepo: ITransactionRepository,
  transactionStorage: ITransactionLocalStorage,
  walletRepo: IWalletRepository,
  walletStorage: IWalletLocalStorage,
): ISyncService {
  return new SyncService(
    transactionRepo,
    transactionStorage,
    walletRepo,
    walletStorage,
  );
}
