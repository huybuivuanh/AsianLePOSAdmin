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

export default function UpdateMenuChangeForm({
  menuChange,
}: {
  menuChange: MenuChange;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(menuChange.from);
  const [to, setTo] = useState(menuChange.to);
  const [price, setPrice] = useState<number>(
    typeof menuChange.price === "number" ? menuChange.price : 0,
  );
  const { updateMenuChange } = useMenuChangeStore();

  const canSubmit = from.trim().length > 0 && to.trim().length > 0;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      await updateMenuChange(menuChange.id!, { from, to, price });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update menu change");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Menu Change</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              inputMode="decimal"
              value={Number.isFinite(price) ? String(price) : "0"}
              onChange={(e) => setPrice(Number(e.target.value))}
              step="0.01"
              min="0"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-blue-500 text-white"
              disabled={!canSubmit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
