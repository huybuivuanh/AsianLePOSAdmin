"use client";

import { useId, useState } from "react";
import { useCreditStore } from "@/stores/useCreditStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Add a credit, or edit `credit` when given. */
export function CreditForm({ credit }: { credit?: Credit }) {
  const isEdit = credit != null;
  const id = useId();
  const { createCredit, updateCredit } = useCreditStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amountText, setAmountText] = useState("");

  const parsedAmount = amountText.trim() === "" ? 0 : Number(amountText);
  const hasNameOrPhone = name.trim().length > 0 || phoneNumber.trim().length > 0;
  const canSubmit = hasNameOrPhone && Number.isFinite(parsedAmount);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Load fresh values every time, so edits start from the latest data.
      setName(credit?.name ?? "");
      setPhoneNumber(credit?.phoneNumber ?? "");
      setDescription(credit?.description ?? "");
      setAmountText(
        typeof credit?.amount === "number" && Number.isFinite(credit.amount)
          ? String(credit.amount)
          : "",
      );
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const data = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        description: description.trim() ? description.trim() : undefined,
        amount: parsedAmount,
      };
      if (isEdit) await updateCredit(credit.id!, data);
      else await createCredit(data);
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} credit. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add credit"
      title={isEdit ? "Edit credit" : "Add credit"}
      submitLabel={isEdit ? undefined : "Create credit"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-phone`}>Phone number</Label>
        <Input
          id={`${id}-phone`}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-description`}>Description</Label>
        <Input
          id={`${id}-description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-amount`}>Amount</Label>
        <Input
          id={`${id}-amount`}
          type="number"
          inputMode="decimal"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          step="0.01"
          placeholder="0"
        />
      </div>
    </EntityFormDialog>
  );
}
