"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addButtonClass } from "@/components/layout/RowParts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchField } from "@/components/ui/search-field";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import {
  getOrderedOptionGroupRefs,
  mergeOptionGroupSelection,
} from "@/lib/menu-item-option-groups";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { alertDialog } from "@/stores/useModalStore";
import { setMenuItemOptionGroups } from "@/lib/linked-writes";

export default function AddOptionGroupForm({ item }: { item: MenuItem }) {
  const { optionGroups } = useOptionGroupStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await setMenuItemOptionGroups(
        item.id!,
        mergeOptionGroupSelection(item, selected),
      );
      setOpen(false);
    } catch (err) {
      console.error("Failed to save option groups:", err);
      await alertDialog("Couldn't save option groups. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter option groups by search
  const filteredGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setSelected(
              getOrderedOptionGroupRefs(item).map((r) => r.optionGroupId),
            );
          }
        }}
      >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={addButtonClass}>
          + Add option groups
        </Button>
      </DialogTrigger>

      <DialogContent className="mx-auto flex !max-w-[calc(100vw-1rem)] w-[calc(100vw-1rem)] max-h-[90dvh] !flex-col gap-4 items-stretch sm:w-[80vw] sm:!max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Option Groups to {item.name}</DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="mb-0 shrink-0">
          <SearchField
            placeholder="Search option groups…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search option groups"
          />
        </div>

        {/* Scrollable list */}
        <div className="max-h-[min(52dvh,24rem)] space-y-2 overflow-y-auto sm:max-h-[calc(80vh-180px)]">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <label
                key={group.id}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(group.id!)}
                  onCheckedChange={() => toggleSelect(group.id!)}
                  disabled={loading}
                />
                <span>
                  {group.name} - Min: {group.minSelection} Max:{" "}
                  {group.maxSelection}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              No option groups match your search
            </p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
