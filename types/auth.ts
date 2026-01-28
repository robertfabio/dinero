import type { ApiResponse } from "./common";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface UserSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthCredentials {
  idToken: string;
  provider: "google" | "apple";
}

export interface AuthState {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface IAuthService {
  signInWithGoogle(idToken: string): Promise<ApiResponse<UserSession>>;
  signOut(): Promise<ApiResponse<void>>;
  refreshSession(refreshToken: string): Promise<ApiResponse<UserSession>>;
  getCurrentUser(): Promise<ApiResponse<User>>;
  onAuthStateChange(
    callback: (session: UserSession | null) => void,
  ): () => void;
}

export interface IGoogleAuthProvider {
  configure(): Promise<void>;
  signIn(): Promise<ApiResponse<{ idToken: string }>>;
  signOut(): Promise<void>;
  isSignedIn(): Promise<boolean>;
}

export interface IAuthStorage {
  persistSession(session: UserSession): Promise<void>;
  getSession(): Promise<UserSession | null>;
  clearSession(): Promise<void>;
  persistUser(user: User): Promise<void>;
  getUser(): Promise<User | null>;
}
