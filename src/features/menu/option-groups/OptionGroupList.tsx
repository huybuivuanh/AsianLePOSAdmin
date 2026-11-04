"use client";

import { useMemo, useState } from "react";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState, UnusedFilterButton } from "@/components/layout/RowParts";
import { isUnusedOptionGroup } from "@/lib/menu-unused";
import { matchesQuery } from "@/lib/list-utils";
import { OptionGroupCard } from "./OptionGroupCard";

export function OptionGroupList() {
  const { optionGroups, loading } = useOptionGroupStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [unusedOnly, setUnusedOnly] = useState(false);
  const unusedCount = useMemo(
    () => optionGroups.filter(isUnusedOptionGroup).length,
    [optionGroups],
  );

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading option groups…</p>;
  }

  const filtered = optionGroups.filter(
    (g) => matchesQuery(searchTerm, g.name) && (!unusedOnly || isUnusedOptionGroup(g)),
  );

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <SearchField
          className="min-w-0 flex-1"
          placeholder="Search option groups…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search option groups"
        />
        <UnusedFilterButton
          active={unusedOnly}
          count={unusedCount}
          onToggle={() => setUnusedOnly((v) => !v)}
          title="Option groups not used by any item"
        />
      </div>

      {optionGroups.length === 0 ? (
        <EmptyState title="No option groups yet." hint="Add one to get started." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            searchTerm.trim()
              ? `No ${unusedOnly ? "unused " : ""}option groups match “${searchTerm.trim()}”.`
              : "No unused option groups."
          }
          hint={
            unusedOnly
              ? "Turn off the Unused filter to see all option groups."
              : "Try a different search."
          }
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
