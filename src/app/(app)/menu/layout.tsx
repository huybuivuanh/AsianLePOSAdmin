"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useItemStore } from "@/stores/useItemStore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { useMenuVersionStore } from "@/stores/useMenuVersionStore";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const subCategories = useCategoriesStore((s) => s.subscribe);
  const subItems = useItemStore((s) => s.subscribe);
  const subOptionGroups = useOptionGroupStore((s) => s.subscribe);
  const subOptions = useOptionStore((s) => s.subscribe);
  const subMenuVersion = useMenuVersionStore((s) => s.subscribe);

  useEffect(() => {
    const unsubs = [
      subCategories,
      subItems,
      subOptionGroups,
      subOptions,
      subMenuVersion,
    ].map((sub) => sub());
    return () => unsubs.forEach((u) => u());
    // Zustand refs are stable; user/loading are the actual triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  return <>{children}</>;
}
