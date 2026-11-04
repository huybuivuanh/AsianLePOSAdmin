"use client";

import { useId, useState } from "react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Add a customer, or edit `customer` when given. */
export function CustomerForm({ customer }: { customer?: Customer }) {
  const isEdit = customer != null;
  const id = useId();
  const { createCustomer, updateCustomer } = useCustomerStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName(customer?.name ?? "");
      setPhone(customer?.phone ?? "");
      setNote(customer?.note ?? "");
    }
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const trimmedNote = note.trim();
      if (isEdit) {
        // An empty note clears it.
        await updateCustomer(customer.id!, {
          name: name.trim(),
          phone: phone.trim(),
          note: trimmedNote,
        });
      } else {
        await createCustomer({
          name: name.trim(),
          phone: phone.trim(),
          ...(trimmedNote ? { note: trimmedNote } : {}),
        });
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} customer. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add customer"
      title={isEdit ? "Edit customer" : "Add customer"}
      submitLabel={isEdit ? undefined : "Create customer"}
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
        <Label htmlFor={`${id}-phone`}>Phone</Label>
        <Input
          id={`${id}-phone`}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-note`}>Note (optional)</Label>
        <Textarea
          id={`${id}-note`}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>
    </EntityFormDialog>
  );
}
