"use client";

import { useState } from "react";
import { useItemStore } from "@/app/stores/useItemStore";
import { useOptionGroupStore } from "@/app/stores/useOptionGroupStore";
import { useOptionStore } from "@/app/stores/useOptionStore";
import { useCategoriesStore } from "@/app/stores/useCategoriesStore";
import UpdateItemForm from "./UpdateItemForm";
import AddOptionGroupForm from "./AddOptionGroupForm";
import AddOptionForm from "../optionGroup/AddOptionForm";
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
    groupToRemove: ItemOptionGroup
  ) => {
    if (!confirm("Are you sure you want to remove this option group?")) return;

    try {
      const updatedOptionGroupIds =
        item.optionGroupIds?.filter((gid) => gid !== groupToRemove.id) ?? [];
      await updateItem(item.id!, { optionGroupIds: updatedOptionGroupIds });

      const updatedItemIds =
        groupToRemove.itemIds?.filter((i) => i !== item.id) ?? [];
      await updateOptionGroup(groupToRemove.id!, { itemIds: updatedItemIds });
    } catch (err) {
      console.error("Failed to remove option group:", err);
      alert("Failed to remove option group");
    }
  };

  const handleRemoveOption = async (
    group: ItemOptionGroup,
    option: ItemOption
  ) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      const updatedOptionIds =
        group.optionIds?.filter((id) => id !== option.id) ?? [];
      const updatedGroupIds =
        option.groupIds?.filter((id) => id !== group.id) ?? [];

      await Promise.all([
        updateOptionGroup(group.id!, { optionIds: updatedOptionIds }),
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
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            const itemOptionGroups = optionGroups.filter((group) =>
              item.optionGroupIds?.includes(group.id!)
            );

            return (
              <li key={item.id} className="border px-4 py-2 rounded">
                <div className="flex justify-between items-center">
                  {/* Expand/Collapse */}
                  <button
                    onClick={() => toggleExpand(item.id!)}
                    className="flex items-center gap-2 font-medium"
                  >
                    {expanded[item.id!] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    {item.name}
                  </button>

                  <div className="flex gap-2">
                    <UpdateItemForm item={item} />
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 ml-6">
                  ${item.price.toFixed(2)}
                </p>

                {/* Expandable Option Groups */}
                {expanded[item.id!] && (
                  <div className="ml-8 mt-2 space-y-2">
                    {itemOptionGroups.length > 0 ? (
                      itemOptionGroups.map((group) => {
                        const groupOptions = options.filter((opt) =>
                          group.optionIds?.includes(opt.id!)
                        );

                        return (
                          <div
                            key={group.id}
                            className="border px-3 py-2 rounded bg-gray-50 space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{group.name}</span>
                              <div className="flex gap-2">
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
                            <div className="ml-4 space-y-2">
                              {groupOptions.length > 0 ? (
                                groupOptions.map((opt) => (
                                  <div
                                    key={opt.id}
                                    className="flex justify-between items-center border px-3 py-1 rounded bg-gray-100"
                                  >
                                    <span>
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

                    {/* Add Option Group */}
                    <AddOptionGroupForm item={item} />
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
