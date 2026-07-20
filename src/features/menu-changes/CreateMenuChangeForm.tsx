"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function CreateMenuChangeForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const { createMenuChange } = useMenuChangeStore();

  const canSubmit = name.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await createMenuChange(name);
      setName("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to create menu change";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={saving} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="gap-2">
            <Plus className="size-4" aria-hidden />
            Add Menu Change
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Menu Change</DialogTitle>
            <DialogDescription>
              Give it a name, like &quot;Dinner for 5&quot;. You can add item
              changes to it afterward.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="menu-change-name">Name</Label>
              <Input
                id="menu-change-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dinner for 5"
                autoComplete="off"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!canSubmit || saving}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
