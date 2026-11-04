"use client";

import { useState } from "react";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import UpdateItemForm from "./UpdateItemForm";
import AddOptionGroupForm from "./AddOptionGroupForm";
import SortOptionGroupsForm from "./SortOptionGroupsForm";
import { getOrderedOptionGroupRefs } from "@/lib/menu-item-option-groups";
import {
  deleteMenuItem,
  removeOptionFromGroup,
  removeOptionGroupFromItem,
} from "@/lib/linked-writes";
import AddOptionForm from "@/features/menu/option-groups/AddOptionForm";
import {
  ExpandChevron,
  RemoveButton,
  RowActions,
  UnusedBadge,
  rowCardClass,
  rowHeaderClass,
} from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = { item: MenuItem };

export function ItemCard({ item }: Props) {
  const { optionGroups } = useOptionGroupStore();
  const { options } = useOptionStore();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const itemOptionGroups = getOrderedOptionGroupRefs(item)
    .map((ref) => optionGroups.find((g) => g.id === ref.optionGroupId))
    .filter((g): g is OptionGroup => g != null);
  const isUnused = (item.categoryIds?.length ?? 0) === 0;

  const handleDelete = async () => {
    if (
      !(await confirmDialog(`Delete "${item.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    setDeleting(true);
    try {
      await deleteMenuItem(item.id!);
    } catch (err) {
      console.error("Failed to delete item:", err);
      setDeleting(false);
      await alertDialog(`Couldn't delete "${item.name}". Try again.`);
    }
  };

  const handleRemoveOptionGroup = async (groupToRemove: OptionGroup) => {
    if (
      !(await confirmDialog(
        `Remove "${groupToRemove.name}" from "${item.name}"?`,
        { confirmLabel: "Remove" },
      ))
    )
      return;
    try {
      await removeOptionGroupFromItem(item.id!, groupToRemove.id!);
    } catch (err) {
      console.error("Failed to remove option group:", err);
      await alertDialog("Couldn't remove the option group. Try again.");
    }
  };

  const handleRemoveOption = async (group: OptionGroup, option: ItemOption) => {
    if (
      !(await confirmDialog(`Remove "${option.name}" from "${group.name}"?`, {
        confirmLabel: "Remove",
      }))
    )
      return;
    try {
      await removeOptionFromGroup(group.id!, option.id!);
    } catch (err) {
      console.error("Failed to remove option:", err);
      await alertDialog("Couldn't remove the option. Try again.");
    }
  };

  const toggle = () => setExpanded((v) => !v);

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
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate font-medium text-foreground">{item.name}</p>
            {isUnused && <UnusedBadge />}
          </div>
          <p className="text-sm text-foreground/50">
            {formatCurrency(item.price)} · {item.kitchenType}
            {itemOptionGroups.length > 0 &&
              ` · ${itemOptionGroups.length} option ${itemOptionGroups.length === 1 ? "group" : "groups"}`}
          </p>
        </div>
        <RowActions name={item.name} onDelete={handleDelete} deleting={deleting}>
          <UpdateItemForm item={item} />
        </RowActions>
      </div>

      {expanded ? (
        <div className="space-y-3 border-t border-foreground/10 px-3 py-3 sm:px-4">
          {itemOptionGroups.length > 0 ? (
            itemOptionGroups.map((group) => {
              const groupOptions = options.filter((opt) =>
                group.optionIds?.includes(opt.id!),
              );
              return (
                <div
                  key={group.id}
                  className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium break-words text-foreground">
                        {group.name}
                      </p>
                      <p className="text-xs text-foreground/50">
                        Min {group.minSelection} · Max {group.maxSelection}
                      </p>
                    </div>
                    <RemoveButton
                      label={`Remove ${group.name} from ${item.name}`}
                      onClick={() => handleRemoveOptionGroup(group)}
                    >
                      Remove group
                    </RemoveButton>
                  </div>

                  {groupOptions.length > 0 ? (
                    <ul className="my-2 divide-y divide-foreground/10">
                      {groupOptions.map((opt) => (
                        <li
                          key={opt.id}
                          className="flex items-center justify-between gap-3 py-1.5"
                        >
                          <span className="min-w-0 text-sm break-words">
                            {opt.name}
                            <span className="text-foreground/50">
                              {" · "}
                              {formatCurrency(opt.price)}
                            </span>
                          </span>
                          <RemoveButton
                            label={`Remove ${opt.name} from ${group.name}`}
                            onClick={() => handleRemoveOption(group, opt)}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="my-2 text-sm text-foreground/60">
                      No options in this group.
                    </p>
                  )}

                  <AddOptionForm group={group} />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-foreground/60">No option groups assigned.</p>
          )}

          <div className="flex flex-wrap gap-2">
            <AddOptionGroupForm item={item} />
            <SortOptionGroupsForm item={item} />
          </div>
        </div>
      ) : null}
    </li>
  );
}
