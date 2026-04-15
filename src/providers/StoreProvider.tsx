"use client";

import { useAuth } from "./AuthProvider";
import { useEffect } from "react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useItemStore } from "@/stores/useItemStore";
import { useUserStore } from "@/stores/useUserStore";
import { useTableStore } from "@/stores/useTableStore";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { subscribe: subscribeCategories } = useCategoriesStore();
  const { subscribe: subscribeItems } = useItemStore();
  const { subscribe: subscribeOptionGroups } = useOptionGroupStore();
  const { subscribe: subscribeOptions } = useOptionStore();
  const { subscribe: subscribeUsers } = useUserStore();
  const { subscribe: subscribeTables } = useTableStore();
  const { subscribe: subscribeCustomers } = useCustomerStore();
  const { subscribe: subscribeMenuChanges } = useMenuChangeStore();

  useEffect(() => {
    const unsubCategories = subscribeCategories();
    const unsubItems = subscribeItems();
    const unsubGroups = subscribeOptionGroups();
    const unsubOptions = subscribeOptions();
    const unsubUsers = subscribeUsers();
    const unsubTables = subscribeTables();
    const unsubCustomers = subscribeCustomers();
    const unsubMenuChanges = subscribeMenuChanges();

    return () => {
      unsubCategories();
      unsubItems();
      unsubGroups();
      unsubOptions();
      unsubUsers();
      unsubTables();
      unsubCustomers();
      unsubMenuChanges();
    };
  }, [
    loading,
    user,
    subscribeCategories,
    subscribeItems,
    subscribeOptionGroups,
    subscribeOptions,
    subscribeUsers,
    subscribeTables,
    subscribeCustomers,
    subscribeMenuChanges,
  ]);

  return <>{children}</>;
}
