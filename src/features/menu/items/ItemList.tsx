"use client";

import { useState } from "react";
import { useItemStore } from "@/stores/useItemStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState } from "@/components/layout/RowParts";
import { matchesQuery } from "@/lib/list-utils";
import { ItemCard } from "./ItemCard";

export default function ItemsList() {
  const { items, loading } = useItemStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading items…</p>;
  }

  const filtered = items.filter((item) => matchesQuery(searchTerm, item.name));

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search items…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search items"
      />

      {items.length === 0 ? (
        <EmptyState title="No items yet." hint="Add one to get started." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No items match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}
