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
import { useOptionStore } from "@/app/store/useOptionStore";

export default function CreateOptionForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const createOption = useOptionStore((state) => state.createOption);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createOption({
        name: name.trim(),
        price,
        createdAt: new Date(),
      });
      setName("");
      setPrice(0);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create option:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Option</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Option</DialogTitle>
          <DialogDescription>Enter the option details below.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Option name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={loading}
            />
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
