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
import { SearchField } from "@/components/ui/search-field";

export default function ItemsList() {
  const { items, loading, deleteItem, updateItem } = useItemStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const { options, updateOption } = useOptionStore();
  const { categories, updateCategory } = useCategoriesStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const updateGroupPromises = optionGroups.map((group) => {
        if (!group.itemIds?.includes(item.id!)) return Promise.resolve();
        const updatedItemIds = group.itemIds.filter((i) => i !== item.id);
        return updateOptionGroup(group.id!, { itemIds: updatedItemIds });
      });

      const updateCategoryPromises = categories.map((cat) => {
        if (!cat.itemIds?.includes(item.id!)) return Promise.resolve();
        const updatedItemIds = cat.itemIds.filter((i) => i !== item.id);
        return updateCategory(cat.id!, { itemIds: updatedItemIds });
      });

      await Promise.all([...updateGroupPromises, ...updateCategoryPromises]);
      await deleteItem(item.id!);
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item");
    }
  };

  const handleRemoveOptionGroup = async (
    item: MenuItem,
    groupToRemove: OptionGroup,
  ) => {
    if (!confirm("Are you sure you want to remove this option group?")) return;

    try {
      const updatedOptionGroupIds = removeOptionGroupRef(
        item,
        groupToRemove.id!,
      );
      await updateItem(item.id!, { optionGroupIds: updatedOptionGroupIds });

      const updatedItemIds =
        groupToRemove.itemIds?.filter((i) => i !== item.id) ?? [];
      await updateOptionGroup(groupToRemove.id!, { itemIds: updatedItemIds });
    } catch (err) {
      console.error("Failed to remove option group:", err);
      alert("Failed to remove option group");
    }
  };

  const handleRemoveOption = async (group: OptionGroup, option: ItemOption) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      const updatedOptionIds =
        group.optionIds?.filter((id) => id !== option.id) ?? [];
      const updatedGroupIds =
        option.groupIds?.filter((id) => id !== group.id) ?? [];

      await Promise.all([
        updateOptionGroup(group.id!, {
          optionIds: updatedOptionIds,
          ...patchClearDefaultIfOptionRemoved(group, option.id),
        } as unknown as Partial<OptionGroup>),
        updateOption(option.id!, { groupIds: updatedGroupIds }),
      ]);
    } catch (err) {
      console.error("Failed to remove option:", err);
      alert("Failed to remove option");
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading items…</p>;
  }

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search items…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search items"
      />

      <ul className="space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const itemOptionGroups = getOrderedOptionGroupRefs(item)
              .map((ref) =>
                optionGroups.find((g) => g.id === ref.optionGroupId),
              )
              .filter((g): g is OptionGroup => g != null);

            return (
              <li
                key={item.id}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto min-w-0 max-w-full justify-start gap-2 px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
                    onClick={() => toggleExpand(item.id!)}
                  >
                    {expanded[item.id!] ? (
                      <ChevronDown className="size-4 shrink-0 opacity-70" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 opacity-70" />
                    )}
                    <span className="truncate">{item.name}</span>
                  </Button>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <UpdateItemForm item={item} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteItem(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <p className="mt-2 ml-1 text-sm text-muted-foreground sm:ml-7">
                  ${item.price.toFixed(2)}{" "}
                  <span className="text-muted-foreground/50">·</span> Kitchen:{" "}
                  {item.kitchenType}
                </p>

                {expanded[item.id!] && (
                  <div className="mt-4 ml-1 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
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
                                onClick={() =>
                                  handleRemoveOptionGroup(item, group)
                                }
                              >
                                Remove group
                              </Button>
                            </div>

                            <p className="text-sm text-muted-foreground">
                              Min {group.minSelection} · Max{" "}
                              {group.maxSelection}
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
                                      onClick={() =>
                                        handleRemoveOption(group, opt)
                                      }
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
                )}
              </li>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No items match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
