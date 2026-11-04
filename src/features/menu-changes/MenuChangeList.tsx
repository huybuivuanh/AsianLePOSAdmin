"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState } from "@/components/layout/RowParts";
import { matchesQuery } from "@/lib/list-utils";
import { MenuChangeCard } from "./MenuChangeCard";

export default function MenuChangeList() {
  const { menuChanges, loading, error } = useMenuChangeStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (error) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading menu changes…</p>;
  }

  const filtered = menuChanges.filter((mc) =>
    matchesQuery(
      searchTerm,
      mc.name,
      ...mc.changes.flatMap((c) => [c.from, c.to]),
    ),
  );

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search menu changes…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search menu changes"
      />

      {menuChanges.length === 0 ? (
        <EmptyState
          title="No menu changes yet."
          hint="A menu change is a named set of substitutions, e.g. “Dinner for 5”."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No menu changes match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((mc) => (
            <MenuChangeCard key={mc.id} menuChange={mc} />
          ))}
        </ul>
      )}
    </div>
  );
}
