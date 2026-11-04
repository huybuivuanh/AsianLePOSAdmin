"use client";

import { useId, useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  menuChange: MenuChange;
  /** Edit the change at `index` when given; otherwise add a new one. */
  edit?: { index: number; change: ItemChange };
};

/** Add an item change (from → to, price) to a menu change, or edit one. */
export function ItemChangeForm({ menuChange, edit }: Props) {
  const isEdit = edit != null;
  const id = useId();
  const { addItemChange, updateItemChange } = useMenuChangeStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState(0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setFrom(edit?.change.from ?? "");
      setTo(edit?.change.to ?? "");
      setPrice(edit?.change.price ?? 0);
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const change = { from: from.trim(), to: to.trim(), price };
      if (isEdit) await updateItemChange(menuChange.id!, edit.index, change);
      else await addItemChange(menuChange.id!, change);
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(
        err instanceof Error
          ? err.message
          : `Couldn't ${isEdit ? "update" : "add"} item change. Try again.`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add change"
      addStyle="inline"
      title={isEdit ? "Edit item change" : `Add item change to ${menuChange.name}`}
      submitLabel={isEdit ? "Save" : "Add change"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={from.trim().length > 0 && to.trim().length > 0}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-md"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-from`}>From</Label>
        <Input
          id={`${id}-from`}
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="e.g. Rice"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-to`}>To</Label>
        <Input
          id={`${id}-to`}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="e.g. Noodles"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-price`}>Price</Label>
        <Input
          id={`${id}-price`}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(price) ? String(price) : "0"}
          onChange={(e) => setPrice(Number(e.target.value))}
          step="0.01"
          min="0"
        />
      </div>
    </EntityFormDialog>
  );
}
