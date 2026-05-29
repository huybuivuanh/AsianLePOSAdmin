"use client";

import { useEffect, useState } from "react";
import { useTableStore } from "@/stores/useTableStore";
import type { Table } from "@/types";
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

type Props = {
  table: Table | null;
  onClose: () => void;
};

export function EditTableDialog({ table, onClose }: Props) {
  const { updateTable, deleteTable } = useTableStore();
  const [tableNumber, setTableNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (table) setTableNumber(table.tableNumber);
  }, [table]);

  const handleSave = async () => {
    if (!table?.id) return;
    const next = tableNumber.trim();
    if (!next) {
      alert("Table number cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await updateTable(table.id, { tableNumber: next });
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to update table.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!table?.id) return;
    if (!confirm(`Delete table "${table.tableNumber}"? This cannot be undone.`))
      return;
    setDeleting(true);
    try {
      await deleteTable(table.id);
      onClose();
    } catch (e) {
      console.error(e);
      alert("Failed to delete table.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={table !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit table</DialogTitle>
          <DialogDescription>
            Update the table number shown on the POS. Other fields are managed
            during service.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="edit-table-number">Table number</Label>
          <Input
            id="edit-table-number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. 12"
            autoComplete="off"
          />
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            disabled={saving || deleting || !table?.id}
            onClick={handleDelete}
          >
            {deleting ? "Deleting…" : "Delete table"}
          </Button>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving || deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving || deleting}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
