"use client";

import { useId, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useOptionStore } from "@/stores/useOptionStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Add an option, or edit `option` when given. */
export function OptionForm({ option }: { option?: ItemOption }) {
  const isEdit = option != null;
  const id = useId();
  const { createOption, updateOption } = useOptionStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName(option?.name ?? "");
      setPrice(option?.price ?? 0);
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateOption(option.id!, { name: name.trim(), price });
      } else {
        await createOption({ name: name.trim(), price, createdAt: Timestamp.now() });
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} option. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add option"
      title={isEdit ? "Edit option" : "Add option"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={name.trim().length > 0}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-lg"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input
          id={`${id}-name`}
          placeholder="Option name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-price`}>Price</Label>
        <Input
          id={`${id}-price`}
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
    </EntityFormDialog>
  );
}
