"use client";

import { useState } from "react";
import { useAddExtraStore } from "@/stores/useAddExtraStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import { SearchField } from "@/components/ui/search-field";
import { EmptyState, RowActions, rowCardClass } from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { matchesQuery } from "@/lib/list-utils";
import { cn } from "@/lib/utils";
import { AddExtraForm } from "./AddExtraForm";

export function AddExtraList() {
  const { extras, loading, deleteExtra } = useAddExtraStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (extra: ExtraCatalogItem) => {
    if (
      !(await confirmDialog(`Delete "${extra.description}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    setDeletingId(extra.id!);
    try {
      await deleteExtra(extra.id!);
    } catch (err) {
      console.error("Failed to delete extra:", err);
      await alertDialog(`Couldn't delete "${extra.description}". Try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading extras…</p>;
  }

  const filteredExtras = extras.filter((extra) =>
    matchesQuery(searchTerm, extra.description),
  );

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search extras…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search extras"
      />

      {extras.length === 0 ? (
        <EmptyState title="No extras yet." hint="Add one to get started." />
      ) : filteredExtras.length === 0 ? (
        <EmptyState
          title={`No extras match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filteredExtras.map((extra) => {
            const deleting = deletingId === extra.id;
            return (
              <li
                key={extra.id}
                className={cn(
                  rowCardClass,
                  "flex items-center gap-3 px-3 py-3 sm:px-4",
                  deleting && "opacity-50",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium break-words text-foreground">
                    {extra.description}
                  </p>
                  <p className="text-sm text-foreground/50">
                    {formatCurrency(extra.price)}
                  </p>
                </div>
                <RowActions
                  name={extra.description}
                  onDelete={() => handleDelete(extra)}
                  deleting={deleting}
                >
                  <AddExtraForm extra={extra} />
                </RowActions>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
