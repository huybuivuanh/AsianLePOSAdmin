"use client";

import { useState } from "react";
import { useOptionStore } from "@/stores/useOptionStore";
import UpdateOptionForm from "./UpdateOptionForm";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { patchClearDefaultIfOptionRemoved } from "@/lib/option-group-updates";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

export default function OptionsList() {
  const { options, loading, deleteOption } = useOptionStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (option: ItemOption) => {
    if (!confirm("Are you sure you want to delete this option?")) return;
    setIsDeleting(option.id!);
    try {
      const updatePromises = (option.groupIds ?? []).map((groupId) => {
        const group = optionGroups.find((g) => g.id === groupId);
        if (!group) return Promise.resolve();
        const updatedOptionIds =
          group.optionIds?.filter((id) => id !== option.id) ?? [];
        return updateOptionGroup(groupId, {
          optionIds: updatedOptionIds,
          ...patchClearDefaultIfOptionRemoved(group, option.id),
        } as unknown as Partial<OptionGroup>);
      });

      await Promise.all(updatePromises);

      await deleteOption(option.id!);
    } catch (err) {
      console.error("Failed to delete option:", err);
      alert("Failed to delete option");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading options…</p>;
  }

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search options…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search options"
      />

      <ul className="space-y-3">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => (
            <li
              key={opt.id}
              className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <p className="font-medium break-words text-foreground">
                  {opt.name}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  ${opt.price.toFixed(2)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <UpdateOptionForm option={opt} />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(opt)}
                  disabled={isDeleting === opt.id}
                >
                  {isDeleting === opt.id ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No options match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
