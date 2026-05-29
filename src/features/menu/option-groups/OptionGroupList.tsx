"use client";

import { useState } from "react";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { SearchField } from "@/components/ui/search-field";
import { matchesQuery } from "@/lib/list-utils";
import { OptionGroupCard } from "./OptionGroupCard";

export default function OptionGroupsList() {
  const { optionGroups, loading } = useOptionGroupStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading option groups…</p>
    );
  }

  const filtered = optionGroups.filter((g) => matchesQuery(searchTerm, g.name));

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search option groups…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search option groups"
      />

      <ul className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((group) => (
            <OptionGroupCard key={group.id} group={group} />
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No option groups match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
