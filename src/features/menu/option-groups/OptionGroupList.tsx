"use client";

import { useState } from "react";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState } from "@/components/layout/RowParts";
import { matchesQuery } from "@/lib/list-utils";
import { OptionGroupCard } from "./OptionGroupCard";

export function OptionGroupList() {
  const { optionGroups, loading } = useOptionGroupStore();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading option groups…</p>;
  }

  const filtered = optionGroups.filter((g) => matchesQuery(searchTerm, g.name));

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search option groups…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search option groups"
      />

      {optionGroups.length === 0 ? (
        <EmptyState title="No option groups yet." hint="Add one to get started." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No option groups match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filtered.map((group) => (
            <OptionGroupCard key={group.id} group={group} />
          ))}
        </ul>
      )}
    </div>
  );
}
