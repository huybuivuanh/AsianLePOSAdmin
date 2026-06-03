"use client";

import { useState } from "react";
import { useItemStore } from "@/stores/useItemStore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import UpdateItemForm from "./UpdateItemForm";
import AddOptionGroupForm from "./AddOptionGroupForm";
import SortOptionGroupsForm from "./SortOptionGroupsForm";
import {
  getOrderedOptionGroupRefs,
  removeOptionGroupRef,
} from "@/lib/menu-item-option-groups";
import AddOptionForm from "@/features/menu/option-groups/AddOptionForm";
import { patchClearDefaultIfOptionRemoved } from "@/lib/option-group-updates";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ItemOption, MenuItem, OptionGroup } from "@/types";


type Props = { item: MenuItem };

export function ItemCard({ item }: Props) {
  const { deleteItem, updateItem } = useItemStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const { options, updateOption } = useOptionStore();
  const { categories, updateCategory } = useCategoriesStore();
  const [expanded, setExpanded] = useState(false);

  const itemOptionGroups = getOrderedOptionGroupRefs(item)
    .map((ref) => optionGroups.find((g) => g.id === ref.optionGroupId))
    .filter((g): g is OptionGroup => g != null);
  const isUnused = (item.categoryIds?.length ?? 0) === 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await Promise.all([
        ...optionGroups
          .filter((g) => g.itemIds?.includes(item.id!))
          .map((g) =>
            updateOptionGroup(g.id!, {
              itemIds: g.itemIds!.filter((i) => i !== item.id),
            }),
          ),
        ...categories
          .filter((cat) => cat.itemIds?.includes(item.id!))
          .map((cat) =>
            updateCategory(cat.id!, {
              itemIds: cat.itemIds!.filter((i) => i !== item.id),
            }),
          ),
      ]);
      await deleteItem(item.id!);
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item");
    }
  };

  const handleRemoveOptionGroup = async (groupToRemove: OptionGroup) => {
    if (!confirm("Are you sure you want to remove this option group?")) return;
    try {
      await Promise.all([
        updateItem(item.id!, {
          optionGroupIds: removeOptionGroupRef(item, groupToRemove.id!),
        }),
        updateOptionGroup(groupToRemove.id!, {
          itemIds:
            groupToRemove.itemIds?.filter((i) => i !== item.id) ?? [],
        }),
      ]);
    } catch (err) {
      console.error("Failed to remove option group:", err);
      alert("Failed to remove option group");
    }
  };

  const handleRemoveOption = async (group: OptionGroup, option: ItemOption) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      await Promise.all([
        updateOptionGroup(group.id!, {
          optionIds: group.optionIds?.filter((id) => id !== option.id) ?? [],
          ...patchClearDefaultIfOptionRemoved(group, option.id),
        } as unknown as Partial<OptionGroup>),
        updateOption(option.id!, {
          groupIds: option.groupIds?.filter((id) => id !== group.id) ?? [],
        }),
      ]);
    } catch (err) {
      console.error("Failed to remove option:", err);
      alert("Failed to remove option");
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
          <span className="truncate">{item.name}</span>
          {isUnused ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Unused
            </span>
          ) : null}
        </Button>

        <div className="flex shrink-0 flex-wrap gap-2">
          <UpdateItemForm item={item} />
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

      <p className="ml-1 mt-2 text-sm sm:ml-7">
        ${item.price.toFixed(2)} <span>·</span> Kitchen: {item.kitchenType}
      </p>

      {expanded ? (
        <div className="ml-1 mt-4 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
          {itemOptionGroups.length > 0 ? (
            itemOptionGroups.map((group) => {
              const groupOptions = options.filter((opt) =>
                group.optionIds?.includes(opt.id!),
              );
              return (
                <div
                  key={group.id}
                  className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="min-w-0 font-medium break-words text-foreground">
                      {group.name}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveOptionGroup(group)}
                    >
                      Remove group
                    </Button>
                  </div>

                  <p className="text-sm">
                    Min {group.minSelection} · Max {group.maxSelection}
                  </p>

                  <div className="space-y-2 sm:ml-2">
                    {groupOptions.length > 0 ? (
                      groupOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="min-w-0 text-sm break-words">
                            {opt.name}{" "}
                            <span className="text-muted-foreground">
                              · ${opt.price.toFixed(2)}
                            </span>
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveOption(group, opt)}
                          >
                            Remove option
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No options in this group.
                      </p>
                    )}
                  </div>

                  <AddOptionForm group={group} />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">
              No option groups assigned.
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <AddOptionGroupForm item={item} />
            <SortOptionGroupsForm item={item} />
          </div>
        </div>
      ) : null}
    </li>
  );
}
