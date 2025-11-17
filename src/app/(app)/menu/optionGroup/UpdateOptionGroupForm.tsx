"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useOptionGroupStore } from "@/app/stores/useOptionGroupStore";
import { useOptionStore } from "@/app/stores/useOptionStore";
import NumberStepper from "./NumberStepper";

export default function UpdateOptionGroupForm({
  group,
}: {
  group: ItemOptionGroup;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(group.name);
  const [minSelection, setMinSelection] = useState(group.minSelection);
  const [maxSelection, setMaxSelection] = useState(group.maxSelection);
  const [loading, setLoading] = useState(false);

  const { updateOptionGroup } = useOptionGroupStore();
  const { options } = useOptionStore();

  // Calculate initial multipleSelection value based on options in the group
  const getInitialMultipleSelection = () => {
    // First check if the group already has a multipleSelection value
    if (group.multipleSelection !== undefined) {
      return group.multipleSelection;
    }
    // Otherwise, check if any option in the group has multipleSelection === true
    if (group.optionIds && group.optionIds.length > 0) {
      const groupOptions = options.filter((opt) =>
        group.optionIds!.includes(opt.id!)
      );
      return groupOptions.some((opt) => opt.multipleSelction === true);
    }
    return false;
  };

  const [multipleSelection, setMultipleSelection] = useState(
    getInitialMultipleSelection()
  );

  // Update form fields when dialog opens or group changes
  useEffect(() => {
    if (open) {
      setName(group.name);
      setMinSelection(group.minSelection);
      setMaxSelection(group.maxSelection);
      
      // Calculate multipleSelection value
      const initialValue = (() => {
        // First check if the group already has a multipleSelection value
        if (group.multipleSelection !== undefined) {
          return group.multipleSelection;
        }
        // Otherwise, check if any option in the group has multipleSelection === true
        if (group.optionIds && group.optionIds.length > 0) {
          const groupOptions = options.filter((opt) =>
            group.optionIds!.includes(opt.id!)
          );
          return groupOptions.some((opt) => opt.multipleSelction === true);
        }
        return false;
      })();
      setMultipleSelection(initialValue);
    }
  }, [open, group.id, group.name, group.minSelection, group.maxSelection, group.multipleSelection, group.optionIds, options]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (minSelection < 0 || maxSelection < 1 || minSelection > maxSelection) {
      alert("Invalid min/max selections");
      return;
    }

    setLoading(true);
    try {
      await updateOptionGroup(group.id!, {
        name: name.trim(),
        minSelection,
        maxSelection,
        multipleSelection,
      });
      setOpen(false);
    } catch (err) {
      console.error("Failed to update option group:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Option Group</DialogTitle>
          <DialogDescription>
            Update the option group details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Min Selection */}
          <div className="space-y-2">
            <Label>Min Selection</Label>
            <NumberStepper
              value={minSelection}
              setValue={setMinSelection}
              min={0}
              disabled={loading}
            />
          </div>

          {/* Max Selection */}
          <div className="space-y-2">
            <Label>Max Selection</Label>
            <NumberStepper
              value={maxSelection}
              setValue={setMaxSelection}
              min={1}
              disabled={loading}
            />
          </div>

          {/* Multiple Selection */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="multipleSelection"
              checked={multipleSelection}
              onCheckedChange={(checked) =>
                setMultipleSelection(checked === true)
              }
              disabled={loading}
            />
            <Label
              htmlFor="multipleSelection"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Multiple Selection
            </Label>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
