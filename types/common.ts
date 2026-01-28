export interface SyncableEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  needs_sync: boolean;
  user_id: string;
  wallet_id: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface SyncStatus {
  lastSyncAt: string | null;
  pendingUploads: number;
  pendingDeletes: number;
  isSyncing: boolean;
}

export type SyncOperation = "create" | "update" | "delete";

export interface SyncQueueItem {
  id: string;
  entityType: "transaction" | "wallet" | "category";
  entityId: string;
  operation: SyncOperation;
  payload: unknown;
  attempts: number;
  lastAttemptAt: string | null;
  createdAt: string;
}
