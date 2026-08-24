"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function CreateCustomerForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const { createCustomer } = useCustomerStore();

  const canSubmit = name.trim().length > 0 && phone.trim().length > 0;

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/\D/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await createCustomer({
        name: name.trim(),
        phone: phone.trim(),
      });
      setName("");
      setPhone("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add customer");
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
            Add customer
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!canSubmit || saving}>
                Create customer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
