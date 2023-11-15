import React, { createContext, useContext, useState } from "react";
import { decodePayload } from "./helpers";

export interface AuthContextProps {
  user: string | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  userLoading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true);

  const [user, setUser] = useState<string | null>(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const username = decodePayload(token);
        if (username) {
          setUserLoading(false);
          return username;
        }
      }
    } catch (error) {
      console.error("Error during user initialization", error);
    }
    setUserLoading(false);
    return null;
  });

  const login = (username: string, token: string) => {
    setUser(username);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
