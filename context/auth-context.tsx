"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
  id: string;
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `user=${encodeURIComponent(JSON.stringify(newUser))}; path=/; max-age=86400; SameSite=Lax`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/auth/signin";
  };

  const isLoggedIn = !!token && !!user;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const isEditor = user?.role?.toUpperCase() === "EDITOR";

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isAdmin, isEditor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
