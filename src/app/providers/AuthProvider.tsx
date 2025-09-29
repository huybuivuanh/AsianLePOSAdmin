"use client";

import {
  onAuthStateChanged,
  User,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{ user: User | null }>({ user: null });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
