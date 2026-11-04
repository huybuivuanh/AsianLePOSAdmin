"use client";

import { useId, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useItemStore } from "@/stores/useItemStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KitchenType } from "@/types/enum";

/** Add a menu item, or edit `item` when given. */
export function ItemForm({ item }: { item?: MenuItem }) {
  const isEdit = item != null;
  const id = useId();
  const { createItem, updateItem } = useItemStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [kitchenType, setKitchenType] = useState<KitchenType>(KitchenType.DeepFry);

  const canSubmit = name.trim().length > 0 && !Number.isNaN(Number(price));

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Loaded only on open, so live updates don't overwrite what's being typed.
      setName(item?.name ?? "");
      setPrice(item?.price ?? 0);
      setKitchenType((item?.kitchenType as KitchenType) ?? KitchenType.DeepFry);
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = { name: name.trim(), price: Number(price), kitchenType };
      if (isEdit) await updateItem(item.id!, data);
      else await createItem({ ...data, createdAt: Timestamp.now() });
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} item. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add item"
      title={isEdit ? "Edit menu item" : "Add menu item"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-md"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input
          id={`${id}-name`}
          placeholder="Item name"
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
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-kitchen`}>Kitchen type</Label>
        <Select
          value={kitchenType}
          onValueChange={(val) => setKitchenType(val as KitchenType)}
        >
          <SelectTrigger id={`${id}-kitchen`} className="w-full">
            <SelectValue placeholder="Select kitchen type" />
          </SelectTrigger>
          <SelectContent>
            {(Object.values(KitchenType) as KitchenType[]).map((kt) => (
              <SelectItem key={kt} value={kt}>
                {kt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </EntityFormDialog>
  );
}
