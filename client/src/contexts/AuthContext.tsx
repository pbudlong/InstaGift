import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CORRECT_PASSWORD = 'iGft';
const AUTH_KEY = 'instagift_auth';
const EXPIRY_HOURS = 24;

interface AuthState {
  lastActivity: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  checkPassword: (password: string) => boolean;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;

    try {
      const authState: AuthState = JSON.parse(stored);
      const now = Date.now();
      const hoursSinceActivity = (now - authState.lastActivity) / (1000 * 60 * 60);

      if (hoursSinceActivity < EXPIRY_HOURS) {
        updateActivity();
        return true;
      } else {
        localStorage.removeItem(AUTH_KEY);
        return false;
      }
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
  };

  const updateActivity = () => {
    const authState: AuthState = {
      lastActivity: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  };

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      updateActivity();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [isAuthenticated]);

  const checkPassword = (password: string): boolean => {
    if (password.length === 4 && password === CORRECT_PASSWORD) {
      updateActivity();
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkPassword, updateActivity }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
