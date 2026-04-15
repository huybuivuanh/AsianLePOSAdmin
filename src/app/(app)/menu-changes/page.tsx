"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateMenuChangeForm, MenuChangeList } from "@/features/menu-changes";

export default function MenuChangesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Menu Changes"
        description="Track menu item changes synced from Firestore in real time."
      >
        <CreateMenuChangeForm />
      </PageHeader>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <MenuChangeList />
      </div>
    </div>
  );
}
