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
      // Remove item from option groups
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

  if (loading) return <p>Loading...</p>;

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>

      <ul className="space-y-2">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const itemOptionGroups = getOrderedOptionGroupRefs(item)
              .map((ref) =>
                optionGroups.find((g) => g.id === ref.optionGroupId),
              )
              .filter((g): g is OptionGroup => g != null);

            return (
              <li key={item.id} className="rounded border px-3 py-2 sm:px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Expand/Collapse */}
                  <button
                    onClick={() => toggleExpand(item.id!)}
                    className="flex min-w-0 max-w-full items-center gap-2 text-left font-medium"
                  >
                    {expanded[item.id!] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    {item.name}
                  </button>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <UpdateItemForm item={item} />
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="ml-6 text-sm text-gray-600 sm:ml-8">
                  ${item.price.toFixed(2)} - Kitchen Type: {item.kitchenType}
                </p>

                {/* Expandable Option Groups */}
                {expanded[item.id!] && (
                  <div className="mt-2 ml-2 space-y-2 sm:ml-8">
                    {itemOptionGroups.length > 0 ? (
                      itemOptionGroups.map((group) => {
                        const groupOptions = options.filter((opt) =>
                          group.optionIds?.includes(opt.id!),
                        );

                        return (
                          <div
                            key={group.id}
                            className="border px-3 py-2 rounded bg-gray-50 space-y-2"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <span className="min-w-0 font-medium break-words">
                                {group.name}
                              </span>
                              <div className="flex shrink-0 gap-2">
                                <button
                                  onClick={() =>
                                    handleRemoveOptionGroup(item, group)
                                  }
                                  className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                                >
                                  Remove Group
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600">
                              Min: {group.minSelection} • Max:{" "}
                              {group.maxSelection}
                            </p>

                            {/* Render options */}
                            <div className="ml-0 space-y-2 sm:ml-4">
                              {groupOptions.length > 0 ? (
                                groupOptions.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className="flex flex-col gap-2 rounded border bg-gray-100 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                                  >
                                    <span className="min-w-0 break-words">
                                      {opt.name} – ${opt.price.toFixed(2)}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleRemoveOption(group, opt)
                                      }
                                      className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                                    >
                                      Remove Option
                                    </button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">
                                  No options in this group
                                </p>
                              )}
                            </div>

                            <AddOptionForm group={group} />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No option groups assigned
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <AddOptionGroupForm item={item} />
                      <SortOptionGroupsForm item={item} />
                    </div>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">
            No items match your search
          </p>
        )}
      </ul>
    </div>
  );
}
