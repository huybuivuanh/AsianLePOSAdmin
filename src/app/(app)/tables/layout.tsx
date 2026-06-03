"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useTableStore } from "@/stores/useTableStore";

export default function TablesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const sub = useTableStore((s) => s.subscribe);

  useEffect(() => {
    const unsub = sub();
    return unsub;
    // Zustand ref is stable; user/loading are the actual triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  return <>{children}</>;
}
