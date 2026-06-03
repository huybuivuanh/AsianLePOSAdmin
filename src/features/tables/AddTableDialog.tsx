"use client";

import { useEffect, useState } from "react";
import { useTableStore } from "@/stores/useTableStore";
import { TableStatus } from "@/types/enum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextTableNumber: string;
};

export function AddTableDialog({ open, onOpenChange, nextTableNumber }: Props) {
  const { createTable } = useTableStore();
  const [tableNumber, setTableNumber] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (open) setTableNumber(nextTableNumber);
  }, [open, nextTableNumber]);

  const handleCreate = async () => {
    const next = tableNumber.trim();
    if (!next) {
      alert("Table number cannot be empty.");
      return;
    }
    setCreating(true);
    try {
      await createTable({
        tableNumber: next,
        status: TableStatus.Open,
        guests: 0,
        currentOrderId: null,
      });
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      alert("Failed to create table.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={creating} />
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add table</DialogTitle>
          <DialogDescription>
            New tables start as open with no guests and no active order. You can
            change the suggested number before creating.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="add-table-number">Table number</Label>
          <Input
            id="add-table-number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. 12"
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleCreate} disabled={creating}>
            {creating ? "Creating…" : "Create table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
