"use client";

import { useId, useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Add a menu change, or rename `menuChange` when given. */
export function MenuChangeForm({ menuChange }: { menuChange?: MenuChange }) {
  const isEdit = menuChange != null;
  const id = useId();
  const { createMenuChange, renameMenuChange } = useMenuChangeStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (next) setName(menuChange?.name ?? "");
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit) await renameMenuChange(menuChange.id!, name.trim());
      else await createMenuChange(name.trim());
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(
        err instanceof Error
          ? err.message
          : `Couldn't ${isEdit ? "rename" : "add"} menu change. Try again.`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add menu change"
      editLabel="Rename"
      title={isEdit ? "Rename menu change" : "Add menu change"}
      description={
        isEdit
          ? undefined
          : "Give it a name, like “Dinner for 5”. You can add item changes to it afterward."
      }
      submitLabel={isEdit ? "Save" : "Create"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={name.trim().length > 0}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-md"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input
          id={`${id}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dinner for 5"
          autoComplete="off"
        />
      </div>
    </EntityFormDialog>
  );
}
