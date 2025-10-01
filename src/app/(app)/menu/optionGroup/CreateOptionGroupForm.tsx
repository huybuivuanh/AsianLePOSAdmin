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

export default function CreateOptionGroupForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);
  const [loading, setLoading] = useState(false);

  const createOptionGroup = useOptionGroupStore(
    (state) => state.createOptionGroup
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (minSelection < 0 || maxSelection < 1 || minSelection > maxSelection) {
      alert("Invalid min/max selections");
      return;
    }

    setLoading(true);
    try {
      await createOptionGroup({
        name: name.trim(),
        minSelection,
        maxSelection,
        createdAt: new Date(),
      });
      setName("");
      setMinSelection(0);
      setMaxSelection(1);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create option group:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Option Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Option Group</DialogTitle>
          <DialogDescription>
            Enter the option group details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Option group name"
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
