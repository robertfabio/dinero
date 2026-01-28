import type { ApiResponse, PaginatedResponse, SyncableEntity } from "./common";

export type WalletType = "personal" | "business" | "family" | "shared";

export interface Wallet extends SyncableEntity {
  name: string;
  type: WalletType;
  currency: string;
  icon: string | null;
  color: string | null;
  balance: number;
  isDefault: boolean;
  members: WalletMember[];
}

export interface WalletMember {
  userId: string;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: string;
}

export interface CreateWalletDTO {
  name: string;
  type: WalletType;
  currency: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface UpdateWalletDTO {
  name?: string;
  type?: WalletType;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface WalletState {
  wallets: Wallet[];
  currentWalletId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface IWalletRepository {
  create(dto: CreateWalletDTO): Promise<ApiResponse<Wallet>>;
  update(id: string, dto: UpdateWalletDTO): Promise<ApiResponse<Wallet>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getById(id: string): Promise<ApiResponse<Wallet>>;
  getAll(): Promise<ApiResponse<Wallet[]>>;
  getByUserId(userId: string): Promise<PaginatedResponse<Wallet>>;
  setDefault(id: string): Promise<ApiResponse<Wallet>>;
}

export interface IWalletLocalStorage {
  saveWallet(wallet: Wallet): void;
  getWallet(id: string): Wallet | null;
  getAllWallets(): Wallet[];
  deleteWallet(id: string): void;
  getCurrentWalletId(): string | null;
  setCurrentWalletId(id: string): void;
  getWalletsNeedingSync(): Wallet[];
  markAsSynced(id: string): void;
}
