"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useItemStore } from "@/app/store/useItemStore";
import { KitchenType } from "@/app/types/enum";

export default function UpdateItemDialog({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [kitchenType, setKitchenType] = useState(item.kitchenType);
  const [loading, setLoading] = useState(false);

  const { updateItem } = useItemStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(Number(price))) return;

    setLoading(true);
    try {
      await updateItem(item.id!, {
        name: name.trim(),
        price: Number(price),
        kitchenType,
      });
      setOpen(false);
    } catch (err) {
      console.error("Failed to update item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>Update the item details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="item-price">Price</Label>
            <Input
              id="item-price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              disabled={loading}
            />
          </div>

          {/* Kitchen Type */}
          <div className="space-y-2">
            <Label>Kitchen Type</Label>
            <Select
              value={kitchenType}
              onValueChange={(val) => setKitchenType(val as KitchenType)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select kitchen type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KitchenType.A}>A</SelectItem>
                <SelectItem value={KitchenType.B}>B</SelectItem>
                <SelectItem value={KitchenType.Other}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
