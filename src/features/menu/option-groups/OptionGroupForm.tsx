"use client";

import { useId, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberStepper } from "./NumberStepper";

/** Add an option group, or edit `group` when given. */
export function OptionGroupForm({ group }: { group?: OptionGroup }) {
  const isEdit = group != null;
  const id = useId();
  const { createOptionGroup, updateOptionGroup } = useOptionGroupStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [minSelection, setMinSelection] = useState(0);
  const [maxSelection, setMaxSelection] = useState(1);
  const [multipleOptionQuantity, setMultipleOptionQuantity] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName(group?.name ?? "");
      setMinSelection(group?.minSelection ?? 0);
      setMaxSelection(group?.maxSelection ?? 1);
      setMultipleOptionQuantity(group?.multipleOptionQuantity ?? false);
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    if (minSelection < 0 || maxSelection < 1 || minSelection > maxSelection) {
      await alertDialog("Min selection can't be more than max selection.");
      return;
    }
    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        minSelection,
        maxSelection,
        multipleOptionQuantity,
      };
      if (isEdit) await updateOptionGroup(group.id!, data);
      else await createOptionGroup({ ...data, createdAt: Timestamp.now() });
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} option group. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add option group"
      title={isEdit ? "Edit option group" : "Add option group"}
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
          placeholder="Option group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>Min selection</Label>
        <NumberStepper value={minSelection} setValue={setMinSelection} min={0} />
      </div>
      <div className="space-y-2">
        <Label>Max selection</Label>
        <NumberStepper value={maxSelection} setValue={setMaxSelection} min={1} />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${id}-multiple`}
          checked={multipleOptionQuantity}
          onCheckedChange={(checked) => setMultipleOptionQuantity(checked === true)}
        />
        <div className="grid gap-1 leading-none">
          <Label htmlFor={`${id}-multiple`} className="cursor-pointer text-sm font-medium">
            Multiple option quantity
          </Label>
          <p className="text-xs text-foreground/60">
            Allow customers to add more than one of the same option (e.g. quantity).
          </p>
        </div>
      </div>
    </EntityFormDialog>
  );
}
