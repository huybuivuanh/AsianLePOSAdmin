// app/providers/StoreProvider.tsx
"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useOptionStore } from "@/app/store/useOptionStore";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { useItemStore } from "@/app/store/useItemStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { subscribe: subscribeCategories } = useCategoriesStore();
  const { subscribe: subscribeItems } = useItemStore();
  const { subscribe: subscribeOptionGroups } = useOptionGroupStore();
  const { subscribe: subscribeOptions } = useOptionStore();

  useEffect(() => {
    const unsubCategories = subscribeCategories();
    const unsubItems = subscribeItems();
    const unsubGroups = subscribeOptionGroups();
    const unsubOptions = subscribeOptions();

    return () => {
      unsubCategories();
      unsubItems();
      unsubGroups();
      unsubOptions();
    };
  }, [
    subscribeCategories,
    subscribeItems,
    subscribeOptionGroups,
    subscribeOptions,
  ]);

  return <>{children}</>;
}
