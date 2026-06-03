"use client";

import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        localStorage.setItem("wasLoggedIn", "true");
      } else {
        localStorage.removeItem("wasLoggedIn");
      }
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Returning users: skip the spinner and render children optimistically.
  // AppLayout suppresses the redirect while loading is still true.
  const wasLoggedIn =
    typeof window !== "undefined" &&
    localStorage.getItem("wasLoggedIn") === "true";

  if (loading && !wasLoggedIn) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-muted/30">
        <div
          className="size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">Loading session…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
