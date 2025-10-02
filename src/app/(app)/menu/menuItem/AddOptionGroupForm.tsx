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
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { useItemStore } from "@/app/store/useItemStore";

export default function AddOptionGroupForm({ item }: { item: MenuItem }) {
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const { updateItem } = useItemStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(item.optionGroupIds ?? []);
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
      // 1️⃣ Update the item with the final selected optionGroup IDs
      await updateItem(item.id!, { optionGroupIds: selected });

      // 2️⃣ Sync all option groups to match the selection
      const updatePromises = optionGroups.map((group) => {
        const isSelected = selected.includes(group.id!);

        if (isSelected) {
          // Ensure this item is included
          const updatedItemIds = group.itemIds?.includes(item.id!)
            ? group.itemIds
            : [...(group.itemIds ?? []), item.id!];
          return updateOptionGroup(group.id!, { itemIds: updatedItemIds });
        } else {
          // Ensure this item is removed
          const updatedItemIds =
            group.itemIds?.filter((id) => id !== item.id!) ?? [];
          return updateOptionGroup(group.id!, { itemIds: updatedItemIds });
        }
      });

      await Promise.all(updatePromises);

      setOpen(false);
    } catch (err) {
      console.error("Failed to save option groups:", err);
      alert("Failed to save option groups");
    } finally {
      setLoading(false);
    }
  };

  // Filter option groups by search
  const filteredGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Option Groups
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[80vw] !max-w-[90vw] h-[80vh] max-h-[90vh] mx-auto">
        <DialogHeader>
          <DialogTitle>Add Option Groups to {item.name}</DialogTitle>
        </DialogHeader>

        {/* Search bar */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search option groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scrollable list */}
        <div className="space-y-2 overflow-y-auto h-[calc(80vh-180px)]">
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
                <span>{group.name}</span>
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
  );
}
