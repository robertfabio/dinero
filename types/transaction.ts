import type {
    ApiResponse,
    PaginatedResponse,
    PaginationParams,
    SyncableEntity,
} from "./common";

export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "pending" | "completed" | "cancelled";
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Transaction extends SyncableEntity {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  categoryId: string;
  description: string;
  notes: string | null;
  date: string;
  isRecurring: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate: string | null;
  parentTransactionId: string | null;
  attachments: string[];
  tags: string[];
  location: TransactionLocation | null;
  metadata: Record<string, unknown>;
}

export interface TransactionLocation {
  latitude: number;
  longitude: number;
  address: string | null;
}

export interface CreateTransactionDTO {
  amount: number;
  type: TransactionType;
  categoryId: string;
  description: string;
  notes?: string;
  date: string;
  isRecurring?: boolean;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: string;
  tags?: string[];
  location?: TransactionLocation;
  metadata?: Record<string, unknown>;
}

export interface UpdateTransactionDTO {
  amount?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  categoryId?: string;
  description?: string;
  notes?: string;
  date?: string;
  tags?: string[];
  location?: TransactionLocation;
  metadata?: Record<string, unknown>;
}

export interface TransactionFilters {
  walletId?: string;
  type?: TransactionType;
  status?: TransactionStatus;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  tags?: string[];
  searchQuery?: string;
  includeDeleted?: boolean;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  byCategory: CategorySummary[];
  byDate: DateSummary[];
}

export interface CategorySummary {
  categoryId: string;
  total: number;
  count: number;
  percentage: number;
}

export interface DateSummary {
  date: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface ITransactionRepository {
  create(dto: CreateTransactionDTO): Promise<ApiResponse<Transaction>>;
  update(
    id: string,
    dto: UpdateTransactionDTO,
  ): Promise<ApiResponse<Transaction>>;
  delete(id: string): Promise<ApiResponse<void>>;
  getById(id: string): Promise<ApiResponse<Transaction>>;
  getAll(
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Transaction>>;
  getSummary(
    walletId: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<TransactionSummary>>;
  syncToRemote(
    transactions: Transaction[],
  ): Promise<ApiResponse<Transaction[]>>;
  fetchFromRemote(
    lastSyncAt: string | null,
  ): Promise<ApiResponse<Transaction[]>>;
}

export interface ITransactionLocalStorage {
  saveTransaction(walletId: string, transaction: Transaction): void;
  getTransaction(walletId: string, id: string): Transaction | null;
  getAllTransactions(walletId: string, includeDeleted?: boolean): Transaction[];
  softDeleteTransaction(walletId: string, id: string): void;
  getTransactionsNeedingSync(walletId: string): Transaction[];
  markAsSynced(walletId: string, id: string): void;
  bulkSave(walletId: string, transactions: Transaction[]): void;
  getLastSyncTimestamp(walletId: string): string | null;
  setLastSyncTimestamp(walletId: string, timestamp: string): void;
}
