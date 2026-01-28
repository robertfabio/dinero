import type {
    AuthChangeEvent,
    Session,
    Subscription,
} from "@supabase/supabase-js";
import type { ApiResponse, IAuthService, User, UserSession } from "../../types";
import { getSupabaseClient } from "./client";

function mapSupabaseUserToUser(supabaseUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
  last_sign_in_at?: string;
}): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    displayName:
      (supabaseUser.user_metadata?.full_name as string) ??
      (supabaseUser.user_metadata?.name as string) ??
      null,
    avatarUrl:
      (supabaseUser.user_metadata?.avatar_url as string) ??
      (supabaseUser.user_metadata?.picture as string) ??
      null,
    createdAt: supabaseUser.created_at ?? new Date().toISOString(),
    lastLoginAt: supabaseUser.last_sign_in_at ?? new Date().toISOString(),
  };
}

function mapSessionToUserSession(session: Session): UserSession {
  return {
    user: mapSupabaseUserToUser(session.user),
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: session.expires_at ?? 0,
  };
}

export class SupabaseAuthService implements IAuthService {
  private subscriptions: Map<string, Subscription> = new Map();

  async signInWithGoogle(idToken: string): Promise<ApiResponse<UserSession>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        return {
          data: null,
          error: {
            code: error.code ?? "AUTH_ERROR",
            message: error.message,
            details: error,
          },
          success: false,
        };
      }

      if (!data.session) {
        return {
          data: null,
          error: {
            code: "NO_SESSION",
            message: "Authentication succeeded but no session was created",
          },
          success: false,
        };
      }

      return {
        data: mapSessionToUserSession(data.session),
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: {
          code: "UNEXPECTED_ERROR",
          message: error.message,
          details: error,
        },
        success: false,
      };
    }
  }

  async signOut(): Promise<ApiResponse<void>> {
    try {
      const client = getSupabaseClient();
      const { error } = await client.auth.signOut();

      if (error) {
        return {
          data: null,
          error: {
            code: error.code ?? "SIGNOUT_ERROR",
            message: error.message,
          },
          success: false,
        };
      }

      return { data: undefined, error: null, success: true };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: {
          code: "UNEXPECTED_ERROR",
          message: error.message,
        },
        success: false,
      };
    }
  }

  async refreshSession(
    refreshToken: string,
  ): Promise<ApiResponse<UserSession>> {
    try {
      const client = getSupabaseClient();

      const { data, error } = await client.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        return {
          data: null,
          error: {
            code: error.code ?? "REFRESH_ERROR",
            message: error.message,
          },
          success: false,
        };
      }

      if (!data.session) {
        return {
          data: null,
          error: {
            code: "NO_SESSION",
            message: "Session refresh succeeded but no session was returned",
          },
          success: false,
        };
      }

      return {
        data: mapSessionToUserSession(data.session),
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: {
          code: "UNEXPECTED_ERROR",
          message: error.message,
        },
        success: false,
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.getUser();

      if (error) {
        return {
          data: null,
          error: {
            code: error.code ?? "USER_ERROR",
            message: error.message,
          },
          success: false,
        };
      }

      if (!data.user) {
        return {
          data: null,
          error: {
            code: "NO_USER",
            message: "No authenticated user found",
          },
          success: false,
        };
      }

      return {
        data: mapSupabaseUserToUser(data.user),
        error: null,
        success: true,
      };
    } catch (err) {
      const error = err as Error;
      return {
        data: null,
        error: {
          code: "UNEXPECTED_ERROR",
          message: error.message,
        },
        success: false,
      };
    }
  }

  onAuthStateChange(
    callback: (session: UserSession | null) => void,
  ): () => void {
    const client = getSupabaseClient();
    const subscriptionId = crypto.randomUUID();

    const { data } = client.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        callback(session ? mapSessionToUserSession(session) : null);
      },
    );

    this.subscriptions.set(subscriptionId, data.subscription);

    return () => {
      const subscription = this.subscriptions.get(subscriptionId);
      if (subscription) {
        subscription.unsubscribe();
        this.subscriptions.delete(subscriptionId);
      }
    };
  }
}

export const authService = new SupabaseAuthService();
