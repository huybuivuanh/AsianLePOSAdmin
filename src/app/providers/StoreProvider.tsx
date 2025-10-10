// app/providers/StoreProvider.tsx
"use client";

import { useAuth } from "./AuthProvider";
import { useEffect } from "react";
import { useCategoriesStore } from "@/app/stores/useCategoriesStore";
import { useOptionStore } from "@/app/stores/useOptionStore";
import { useOptionGroupStore } from "@/app/stores/useOptionGroupStore";
import { useItemStore } from "@/app/stores/useItemStore";
import { useUserStore } from "../stores/useUserStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { subscribe: subscribeCategories } = useCategoriesStore();
  const { subscribe: subscribeItems } = useItemStore();
  const { subscribe: subscribeOptionGroups } = useOptionGroupStore();
  const { subscribe: subscribeOptions } = useOptionStore();
  const { subscribe: subscribeUsers } = useUserStore();

  useEffect(() => {
    const unsubCategories = subscribeCategories();
    const unsubItems = subscribeItems();
    const unsubGroups = subscribeOptionGroups();
    const unsubOptions = subscribeOptions();
    const unsubUsers = subscribeUsers();

    return () => {
      unsubCategories();
      unsubItems();
      unsubGroups();
      unsubOptions();
      unsubUsers();
    };
  }, [
    loading,
    user,
    subscribeCategories,
    subscribeItems,
    subscribeOptionGroups,
    subscribeOptions,
    subscribeUsers,
  ]);

  return <>{children}</>;
}
