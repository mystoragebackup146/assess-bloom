import React, { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type User = {
  firstName: string;
  lastName?: string;
  email: string;
  role: "admin" | "user";
};

type AuthContextType = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("auth_user", null);

  const value = useMemo(
    () => ({
      user,
      login: (u: User) => setUser(u),
      logout: () => setUser(null),
    }),
    [user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
