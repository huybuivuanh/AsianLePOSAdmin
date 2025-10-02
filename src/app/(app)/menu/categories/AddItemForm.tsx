"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useItemStore } from "@/app/store/useItemStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";

export default function AddItemForm({ category }: { category: FoodCategory }) {
  const { items, updateItem } = useItemStore();
  const { updateCategory } = useCategoriesStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(category.itemIds ?? []);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update category with the final list of itemIds
      await updateCategory(category.id!, { itemIds: selected });

      // 2. Sync each item so categoryIds[] matches the checkboxes
      const updatePromises = items.map((item) => {
        const isSelected = selected.includes(item.id!);

        if (isSelected) {
          // Ensure category is included
          const updatedCategories = item.categoryIds?.includes(category.id!)
            ? item.categoryIds
            : [...(item.categoryIds ?? []), category.id!];

          return updateItem(item.id!, { categoryIds: updatedCategories });
        } else {
          // Ensure category is removed
          const updatedCategories =
            item.categoryIds?.filter((cid) => cid !== category.id) ?? [];

          return updateItem(item.id!, { categoryIds: updatedCategories });
        }
      });

      await Promise.all(updatePromises);

      setOpen(false);
    } catch (err) {
      console.error("Failed to save category items:", err);
      alert("Failed to save category items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Items
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Items to {category.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => (
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
            <p className="text-sm text-gray-500 italic">No items available</p>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
