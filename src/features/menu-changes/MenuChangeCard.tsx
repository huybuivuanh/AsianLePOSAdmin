"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import UpdateMenuChangeForm from "./UpdateMenuChangeForm";
import AddItemChangeForm from "./AddItemChangeForm";
import UpdateItemChangeForm from "./UpdateItemChangeForm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatTimestamp } from "@/lib/formatters";
import type { MenuChange } from "@/types";

type Props = { menuChange: MenuChange };

export function MenuChangeCard({ menuChange }: Props) {
  const { deleteMenuChange, removeItemChange } = useMenuChangeStore();
  const [expanded, setExpanded] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete menu change "${menuChange.name}"?`)) return;
    try {
      await deleteMenuChange(menuChange.id!);
    } catch (err) {
      console.error("Failed to delete menu change:", err);
      alert("Failed to delete menu change");
    }
  };

  const handleRemoveItemChange = async (index: number) => {
    if (!confirm("Remove this item change?")) return;
    try {
      await removeItemChange(menuChange.id!, index);
    } catch (err) {
      console.error("Failed to remove item change:", err);
      alert("Failed to remove item change");
    }
  };

  return (
    <li className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-w-0 max-w-full justify-start gap-2 px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown className="size-4 shrink-0 opacity-70" />
          ) : (
            <ChevronRight className="size-4 shrink-0 opacity-70" />
          )}
          <span className="truncate">{menuChange.name}</span>
          <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {menuChange.changes.length}{" "}
            {menuChange.changes.length === 1 ? "change" : "changes"}
          </span>
        </Button>

        <div className="flex shrink-0 flex-wrap gap-2">
          <UpdateMenuChangeForm menuChange={menuChange} />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <p className="ml-1 mt-2 text-sm text-muted-foreground sm:ml-7">
        Created {formatTimestamp(menuChange.createdAt)}
      </p>

      {expanded ? (
        <div className="ml-1 mt-4 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
          {menuChange.changes.length > 0 ? (
            menuChange.changes.map((change, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="min-w-0 text-sm break-words text-foreground">
                  {change.from} → {change.to}
                  {change.price > 0 ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {formatCurrency(change.price)}
                    </span>
                  ) : null}
                </span>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <UpdateItemChangeForm
                    menuChange={menuChange}
                    index={index}
                    change={change}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveItemChange(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No item changes yet.
            </p>
          )}

          <AddItemChangeForm menuChange={menuChange} />
        </div>
      ) : null}
    </li>
  );
}
