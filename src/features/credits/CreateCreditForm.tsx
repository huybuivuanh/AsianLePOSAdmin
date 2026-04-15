"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreditStore } from "@/stores/useCreditStore";
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

export default function CreateCreditForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amountText, setAmountText] = useState("");
  const { createCredit } = useCreditStore();

  const parsedAmount = amountText.trim() === "" ? 0 : Number(amountText);
  const hasNameOrPhone =
    name.trim().length > 0 || phoneNumber.trim().length > 0;
  const canSubmit =
    hasNameOrPhone && Number.isFinite(parsedAmount);

  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value.replace(/\D/g, ""));
  };

  const handleAmountChange = (value: string) => {
    if (value.trim() === "") {
      setAmountText("");
      return;
    }
    setAmountText(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await createCredit({
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        description: description.trim() ? description.trim() : undefined,
        amount: parsedAmount,
      });
      setName("");
      setPhoneNumber("");
      setDescription("");
      setAmountText("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add credit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="gap-2">
          <Plus className="size-4" aria-hidden />
          Add credit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Credit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Customer name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => handlePhoneNumberChange(e.target.value)}
              placeholder="0123456789"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Reason"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              value={amountText}
              onChange={(e) => handleAmountChange(e.target.value)}
              step="0.01"
              placeholder="0"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!canSubmit}>
              Create credit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
