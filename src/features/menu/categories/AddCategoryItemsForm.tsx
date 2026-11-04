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
import { useItemStore } from "@/stores/useItemStore";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { alertDialog } from "@/stores/useModalStore";
import { setCategoryItems } from "@/lib/linked-writes";

export function AddCategoryItemsForm({ category }: { category: FoodCategory }) {
  const { items } = useItemStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(category.itemIds ?? []);
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
      await setCategoryItems(category.id!, selected);
      setOpen(false);
    } catch (err) {
      console.error("Failed to save category items:", err);
      await alertDialog("Couldn't save category items. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) {
            setSelected(category.itemIds ?? []);
            setSearchTerm("");
          }
          setOpen(next);
        }}
      >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={addButtonClass}>
          + Add items
        </Button>
      </DialogTrigger>

      <DialogContent className="mx-auto flex !max-w-[calc(100vw-1rem)] w-[calc(100vw-1rem)] max-h-[90dvh] !flex-col gap-4 items-stretch sm:w-[80vw] sm:!max-w-[90vw]">
        <DialogHeader>
          <DialogTitle>Add Items to {category.name}</DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="mb-0 shrink-0">
          <SearchField
            placeholder="Search items…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search items"
          />
        </div>

        {/* Scrollable items list */}
        <div className="max-h-[min(52dvh,24rem)] space-y-2 overflow-y-auto sm:max-h-[calc(80vh-220px)]">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(item.id!)}
                  onCheckedChange={() => toggleSelect(item.id!)}
                  disabled={loading}
                />
                <span>
                  {item.name} – ${item.price.toFixed(2)}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">
              No items match your search
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
