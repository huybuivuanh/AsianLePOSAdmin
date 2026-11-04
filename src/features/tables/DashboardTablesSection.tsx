"use client";

import { useState } from "react";
import { useTableStore } from "@/stores/useTableStore";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/layout/RowParts";
import { TableStatus } from "@/types/enum";
import { EditTableDialog } from "./EditTableDialog";
import { AddTableDialog } from "./AddTableDialog";

export default function DashboardTablesSection() {
  const { tables, loading } = useTableStore();
  const [selected, setSelected] = useState<Table | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <section>
      <PageHeader
        title="Tables"
        count={loading && tables.length === 0 ? undefined : tables.length}
      >
        <Button type="button" onClick={() => setAddOpen(true)}>
          + Add table
        </Button>
      </PageHeader>

      {loading ? (
        <p className="text-sm text-foreground/60">Loading tables…</p>
      ) : tables.length === 0 ? (
        <EmptyState title="No tables yet." hint="Add one to get started." />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {tables.map((table) => {
            const occupied = table.status === TableStatus.Occupied;
            return (
              <li key={table.id}>
                <button
                  type="button"
                  onClick={() => setSelected(table)}
                  title="Rename or remove"
                  className="flex w-full flex-col items-center gap-1 rounded-lg border-2 border-emerald-800/45 bg-emerald-50/95 px-3 py-6 text-center shadow-sm transition hover:border-emerald-800/70 hover:bg-emerald-100/95 hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:outline-none"
                >
                  <span className="text-base font-bold text-emerald-950 sm:text-lg">
                    Table {table.tableNumber}
                  </span>
                  <span className="text-xs font-medium text-emerald-800/80">
                    {occupied
                      ? `Occupied · ${table.guests} ${table.guests === 1 ? "guest" : "guests"}`
                      : "Open"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <EditTableDialog table={selected} onClose={() => setSelected(null)} />
      <AddTableDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        nextTableNumber={String(tables.length + 1)}
      />
    </section>
  );
}
