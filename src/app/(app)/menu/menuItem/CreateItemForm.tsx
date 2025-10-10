"use client";

import * as React from "react";
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
import { useItemStore } from "@/app/stores/useItemStore"; // you'll create this similar to useCategoriesStore
import { KitchenType } from "@/app/types/enum"; // your enum

export default function CreateItemForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [kitchenType, setKitchenType] = useState<KitchenType>(KitchenType.A);
  const [loading, setLoading] = useState(false);

  const { createItem } = useItemStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price === "" || isNaN(Number(price))) return;

    setLoading(true);
    try {
      await createItem({
        name: name.trim(),
        price: Number(price),
        kitchenType,
        createdAt: new Date(),
      });
      setName("");
      setPrice("");
      setKitchenType(KitchenType.A);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create item:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Menu Item</DialogTitle>
          <DialogDescription>
            Fill in the details for your menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              placeholder="Item name"
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
              placeholder="0.00"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
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
                <SelectItem value={KitchenType.C}>C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
