"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { SearchField } from "@/components/ui/search-field";
import { matchesQuery } from "@/lib/list-utils";
import { MenuChangeCard } from "./MenuChangeCard";

export default function MenuChangeList() {
  const { menuChanges, loading, error } = useMenuChangeStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <div className="px-4 py-10 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Loading menu changes…
      </div>
    );
  }

  const filtered = menuChanges.filter((mc) =>
    matchesQuery(
      searchTerm,
      mc.name,
      ...mc.changes.flatMap((c) => [c.from, c.to]),
    ),
  );

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <SearchField
        placeholder="Search menu changes…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search menu changes"
      />

      <ul className="space-y-3">
        {menuChanges.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No menu changes yet. Use &quot;Add menu change&quot; to create the
            first one.
          </p>
        ) : filtered.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No menu changes match your search.
          </p>
        ) : (
          filtered.map((mc) => <MenuChangeCard key={mc.id} menuChange={mc} />)
        )}
      </ul>
    </div>
  );
}
