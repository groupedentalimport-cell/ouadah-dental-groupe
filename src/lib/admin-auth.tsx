'use client';

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  loading: true,
});

// Simple admin password — in production, this would be validated against a backend
const ADMIN_PASSWORD = 'odg2024';
const AUTH_KEY = 'odg_admin_auth';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStorageAuthSnapshot(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

function getServerAuthSnapshot(): boolean {
  return false;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticatedFromStorage = useSyncExternalStore(
    subscribeToStorage,
    getStorageAuthSnapshot,
    getServerAuthSnapshot
  );
  const [localAuth, setLocalAuth] = useState(false);
  const isAuthenticated = isAuthenticatedFromStorage || localAuth;

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setLocalAuth(true);
      try {
        localStorage.setItem(AUTH_KEY, 'true');
      } catch {
        // localStorage not available
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setLocalAuth(false);
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading: false }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
