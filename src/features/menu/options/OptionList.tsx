"use client";

import { useState } from "react";
import { useOptionStore } from "@/stores/useOptionStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import { deleteOption } from "@/lib/linked-writes";
import { SearchField } from "@/components/ui/search-field";
import {
  EmptyState,
  RowActions,
  UnusedBadge,
  rowCardClass,
} from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { UpdateOptionForm } from "./UpdateOptionForm";

export function OptionList() {
  const { options, loading } = useOptionStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (option: ItemOption) => {
    if (
      !(await confirmDialog(`Delete "${option.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    setDeletingId(option.id!);
    try {
      await deleteOption(option.id!);
    } catch (err) {
      console.error("Failed to delete option:", err);
      await alertDialog(`Couldn't delete "${option.name}". Try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading options…</p>;
  }

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search options…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search options"
      />

      {options.length === 0 ? (
        <EmptyState title="No options yet." hint="Add one to get started." />
      ) : filteredOptions.length === 0 ? (
        <EmptyState
          title={`No options match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filteredOptions.map((opt) => {
            const isUnused = (opt.groupIds?.length ?? 0) === 0;
            const deleting = deletingId === opt.id;

            return (
              <li
                key={opt.id}
                className={cn(
                  rowCardClass,
                  "flex items-center gap-3 px-3 py-3 sm:px-4",
                  deleting && "opacity-50",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <p className="truncate font-medium text-foreground">{opt.name}</p>
                    {isUnused && <UnusedBadge />}
                  </div>
                  <p className="text-sm text-foreground/50">
                    {formatCurrency(opt.price)}
                  </p>
                </div>
                <RowActions
                  name={opt.name}
                  onDelete={() => handleDelete(opt)}
                  deleting={deleting}
                >
                  <UpdateOptionForm option={opt} />
                </RowActions>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
