"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateMenuChangeForm } from "@/features/menu-changes/CreateMenuChangeForm";
import { MenuChangeList } from "@/features/menu-changes/MenuChangeList";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";

export default function MenuChangesPage() {
  const menuChanges = useMenuChangeStore((s) => s.menuChanges);
  const loading = useMenuChangeStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Menu Changes" count={loading && menuChanges.length === 0 ? undefined : menuChanges.length}>
        <CreateMenuChangeForm />
      </PageHeader>
      <MenuChangeList />
    </div>
  );
}
