"use client";

import { useState } from "react";
import { useMenuChangeStore } from "@/stores/useMenuChangeStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import UpdateMenuChangeForm from "./UpdateMenuChangeForm";
import AddItemChangeForm from "./AddItemChangeForm";
import UpdateItemChangeForm from "./UpdateItemChangeForm";
import {
  ExpandChevron,
  RemoveButton,
  RowActions,
  rowCardClass,
  rowHeaderClass,
} from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = { menuChange: MenuChange };

export function MenuChangeCard({ menuChange }: Props) {
  const { deleteMenuChange, removeItemChange } = useMenuChangeStore();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !(await confirmDialog(
        `Delete "${menuChange.name}"? This cannot be undone.`,
        { danger: true, confirmLabel: "Delete" },
      ))
    )
      return;
    setDeleting(true);
    try {
      await deleteMenuChange(menuChange.id!);
    } catch (err) {
      console.error("Failed to delete menu change:", err);
      setDeleting(false);
      await alertDialog(`Couldn't delete "${menuChange.name}". Try again.`);
    }
  };

  const handleRemoveItemChange = async (index: number) => {
    const change = menuChange.changes[index];
    if (
      !(await confirmDialog(`Remove “${change.from} → ${change.to}”?`, {
        confirmLabel: "Remove",
      }))
    )
      return;
    try {
      await removeItemChange(menuChange.id!, index);
    } catch (err) {
      console.error("Failed to remove item change:", err);
      await alertDialog("Couldn't remove the item change. Try again.");
    }
  };

  const toggle = () => setExpanded((v) => !v);
  const count = menuChange.changes.length;

  return (
    <li className={cn(rowCardClass, deleting && "opacity-50")}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={rowHeaderClass}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <ExpandChevron expanded={expanded} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{menuChange.name}</p>
          <p className="text-sm text-foreground/50">
            {count} {count === 1 ? "change" : "changes"}
          </p>
        </div>
        <RowActions name={menuChange.name} onDelete={handleDelete} deleting={deleting}>
          <UpdateMenuChangeForm menuChange={menuChange} />
        </RowActions>
      </div>

      {expanded ? (
        <div className="border-t border-foreground/10 px-3 py-3 sm:px-4">
          {count > 0 ? (
            <ul className="mb-3 divide-y divide-foreground/10">
              {menuChange.changes.map((change, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="min-w-0 text-sm break-words text-foreground">
                    {change.from} → {change.to}
                    {change.price > 0 ? (
                      <span className="text-foreground/50">
                        {" · "}
                        {formatCurrency(change.price)}
                      </span>
                    ) : null}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <UpdateItemChangeForm
                      menuChange={menuChange}
                      index={index}
                      change={change}
                    />
                    <RemoveButton
                      label={`Remove ${change.from} to ${change.to}`}
                      onClick={() => handleRemoveItemChange(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-3 text-sm text-foreground/60">No item changes yet.</p>
          )}

          <AddItemChangeForm menuChange={menuChange} />
        </div>
      ) : null}
    </li>
  );
}
