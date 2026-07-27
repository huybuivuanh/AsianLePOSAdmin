"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useAddExtraStore } from "@/stores/useAddExtraStore";

export default function AddExtrasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const sub = useAddExtraStore((s) => s.subscribe);

  useEffect(() => {
    const unsub = sub();
    return unsub;
    // Zustand ref is stable; user/loading are the actual triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  return <>{children}</>;
}
