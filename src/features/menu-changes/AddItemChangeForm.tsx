"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { MenuChange } from "@/types";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function AddItemChangeForm({
  menuChange,
}: {
  menuChange: MenuChange;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const { addItemChange } = useMenuChangeStore();

  const canSubmit = from.trim().length > 0 && to.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await addItemChange(menuChange.id!, { from, to, price });
      setFrom("");
      setTo("");
      setPrice(0);
      setOpen(false);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to add item change";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={saving} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm" className="gap-2">
            <Plus className="size-4" aria-hidden />
            Add change
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Item Change to {menuChange.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-change-from">From</Label>
              <Input
                id="item-change-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Rice"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-change-to">To</Label>
              <Input
                id="item-change-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Noodles"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-change-price">Price</Label>
              <Input
                id="item-change-price"
                type="number"
                inputMode="decimal"
                value={Number.isFinite(price) ? String(price) : "0"}
                onChange={(e) => setPrice(Number(e.target.value))}
                step="0.01"
                min="0"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!canSubmit || saving}>
                Add change
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
