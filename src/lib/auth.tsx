/**
 * Authentication Context
 *
 * Manages user authentication state across the app
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi, userApi, type User, type AuthResponse, ApiError } from './api';

// Storage keys
const TOKEN_KEY = 'VoxWrites_token';
const USER_KEY = 'VoxWrites_user';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Load initial state from localStorage
function loadStoredAuth(): { token: string | null; user: User | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

// Save auth to localStorage and notify extension
function saveAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Notify extension (if installed) about auth change
  try {
    window.postMessage({
      type: 'VoxWrites_AUTH_CHANGE',
      payload: { token, user }
    }, '*');
  } catch {
    // Extension might not be installed
  }
}

// Clear auth from localStorage and notify extension
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Notify extension about logout
  try {
    window.postMessage({
      type: 'VoxWrites_AUTH_CHANGE',
      payload: { token: null, user: null }
    }, '*');
  } catch {
    // Extension might not be installed
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    const { token, user } = loadStoredAuth();
    return {
      user,
      token,
      isLoading: !!token, // If we have a token, we need to verify it
      isAuthenticated: !!token && !!user,
    };
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!state.token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const user = await authApi.me(state.token);
        setState({
          user,
          token: state.token,
          isLoading: false,
          isAuthenticated: true,
        });
        saveAuth(state.token, user);
      } catch (error) {
        // Token is invalid, clear auth
        clearAuth();
        setState({
          user: null,
          token: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    verifyToken();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(email, password);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        tier: response.user.tier,
        is_pro: response.user.tier !== 'free',
        is_admin: response.user.is_admin,
      };

      saveAuth(response.access_token, user);
      setState({
        user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (email: string, password: string, name?: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.register(email, password, name);
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        tier: response.user.tier,
        is_pro: response.user.tier !== 'free',
        is_admin: response.user.is_admin,
      };

      saveAuth(response.access_token, user);
      setState({
        user,
        token: response.access_token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    if (state.token) {
      try {
        await authApi.logout(state.token);
      } catch {
        // Ignore logout errors
      }
    }

    clearAuth();
    setState({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, [state.token]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!state.token) return;

    try {
      const user = await authApi.me(state.token);
      setState(prev => ({ ...prev, user }));
      saveAuth(state.token, user);
    } catch {
      // Token might be expired
      await logout();
    }
  }, [state.token, logout]);

  // Update profile
  const updateProfile = useCallback(async (data: { name?: string; avatar_url?: string }) => {
    if (!state.token) throw new Error('Not authenticated');

    const user = await userApi.updateProfile(state.token, data);
    setState(prev => ({ ...prev, user }));
    if (state.token) {
      saveAuth(state.token, user);
    }
  }, [state.token]);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to require authentication
export function useRequireAuth(onNavigate: (page: string) => void) {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      onNavigate('login');
    }
  }, [auth.isLoading, auth.isAuthenticated, onNavigate]);

  return auth;
}
