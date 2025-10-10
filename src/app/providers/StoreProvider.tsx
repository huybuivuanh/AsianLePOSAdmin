// app/providers/StoreProvider.tsx
"use client";

import { useAuth } from "./AuthProvider";
import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useOptionStore } from "@/app/store/useOptionStore";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { useItemStore } from "@/app/store/useItemStore";
import { useUserStore } from "../store/useUserStore";

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
