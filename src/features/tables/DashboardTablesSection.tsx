"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTableStore } from "@/stores/useTableStore";
import type { Table } from "@/types";
import { Button } from "@/components/ui/button";
import { EditTableDialog } from "./EditTableDialog";
import { AddTableDialog } from "./AddTableDialog";

export default function DashboardTablesSection() {
  const { tables, loading } = useTableStore();
  const [selected, setSelected] = useState<Table | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Tables
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a table to rename it or remove it. Use Add table for new seats.
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
          No tables yet. Click{" "}
          <strong className="text-foreground">Add table</strong> to create your
          first one.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {tables.map((table) => (
            <button
              key={table.id}
              type="button"
              onClick={() => setSelected(table)}
              className="rounded-lg border-2 border-emerald-800/45 bg-emerald-50/95 px-3 py-6 text-center shadow-sm transition hover:border-emerald-800/70 hover:bg-emerald-100/95 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:outline-none"
            >
              <span className="text-base font-bold text-emerald-950 sm:text-lg">
                Table {table.tableNumber}
              </span>
            </button>
          ))}
        </div>
      )}

      <EditTableDialog
        table={selected}
        onClose={() => setSelected(null)}
      />
      <AddTableDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        nextTableNumber={String(tables.length + 1)}
      />
    </section>
  );
}
