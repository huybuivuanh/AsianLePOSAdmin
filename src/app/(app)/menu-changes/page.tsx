"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import CreateMenuChangeForm from "@/features/menu-changes/CreateMenuChangeForm";
import MenuChangeList from "@/features/menu-changes/MenuChangeList";

export default function MenuChangesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Menu Changes"
        description="Named substitution templates (e.g. &quot;Dinner for 5&quot;), each holding a list of item changes."
      >
        <CreateMenuChangeForm />
      </PageHeader>

      <MenuChangeList />
    </div>
  );
}
