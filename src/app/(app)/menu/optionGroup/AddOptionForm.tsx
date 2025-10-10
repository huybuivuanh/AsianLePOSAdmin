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
import { useOptionStore } from "@/app/stores/useOptionStore";
import { useOptionGroupStore } from "@/app/stores/useOptionGroupStore";

export default function AddOptionForm({ group }: { group: ItemOptionGroup }) {
  const { options, updateOption } = useOptionStore();
  const { updateOptionGroup } = useOptionGroupStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(group.optionIds ?? []);
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

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Options
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] !max-w-[90vw] h-[80vh] max-h-[90vh] mx-auto">
        <DialogHeader>
          <DialogTitle>Add Options to Group</DialogTitle>
          <DialogDescription>
            Select the options you want to include in <b>{group.name}</b>.
          </DialogDescription>
        </DialogHeader>

        {/* Search bar */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Scrollable options list */}
        <div className="space-y-2 overflow-y-auto h-[calc(80vh-220px)]">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
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
            <p className="text-sm text-gray-500 italic">
              No options match your search
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
