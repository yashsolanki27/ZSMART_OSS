import { createContext, useContext, useState, useCallback } from "react";

/**
 * AuthContext — minimal auth for Phase 1.
 * In Phase 2 this swaps to real JWT calls; the API stays identical
 * (login / logout / user) so components never change.
 */

const AuthContext = createContext(null);

const STORAGE_KEY = "zsmart.user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((username) => {
    const u = {
      username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: "Administrator",
      initials: username.charAt(0).toUpperCase(),
    };
    setUser(u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    return u;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
