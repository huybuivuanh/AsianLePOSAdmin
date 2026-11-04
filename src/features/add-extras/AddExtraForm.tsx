"use client";

import { useId, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useAddExtraStore } from "@/stores/useAddExtraStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Add an extra to the catalog, or edit `extra` when given. */
export function AddExtraForm({ extra }: { extra?: ExtraCatalogItem }) {
  const isEdit = extra != null;
  const id = useId();
  const { createExtra, updateExtra } = useAddExtraStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDescription(extra?.description ?? "");
      setPrice(extra?.price ?? 0);
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit) {
        await updateExtra(extra.id!, { description: description.trim(), price });
      } else {
        await createExtra({
          description: description.trim(),
          price,
          createdAt: Timestamp.now(),
        });
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} extra. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add extra"
      title={isEdit ? "Edit extra" : "Add extra"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={description.trim().length > 0}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-lg"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-description`}>Description</Label>
        <Input
          id={`${id}-description`}
          placeholder="Extra description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
