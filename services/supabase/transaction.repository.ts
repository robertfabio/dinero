import type {
    ApiResponse,
    CreateTransactionDTO,
    ITransactionRepository,
    PaginatedResponse,
    PaginationParams,
    Transaction,
    TransactionFilters,
    TransactionSummary,
    UpdateTransactionDTO,
} from "../../types";
import { getSupabaseClient } from "./client";

export class SupabaseTransactionRepository implements ITransactionRepository {
  private readonly tableName = "transactions";

  private injectOwnership(
    data: Partial<Transaction>,
    userId: string,
    walletId: string,
  ): Partial<Transaction> {
    return {
      ...data,
      user_id: userId,
      wallet_id: walletId,
    };
  }

  async create(dto: CreateTransactionDTO): Promise<ApiResponse<Transaction>> {
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
      const transaction: Partial<Transaction> = {
        ...dto,
        id: crypto.randomUUID(),
        status: "completed",
        created_at: now,
        updated_at: now,
        deleted_at: null,
        needs_sync: false,
        attachments: [],
        tags: dto.tags ?? [],
        isRecurring: dto.isRecurring ?? false,
        recurrence: dto.recurrence ?? "none",
        parentTransactionId: null,
        metadata: dto.metadata ?? {},
      };

      const { data, error } = await client
        .from(this.tableName)
        .insert(
          this.injectOwnership(transaction, user.id, transaction.wallet_id!),
        )
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

      return { data: data as Transaction, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async update(
    id: string,
    dto: UpdateTransactionDTO,
  ): Promise<ApiResponse<Transaction>> {
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

      return { data: data as Transaction, error: null, success: true };
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

  async getById(id: string): Promise<ApiResponse<Transaction>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client
        .from(this.tableName)
        .select()
        .eq("id", id)
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

      return { data: data as Transaction, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async getAll(
    filters?: TransactionFilters,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Transaction>> {
    try {
      const client = getSupabaseClient();
      const page = pagination?.page ?? 1;
      const limit = pagination?.limit ?? 50;
      const offset = (page - 1) * limit;

      let query = client.from(this.tableName).select("*", { count: "exact" });

      if (filters?.walletId) {
        query = query.eq("wallet_id", filters.walletId);
      }

      if (!filters?.includeDeleted) {
        query = query.is("deleted_at", null);
      }

      if (filters?.type) {
        query = query.eq("type", filters.type);
      }

      if (filters?.categoryId) {
        query = query.eq("category_id", filters.categoryId);
      }

      if (filters?.startDate) {
        query = query.gte("date", filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte("date", filters.endDate);
      }

      if (filters?.minAmount !== undefined) {
        query = query.gte("amount", filters.minAmount);
      }

      if (filters?.maxAmount !== undefined) {
        query = query.lte("amount", filters.maxAmount);
      }

      if (filters?.searchQuery) {
        query = query.ilike("description", `%${filters.searchQuery}%`);
      }

      const { data, error, count } = await query
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { data: [], total: 0, page, hasMore: false };
      }

      const total = count ?? 0;

      return {
        data: (data as Transaction[]) ?? [],
        total,
        page,
        hasMore: offset + limit < total,
      };
    } catch {
      return { data: [], total: 0, page: 1, hasMore: false };
    }
  }

  async getSummary(
    walletId: string,
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<TransactionSummary>> {
    try {
      const { data: transactions } = await this.getAll(
        { walletId, startDate, endDate },
        { page: 1, limit: 1000 },
      );

      const totalIncome = transactions
        .filter((t: Transaction) => t.type === "income")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter((t: Transaction) => t.type === "expense")
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const categoryMap = new Map<string, { total: number; count: number }>();
      transactions.forEach((t: Transaction) => {
        const existing = categoryMap.get(t.categoryId) ?? {
          total: 0,
          count: 0,
        };
        categoryMap.set(t.categoryId, {
          total: existing.total + t.amount,
          count: existing.count + 1,
        });
      });

      const totalAmount = totalIncome + totalExpenses;
      const byCategory = Array.from(categoryMap.entries()).map(
        ([categoryId, stats]) => ({
          categoryId,
          total: stats.total,
          count: stats.count,
          percentage: totalAmount > 0 ? (stats.total / totalAmount) * 100 : 0,
        }),
      );

      const dateMap = new Map<string, { income: number; expenses: number }>();
      transactions.forEach((t: Transaction) => {
        const dateKey = t.date.split("T")[0];
        const existing = dateMap.get(dateKey) ?? { income: 0, expenses: 0 };
        if (t.type === "income") {
          existing.income += t.amount;
        } else if (t.type === "expense") {
          existing.expenses += t.amount;
        }
        dateMap.set(dateKey, existing);
      });

      const byDate = Array.from(dateMap.entries())
        .map(([date, stats]) => ({
          date,
          income: stats.income,
          expenses: stats.expenses,
          balance: stats.income - stats.expenses,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        data: {
          totalIncome,
          totalExpenses,
          balance: totalIncome - totalExpenses,
          transactionCount: transactions.length,
          byCategory,
          byDate,
        },
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "SUMMARY_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async syncToRemote(
    transactions: Transaction[],
  ): Promise<ApiResponse<Transaction[]>> {
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

      const enrichedTransactions = transactions.map((t) =>
        this.injectOwnership(t, user.id, t.wallet_id),
      );

      const { data, error } = await client
        .from(this.tableName)
        .upsert(enrichedTransactions, { onConflict: "id" })
        .select();

      if (error) {
        return {
          data: null,
          error: { code: "SYNC_ERROR", message: error.message, details: error },
          success: false,
        };
      }

      return { data: data as Transaction[], error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: { code: "UNEXPECTED_ERROR", message: error.message },
        success: false,
      };
    }
  }

  async fetchFromRemote(
    lastSyncAt: string | null,
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const client = getSupabaseClient();

      let query = client.from(this.tableName).select();

      if (lastSyncAt) {
        query = query.gt("updated_at", lastSyncAt);
      }

      const { data, error } = await query.order("updated_at", {
        ascending: true,
      });

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

      return { data: data as Transaction[], error: null, success: true };
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

export const transactionRepository = new SupabaseTransactionRepository();
