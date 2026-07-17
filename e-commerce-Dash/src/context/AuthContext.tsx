import * as React from 'react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getRole,
  getUserId,
  getUserName,
  getUserEmail,
  setRole,
  setUserId,
  setUserName,
  setUserEmail,
  clearAuth as clearAuthStorage,
} from '../auth';

interface AuthState {
  role: string;
  userId: string;
  userName: string;
  userEmail: string;
}

interface AuthContextType {
  auth: AuthState;
  updateAuth: (data: { role: string; user: { _id: string; name: string; email: string } }) => void;
  clearAuth: () => void;
}

const defaultAuth: AuthState = {
  role: getRole() || '',
  userId: getUserId(),
  userName: getUserName(),
  userEmail: getUserEmail(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>(defaultAuth);

  const updateAuth = useCallback((data: { role: string; user: { _id: string; name: string; email: string } }) => {
    setRole(data.role);
    setUserId(data.user._id);
    setUserName(data.user.name);
    setUserEmail(data.user.email);
    setAuth({ role: data.role, userId: data.user._id, userName: data.user.name, userEmail: data.user.email });
  }, []);

  const clearAuth = useCallback(() => {
    clearAuthStorage();
    setAuth({ role: '', userId: '', userName: '', userEmail: '' });
  }, []);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
