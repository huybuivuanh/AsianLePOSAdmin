"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useOptionStore } from "@/app/store/useOptionStore";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";

export default function AddOptionForm({ group }: { group: ItemOptionGroup }) {
  const { options, updateOption } = useOptionStore();
  const { updateOptionGroup } = useOptionGroupStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(group.optionIds ?? []);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Update the group with the final list of optionIds
      await updateOptionGroup(group.id!, { optionIds: selected });

      // 2. Sync each option so its groupIds array matches the checkboxes
      const updatePromises = options.map((option) => {
        const isSelected = selected.includes(option.id!);

        if (isSelected) {
          // Ensure group is included
          const updatedGroups = option.groupIds?.includes(group.id!)
            ? option.groupIds
            : [...(option.groupIds ?? []), group.id!];
          return updateOption(option.id!, { groupIds: updatedGroups });
        } else {
          // Ensure group is removed
          const updatedGroups =
            option.groupIds?.filter((gid) => gid !== group.id) ?? [];
          return updateOption(option.id!, { groupIds: updatedGroups });
        }
      });

      await Promise.all(updatePromises);

      setOpen(false);
    } catch (err) {
      console.error("Failed to save options for group:", err);
      alert("Failed to save options for group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Options
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Options to Group</DialogTitle>
          <DialogDescription>
            Select the options you want to include in <b>{group.name}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {options.length > 0 ? (
            options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 border p-2 rounded cursor-pointer"
              >
                <Checkbox
                  checked={selected.includes(opt.id!)}
                  onCheckedChange={() => toggleSelect(opt.id!)}
                  disabled={loading}
                />
                <span>
                  {opt.name} – ${opt.price}
                </span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No options available</p>
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
