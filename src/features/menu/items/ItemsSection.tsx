"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useItemStore } from "@/stores/useItemStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import { CreateItemForm } from "./CreateItemForm";
import { ItemList } from "./ItemList";

export function ItemsSection() {
  const items = useItemStore((s) => s.items);
  const loading = useItemStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Items"
        count={loading && items.length === 0 ? undefined : items.length}
      >
        <CreateItemForm />
      </PageHeader>
      <ItemList />
    </div>
  );
}
