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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
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
