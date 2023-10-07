import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string, token: string) => void; // <-- Add the token parameter here
  logout: () => void;
}


interface AuthProviderProps {
    children: React.ReactNode;
  }

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Check if a token exists in localStorage upon initialization
  const [user, setUser] = useState<string | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally, you can decode the token and fetch user info if encoded in the token
      return "userFromToken";  // Replace with your logic, if any
    }
    return null;
  });

  const login = (username: string, token: string) => {
    setUser(username);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
