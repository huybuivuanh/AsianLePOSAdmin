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

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update the item with selected optionGroup IDs
      await updateItem(item.id!, { optionGroupIds: selected });

      // Update each selected group to include this item ID (reverse reference)
      const updatePromises = selected.map((groupId) => {
        const group = optionGroups.find((g) => g.id === groupId);
        if (!group) return Promise.resolve();

        // Avoid duplicates
        const updatedItemIds = group.itemIds?.includes(item.id!)
          ? group.itemIds
          : [...(group.itemIds ?? []), item.id!];

        return updateOptionGroup(groupId, { itemIds: updatedItemIds });
      });

      await Promise.all(updatePromises);
      setOpen(false);
    } catch (err) {
      console.error("Failed to add option groups:", err);
      alert("Failed to add option groups");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Option Groups
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Option Groups to {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {optionGroups.length > 0 ? (
            optionGroups.map((group) => (
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
              No option groups available
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
