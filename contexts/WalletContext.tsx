import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from 'react';
import { walletStorage } from '../services/local';
import { walletRepository } from '../services/supabase';
import type {
    CreateWalletDTO,
    UpdateWalletDTO,
    Wallet,
    WalletState,
} from '../types';
import { useAuth } from './AuthContext';

type WalletAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_WALLETS'; payload: Wallet[] }
  | { type: 'ADD_WALLET'; payload: Wallet }
  | { type: 'UPDATE_WALLET'; payload: Wallet }
  | { type: 'REMOVE_WALLET'; payload: string }
  | { type: 'SET_CURRENT_WALLET'; payload: string }
  | { type: 'SET_ERROR'; payload: string };

interface WalletContextValue extends WalletState {
  currentWallet: Wallet | null;
  createWallet: (dto: CreateWalletDTO) => Promise<Wallet | null>;
  updateWallet: (id: string, dto: UpdateWalletDTO) => Promise<boolean>;
  deleteWallet: (id: string) => Promise<boolean>;
  switchWallet: (id: string) => void;
  refreshWallets: () => Promise<void>;
}

const initialState: WalletState = {
  wallets: [],
  currentWalletId: null,
  isLoading: true,
  error: null,
};

function walletReducer(state: WalletState, action: WalletAction): WalletState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_WALLETS':
      return { ...state, wallets: action.payload, isLoading: false };

    case 'ADD_WALLET':
      return { ...state, wallets: [...state.wallets, action.payload] };

    case 'UPDATE_WALLET':
      return {
        ...state,
        wallets: state.wallets.map(w =>
          w.id === action.payload.id ? action.payload : w
        ),
      };

    case 'REMOVE_WALLET':
      return {
        ...state,
        wallets: state.wallets.filter(w => w.id !== action.payload),
        currentWalletId:
          state.currentWalletId === action.payload
            ? state.wallets.find(w => w.id !== action.payload)?.id ?? null
            : state.currentWalletId,
      };

    case 'SET_CURRENT_WALLET':
      return { ...state, currentWalletId: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [state, dispatch] = useReducer(walletReducer, initialState);

  const loadWallets = useCallback(() => {
    const wallets = walletStorage.getAllWallets();
    const currentId = walletStorage.getCurrentWalletId();

    dispatch({ type: 'SET_WALLETS', payload: wallets });

    if (currentId && wallets.some(w => w.id === currentId)) {
      dispatch({ type: 'SET_CURRENT_WALLET', payload: currentId });
    } else if (wallets.length > 0) {
      const defaultWallet = wallets.find(w => w.isDefault) ?? wallets[0];
      dispatch({ type: 'SET_CURRENT_WALLET', payload: defaultWallet.id });
      walletStorage.setCurrentWalletId(defaultWallet.id);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadWallets();
    }
  }, [isAuthenticated, loadWallets]);

  const currentWallet = useMemo(() => {
    if (!state.currentWalletId) return null;
    return state.wallets.find(w => w.id === state.currentWalletId) ?? null;
  }, [state.wallets, state.currentWalletId]);

  const createWallet = useCallback(
    async (dto: CreateWalletDTO): Promise<Wallet | null> => {
      if (!user) return null;

      try {
        const now = new Date().toISOString();
        const newWallet: Wallet = {
          id: crypto.randomUUID(),
          ...dto,
          icon: dto.icon ?? null,
          color: dto.color ?? null,
          balance: 0,
          isDefault: dto.isDefault ?? false,
          members: [{ userId: user.id, role: 'owner', joinedAt: now }],
          user_id: user.id,
          wallet_id: '',
          created_at: now,
          updated_at: now,
          deleted_at: null,
          needs_sync: true,
        };
        newWallet.wallet_id = newWallet.id;

        walletStorage.saveWallet(newWallet);
        dispatch({ type: 'ADD_WALLET', payload: newWallet });

        walletRepository.create(dto).then(result => {
          if (result.success) {
            walletStorage.markAsSynced(newWallet.id);
          }
        });

        return newWallet;
      } catch {
        return null;
      }
    },
    [user]
  );

  const updateWallet = useCallback(
    async (id: string, dto: UpdateWalletDTO): Promise<boolean> => {
      try {
        const existing = walletStorage.getWallet(id);
        if (!existing) return false;

        const updated: Wallet = {
          ...existing,
          ...dto,
          updated_at: new Date().toISOString(),
          needs_sync: true,
        };

        walletStorage.saveWallet(updated);
        dispatch({ type: 'UPDATE_WALLET', payload: updated });

        walletRepository.update(id, dto).then(result => {
          if (result.success) {
            walletStorage.markAsSynced(id);
          }
        });

        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const deleteWallet = useCallback(async (id: string): Promise<boolean> => {
    try {
      walletStorage.deleteWallet(id);
      dispatch({ type: 'REMOVE_WALLET', payload: id });

      walletRepository.delete(id);

      return true;
    } catch {
      return false;
    }
  }, []);

  const switchWallet = useCallback((id: string) => {
    walletStorage.setCurrentWalletId(id);
    dispatch({ type: 'SET_CURRENT_WALLET', payload: id });
  }, []);

  const refreshWallets = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const result = await walletRepository.getAll();

    if (result.success && result.data) {
      result.data.forEach((wallet: Wallet) => {
        walletStorage.saveWallet({ ...wallet, needs_sync: false });
      });
    }

    loadWallets();
  }, [loadWallets]);

  const value = useMemo<WalletContextValue>(
    () => ({
      ...state,
      currentWallet,
      createWallet,
      updateWallet,
      deleteWallet,
      switchWallet,
      refreshWallets,
    }),
    [state, currentWallet, createWallet, updateWallet, deleteWallet, switchWallet, refreshWallets]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export default WalletProvider;
