"use client";

import { useState } from "react";
import { useItemStore } from "@/stores/useItemStore";
import { SearchField } from "@/components/ui/search-field";
import { matchesQuery } from "@/lib/list-utils";
import { ItemCard } from "./ItemCard";

export default function ItemsList() {
  const { items, loading } = useItemStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading items…</p>;
  }

  const filtered = items.filter((item) => matchesQuery(searchTerm, item.name));

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search items…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search items"
      />

      <ul className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No items match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
