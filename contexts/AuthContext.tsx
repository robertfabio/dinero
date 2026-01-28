import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react';
import { googleAuthProvider } from '../services/google';
import { authStorage, walletStorage } from '../services/local';
import { authService } from '../services/supabase';
import type { AuthState, User, UserSession, Wallet } from '../types';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { user: User; session: UserSession } }
  | { type: 'CLEAR_SESSION' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' };

interface AuthContextValue extends AuthState {
  signInWithGoogle: () => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_SESSION':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_SESSION':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const restoreSession = useCallback(async () => {
    try {
      const storedSession = await authStorage.getSession();

      if (!storedSession) {
        dispatch({ type: 'CLEAR_SESSION' });
        return;
      }

      const now = Date.now() / 1000;
      const isExpired = storedSession.expiresAt < now;

      if (isExpired) {
        const result = await authService.refreshSession(storedSession.refreshToken);

        if (result.success && result.data) {
          await authStorage.persistSession(result.data);
          await authStorage.persistUser(result.data.user);

          dispatch({
            type: 'SET_SESSION',
            payload: { user: result.data.user, session: result.data },
          });
        } else {
          await authStorage.clearSession();
          dispatch({ type: 'CLEAR_SESSION' });
        }
      } else {
        dispatch({
          type: 'SET_SESSION',
          payload: { user: storedSession.user, session: storedSession },
        });
      }
    } catch {
      dispatch({ type: 'CLEAR_SESSION' });
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (session) => {
      if (session) {
        await authStorage.persistSession(session);
        await authStorage.persistUser(session.user);
        dispatch({
          type: 'SET_SESSION',
          payload: { user: session.user, session },
        });
      } else {
        await authStorage.clearSession();
        dispatch({ type: 'CLEAR_SESSION' });
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const googleResult = await googleAuthProvider.signIn();

      if (!googleResult.success || !googleResult.data) {
        dispatch({
          type: 'SET_ERROR',
          payload: googleResult.error?.message ?? 'Failed to sign in with Google',
        });
        return false;
      }

      const authResult = await authService.signInWithGoogle(googleResult.data.idToken);

      if (!authResult.success || !authResult.data) {
        dispatch({
          type: 'SET_ERROR',
          payload: authResult.error?.message ?? 'Failed to authenticate with server',
        });
        return false;
      }

      await authStorage.persistSession(authResult.data);
      await authStorage.persistUser(authResult.data.user);

      const existingWallets = walletStorage.getAllWallets();
      if (existingWallets.length === 0) {
        const defaultWallet: Wallet = {
          id: crypto.randomUUID(),
          name: 'Pessoal',
          type: 'personal',
          currency: 'BRL',
          icon: 'wallet',
          color: '#6366F1',
          balance: 0,
          isDefault: true,
          members: [
            {
              userId: authResult.data.user.id,
              role: 'owner',
              joinedAt: new Date().toISOString(),
            },
          ],
          user_id: authResult.data.user.id,
          wallet_id: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null,
          needs_sync: true,
        };
        defaultWallet.wallet_id = defaultWallet.id;
        walletStorage.saveWallet(defaultWallet);
        walletStorage.setCurrentWalletId(defaultWallet.id);
      }

      dispatch({
        type: 'SET_SESSION',
        payload: { user: authResult.data.user, session: authResult.data },
      });

      return true;
    } catch (err) {
      const error = err as Error;
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return false;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await Promise.all([
        googleAuthProvider.signOut(),
        authService.signOut(),
        authStorage.clearSession(),
      ]);

      dispatch({ type: 'CLEAR_SESSION' });
    } catch {
      dispatch({ type: 'CLEAR_SESSION' });
    }
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const storedSession = await authStorage.getSession();

      if (!storedSession) {
        return false;
      }

      const result = await authService.refreshSession(storedSession.refreshToken);

      if (result.success && result.data) {
        await authStorage.persistSession(result.data);
        await authStorage.persistUser(result.data.user);

        dispatch({
          type: 'SET_SESSION',
          payload: { user: result.data.user, session: result.data },
        });

        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithGoogle,
      signOut,
      refreshSession,
    }),
    [state, signInWithGoogle, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
