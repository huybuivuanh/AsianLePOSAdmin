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
import type { ItemChange, MenuChange } from "@/types";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function UpdateItemChangeForm({
  menuChange,
  index,
  change,
}: {
  menuChange: MenuChange;
  index: number;
  change: ItemChange;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(change.from);
  const [to, setTo] = useState(change.to);
  const [price, setPrice] = useState<number>(change.price);
  const [saving, setSaving] = useState(false);
  const { updateItemChange } = useMenuChangeStore();

  const canSubmit = from.trim().length > 0 && to.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await updateItemChange(menuChange.id!, index, { from, to, price });
      setOpen(false);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to update item change";
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={saving} />
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setFrom(change.from);
            setTo(change.to);
            setPrice(change.price);
          }
        }}
      >
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item Change</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-item-change-from">From</Label>
              <Input
                id="edit-item-change-from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-change-to">To</Label>
              <Input
                id="edit-item-change-to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-item-change-price">Price</Label>
              <Input
                id="edit-item-change-price"
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
