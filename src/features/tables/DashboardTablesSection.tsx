"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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

export default function DashboardTablesSection() {
  const { tables, loading, createTable, updateTable, deleteTable } =
    useTableStore();
  const [selected, setSelected] = useState<Table | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (selected) {
      setTableNumber(selected.tableNumber);
    }
  }, [selected]);

  useEffect(() => {
    if (addOpen) {
      setNewTableNumber(String(tables.length + 1));
    }
  }, [addOpen, tables.length]);

  const openModal = (table: Table) => {
    setSelected(table);
    setTableNumber(table.tableNumber);
  };

  const closeModal = () => {
    setSelected(null);
    setTableNumber("");
  };

  const handleSave = async () => {
    if (!selected?.id) return;
    const next = tableNumber.trim();
    if (!next) {
      alert("Table number cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await updateTable(selected.id, { tableNumber: next });
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Failed to update table.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected?.id) return;
    if (
      !confirm(
        `Delete table "${selected.tableNumber}"? This cannot be undone.`,
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      await deleteTable(selected.id);
      closeModal();
    } catch (e) {
      console.error(e);
      alert("Failed to delete table.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async () => {
    const next = newTableNumber.trim();
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
      setAddOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to create table.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Tables
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a table to rename it or remove it. Use Add table for new
            seats.
          </p>
        </div>
        <Button
          type="button"
          className="shrink-0 gap-2"
          onClick={() => setAddOpen(true)}
        >
          <Plus className="size-4" aria-hidden />
          Add table
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading tables…</p>
      ) : tables.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No tables yet. Click <strong className="text-foreground">Add table</strong>{" "}
          to create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {tables.map((table) => (
            <button
              key={table.id}
              type="button"
              onClick={() => openModal(table)}
              className="rounded-lg border-2 border-emerald-800/45 bg-emerald-50/95 px-3 py-6 text-center shadow-sm transition hover:border-emerald-800/70 hover:bg-emerald-100/95 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:outline-none"
            >
              <span className="text-base font-bold text-emerald-950 sm:text-lg">
                Table {table.tableNumber}
              </span>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit table</DialogTitle>
            <DialogDescription>
              Update the table number shown on the POS. Other fields are managed
              during service.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="dashboard-table-number">Table number</Label>
            <Input
              id="dashboard-table-number"
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
              disabled={saving || deleting || !selected?.id}
              onClick={handleDelete}
            >
              {deleting ? "Deleting…" : "Delete table"}
            </Button>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add table</DialogTitle>
            <DialogDescription>
              New tables start as open with no guests and no active order. You
              can change the suggested number before creating.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="dashboard-add-table-number">Table number</Label>
            <Input
              id="dashboard-add-table-number"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              placeholder="e.g. 12"
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddOpen(false)}
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
    </section>
  );
}
