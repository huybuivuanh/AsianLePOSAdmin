"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { MenuChange } from "@/types";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function UpdateMenuChangeForm({
  menuChange,
}: {
  menuChange: MenuChange;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(menuChange.name);
  const [saving, setSaving] = useState(false);
  const { renameMenuChange } = useMenuChangeStore();

  const canSubmit = name.trim().length > 0;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await renameMenuChange(menuChange.id!, name);
      setOpen(false);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to update menu change";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={saving} />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setName(menuChange.name);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Rename
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Menu Change</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="menu-change-rename">Name</Label>
              <Input
                id="menu-change-rename"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!canSubmit || saving}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
