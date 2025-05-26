import React, { createContext, useContext, useState, useEffect } from 'react';

type UserTier = 'corporate' | 'personal';

interface AuthContextType {
  userTier: UserTier;
  setUserTier: (tier: UserTier) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to corporate tier for demonstration purposes
  const [userTier, setUserTier] = useState<UserTier>('corporate');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Simulate loading user data from local storage
  useEffect(() => {
    const storedTier = localStorage.getItem('userTier') as UserTier | null;
    if (storedTier) {
      setUserTier(storedTier);
    }
  }, []);
  
  // Store user tier in local storage when it changes
  useEffect(() => {
    localStorage.setItem('userTier', userTier);
  }, [userTier]);
  
  return (
    <AuthContext.Provider value={{ userTier, setUserTier, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
