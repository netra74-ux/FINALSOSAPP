import { useState, useCallback } from 'react';
import { MOCK_USER } from '~/data/mock-data';
import type { UserProfile } from '~/data/mock-data';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const login = useCallback((email: string, _password: string) => {
    setAuthError(null);
    if (email && _password) {
      setUser({ ...MOCK_USER, email });
      setIsAuthenticated(true);
    } else {
      setAuthError('Invalid credentials');
    }
  }, []);

  const signup = useCallback((name: string, email: string, phone: string, _password: string) => {
    setAuthError(null);
    if (name && email && phone && _password) {
      const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
      setUser({ ...MOCK_USER, name, email, phone, avatar: initials });
      setIsAuthenticated(true);
    } else {
      setAuthError('Please fill in all fields');
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  return { isAuthenticated, user, authError, authMode, setAuthMode, login, signup, logout, updateUser };
}
