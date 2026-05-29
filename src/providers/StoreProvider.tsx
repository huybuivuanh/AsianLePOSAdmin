"use client";

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useItemStore } from "@/stores/useItemStore";
import { useUserStore } from "@/stores/useUserStore";
import { useTableStore } from "@/stores/useTableStore";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { useCreditStore } from "@/stores/useCreditStore";
import { useMenuVersionStore } from "@/stores/useMenuVersionStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  // Each hook must be called at the top level (Rules of Hooks).
  // Zustand returns stable function references so these never change between renders.
  const subscribeFns = [
    useCategoriesStore((s) => s.subscribe),
    useItemStore((s) => s.subscribe),
    useOptionGroupStore((s) => s.subscribe),
    useOptionStore((s) => s.subscribe),
    useUserStore((s) => s.subscribe),
    useTableStore((s) => s.subscribe),
    useCustomerStore((s) => s.subscribe),
    useMenuChangeStore((s) => s.subscribe),
    useCreditStore((s) => s.subscribe),
    useMenuVersionStore((s) => s.subscribe),
  ];

  useEffect(() => {
    const unsubs = subscribeFns.map((sub) => sub());
    return () => unsubs.forEach((unsub) => unsub());
    // subscribeFns are stable Zustand refs — user/loading are the real triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  return <>{children}</>;
}
