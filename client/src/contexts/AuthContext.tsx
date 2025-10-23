import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CORRECT_PASSWORD = 'iGft';
const AUTH_KEY = 'instagift_auth';
const EXPIRY_HOURS = 24;

interface AuthState {
  lastActivity: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  checkPassword: (password: string) => Promise<boolean>;
  updateActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize state by checking localStorage on mount
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;

    try {
      const authState: AuthState = JSON.parse(stored);
      const now = Date.now();
      const hoursSinceActivity = (now - authState.lastActivity) / (1000 * 60 * 60);
      return hoursSinceActivity < EXPIRY_HOURS;
    } catch {
      return false;
    }
  });

  const updateActivity = () => {
    const authState: AuthState = {
      lastActivity: Date.now(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authState));
  };

  // Update activity on mount if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      updateActivity();
    }
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

  const checkPassword = async (password: string): Promise<boolean> => {
    if (password.length !== 4) {
      return false;
    }

    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setIsAuthenticated(true);
        updateActivity();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Password check error:', error);
      return false;
    }
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
