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
  const { options } = useOptionStore();
  const updateOptionGroup = useOptionGroupStore(
    (state) => state.updateOptionGroup
  );

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(group.itemOptionIds ?? []);
  const [loading, setLoading] = useState(false);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateOptionGroup(group.id!, { itemOptionIds: selected });
      setOpen(false);
    } catch (err) {
      console.error("Failed to update options for group:", err);
      alert("Failed to update options for group");
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
