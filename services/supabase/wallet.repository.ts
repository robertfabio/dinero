import type {
    ApiResponse,
    CreateWalletDTO,
    IWalletRepository,
    PaginatedResponse,
    UpdateWalletDTO,
    Wallet,
} from "../../types";
import { getSupabaseClient } from "./client";

export class SupabaseWalletRepository implements IWalletRepository {
  private readonly tableName = "wallets";

  async create(dto: CreateWalletDTO): Promise<ApiResponse<Wallet>> {
    try {
      const client = getSupabaseClient();
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return {
          data: null,
          error: { code: "UNAUTHORIZED", message: "User not authenticated" },
          success: false,
        };
      }

      const now = new Date().toISOString();
      const wallet: Partial<Wallet> = {
        id: crypto.randomUUID(),
        ...dto,
        user_id: user.id,
        wallet_id: "",
        balance: 0,
        members: [{ userId: user.id, role: "owner", joinedAt: now }],
        created_at: now,
        updated_at: now,
        deleted_at: null,
        needs_sync: false,
        isDefault: dto.isDefault ?? false,
      };

      wallet.wallet_id = wallet.id!;

      const { data, error } = await client
        .from(this.tableName)
        .insert(wallet)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: {
            code: "INSERT_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: data as Wallet, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async update(id: string, dto: UpdateWalletDTO): Promise<ApiResponse<Wallet>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from(this.tableName)
        .update({ ...dto, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: {
            code: "UPDATE_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: data as Wallet, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    try {
      const client = getSupabaseClient();

      const { error } = await client
        .from(this.tableName)
        .update({
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return {
          data: null,
          error: {
            code: "DELETE_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: undefined, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async getById(id: string): Promise<ApiResponse<Wallet>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from(this.tableName)
        .select()
        .eq("id", id)
        .is("deleted_at", null)
        .single();

      if (error) {
        return {
          data: null,
          error: {
            code: "FETCH_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: data as Wallet, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async getAll(): Promise<ApiResponse<Wallet[]>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from(this.tableName)
        .select()
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (error) {
        return {
          data: null,
          error: {
            code: "FETCH_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: data as Wallet[], error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async getByUserId(userId: string): Promise<PaginatedResponse<Wallet>> {
    try {
      const client = getSupabaseClient();

      const { data, error, count } = await client
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) {
        return { data: [], total: 0, page: 1, hasMore: false };
      }

      return {
        data: (data as Wallet[]) ?? [],
        total: count ?? 0,
        page: 1,
        hasMore: false,
      };
    } catch {
      return { data: [], total: 0, page: 1, hasMore: false };
    }
  }

  async setDefault(id: string): Promise<ApiResponse<Wallet>> {
    try {
      const client = getSupabaseClient();
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return {
          data: null,
          error: { code: "UNAUTHORIZED", message: "User not authenticated" },
          success: false,
        };
      }

      await client
        .from(this.tableName)
        .update({ is_default: false, updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      const { data, error } = await client
        .from(this.tableName)
        .update({ is_default: true, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          data: null,
          error: {
            code: "UPDATE_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      return { data: data as Wallet, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }
}

export const walletRepository = new SupabaseWalletRepository();
