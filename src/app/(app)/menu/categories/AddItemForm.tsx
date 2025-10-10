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
import { useItemStore } from "@/app/stores/useItemStore";
import { useCategoriesStore } from "@/app/stores/useCategoriesStore";

export default function AddItemForm({ category }: { category: FoodCategory }) {
  const { items, updateItem } = useItemStore();
  const { updateCategory } = useCategoriesStore();

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
      // 1️⃣ Update category with selected item IDs
      await updateCategory(category.id!, { itemIds: selected });

      // 2️⃣ Sync each item so categoryIds[] matches the selection
      const updatePromises = items.map((item) => {
        const isSelected = selected.includes(item.id!);

        if (isSelected) {
          const updatedCategories = item.categoryIds?.includes(category.id!)
            ? item.categoryIds
            : [...(item.categoryIds ?? []), category.id!];
          return updateItem(item.id!, { categoryIds: updatedCategories });
        } else {
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

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Items
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[80vw] !max-w-[90vw] h-[80vh] max-h-[90vh] mx-auto">
        <DialogHeader>
          <DialogTitle>Add Items to {category.name}</DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scrollable items list */}
        <div className="space-y-2 overflow-y-auto h-[calc(80vh-220px)]">
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
  );
}
