import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthContextType } from '../types';

export interface StoredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const STORAGE_KEY_CURRENT_USER = 'docuclean_current_user';
const STORAGE_KEY_USERS = 'docuclean_registered_users';

const INITIAL_DEMO_USERS: StoredAccount[] = [
  {
    id: 'demo-user-1',
    name: 'Priyanka',
    email: 'priyanka@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
      if (savedUser) {
        return JSON.parse(savedUser) as AuthUser;
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Ensure default demo account is initialized in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_DEMO_USERS));
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const getStoredUsers = (): StoredAccount[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        return JSON.parse(stored) as StoredAccount[];
      }
    } catch {
      // ignore
    }
    return INITIAL_DEMO_USERS;
  };

  const saveStoredUsers = (users: StoredAccount[]) => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  };

  const signup = (name: string, email: string, password: string): { success: boolean; error?: string } => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      return { success: false, error: 'Full name is required' };
    }
    if (!trimmedEmail) {
      return { success: false, error: 'Email address is required' };
    }
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    const currentUsers = getStoredUsers();
    const existing = currentUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email is already registered. Please sign in.' };
    }

    const newAccount: StoredAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: trimmedName,
      email: trimmedEmail,
      password: password,
      createdAt: new Date().toISOString(),
    };

    saveStoredUsers([...currentUsers, newAccount]);

    // Sign Up creates the account and saves it, but does NOT automatically log in
    return { success: true };
  };

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      return { success: false, error: 'Please enter your email address' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password' };
    }

    const currentUsers = getStoredUsers();
    const foundEmail = currentUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    // Specific error matching user prompt:
    // "Wrong email -> Show: 'Account not found. Please check your email or create an account.'"
    if (!foundEmail) {
      return {
        success: false,
        error: 'Account not found. Please check your email or create an account.',
      };
    }

    // "Correct email + wrong password -> Show: 'Incorrect password. Please try again.'"
    if (foundEmail.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    // "Correct email + correct password -> Login successfully."
    const publicUser: AuthUser = {
      id: foundEmail.id,
      name: foundEmail.name,
      email: foundEmail.email,
      createdAt: foundEmail.createdAt,
    };

    setUser(publicUser);
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(publicUser));
    } catch {
      // ignore
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
