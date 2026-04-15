"use client";

import { useMemo, useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import UpdateMenuChangeForm from "@/features/menu-changes/UpdateMenuChangeForm";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

function matchesSearch(menuChange: MenuChange, q: string): boolean {
  if (!q.trim()) return true;
  const n = q.trim().toLowerCase();
  return (
    menuChange.from.toLowerCase().includes(n) ||
    menuChange.to.toLowerCase().includes(n)
  );
}

function formatCreatedAt(menuChange: MenuChange): string {
  try {
    // Some legacy docs may not have createdAt yet.
    const createdAt = (menuChange as MenuChange & { createdAt?: unknown })
      .createdAt as { toDate?: () => Date } | undefined;
    if (!createdAt || typeof createdAt.toDate !== "function") return "—";
    return createdAt.toDate().toLocaleString();
  } catch {
    return "—";
  }
}

export default function MenuChangeList() {
  const { menuChanges, loading, error, deleteMenuChange } =
    useMenuChangeStore();
  const [searchTerm, setSearchTerm] = useState("");

  const rows = menuChanges ?? [];
  const filtered = useMemo(
    () => rows.filter((r) => matchesSearch(r, searchTerm)),
    [rows, searchTerm],
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu change?")) return;
    try {
      await deleteMenuChange(id);
    } catch {
      alert("Failed to delete menu change");
    }
  };

  if (error) {
    return (
      <div className="px-4 py-10 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Loading menu changes…
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <SearchField
        placeholder="Search by from or to…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search menu changes"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                From
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                To
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Price
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Created at
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No menu changes yet. Use &quot;Add change&quot; to create the
                  first entry.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No menu changes match your search.
                </td>
              </tr>
            ) : (
              filtered.map((mc) => (
                <tr key={mc.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                    {mc.from}
                  </td>
                  <td className="px-3 py-3 text-muted-foreground sm:px-4">
                    {mc.to}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {typeof mc.price === "number"
                      ? mc.price.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {formatCreatedAt(mc)}
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex flex-wrap gap-2">
                      <UpdateMenuChangeForm menuChange={mc} />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(mc.id!)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

