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
import { Timestamp } from "firebase/firestore";
import { useAddExtraStore } from "@/stores/useAddExtraStore";
import { Plus } from "lucide-react";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export default function CreateAddExtraForm() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const { createExtra } = useAddExtraStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      await createExtra({
        description: description.trim(),
        price,
        createdAt: Timestamp.now(),
      });
      setDescription("");
      setPrice(0);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create extra:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" className="gap-2">
            <Plus className="size-4" aria-hidden />
            New extra
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Extra</DialogTitle>
            <DialogDescription>Enter the extra details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Extra description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
    </>
  );
}
