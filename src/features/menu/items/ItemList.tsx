"use client";

import { useMemo, useState } from "react";
import { useItemStore } from "@/stores/useItemStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState, UnusedFilterButton } from "@/components/layout/RowParts";
import { isUnusedItem } from "@/lib/menu-unused";
import { matchesQuery } from "@/lib/list-utils";
import { ItemCard } from "./ItemCard";

export function ItemList() {
  const { items, loading } = useItemStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const unusedCount = useMemo(() => items.filter(isUnusedItem).length, [items]);

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading items…</p>;
  }

  const filtered = items.filter(
    (item) => matchesQuery(searchTerm, item.name) && (!unusedOnly || isUnusedItem(item)),
  );

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <SearchField
          className="min-w-0 flex-1"
          placeholder="Search items…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search items"
        />
        <UnusedFilterButton
          active={unusedOnly}
          count={unusedCount}
          onToggle={() => setUnusedOnly((v) => !v)}
          title="Items not in any category"
        />
      </div>

      {items.length === 0 ? (
        <EmptyState title="No items yet." hint="Add one to get started." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            searchTerm.trim()
              ? `No ${unusedOnly ? "unused " : ""}items match “${searchTerm.trim()}”.`
              : "No unused items."
          }
          hint={unusedOnly ? "Turn off the Unused filter to see all items." : "Try a different search."}
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
