import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { authApi, type AuthUser } from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "ssl_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAdmin: user?.role === "admin", login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
