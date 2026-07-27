"use client";

import { useState } from "react";
import { useAddExtraStore } from "@/stores/useAddExtraStore";
import UpdateAddExtraForm from "./UpdateAddExtraForm";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { formatCurrency } from "@/lib/formatters";
import { matchesQuery } from "@/lib/list-utils";

export default function AddExtraList() {
  const { extras, loading, deleteExtra } = useAddExtraStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this extra?")) return;
    setIsDeleting(id);
    try {
      await deleteExtra(id);
    } catch (err) {
      console.error("Failed to delete extra:", err);
      alert("Failed to delete extra");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading extras…</p>;
  }

  const filteredExtras = extras.filter((extra) =>
    matchesQuery(searchTerm, extra.description),
  );

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search extras…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search extras"
      />

      <ul className="space-y-3">
        {filteredExtras.length > 0 ? (
          filteredExtras.map((extra) => (
            <li
              key={extra.id}
              className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="min-w-0">
                <p className="font-medium break-words text-foreground">
                  {extra.description}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {formatCurrency(extra.price)}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                <UpdateAddExtraForm extra={extra} />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(extra.id!)}
                  disabled={isDeleting === extra.id}
                >
                  {isDeleting === extra.id ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            {extras.length === 0
              ? 'No extras yet. Use "New extra" to create the first one.'
              : "No extras match your search."}
          </p>
        )}
      </ul>
    </div>
  );
}
