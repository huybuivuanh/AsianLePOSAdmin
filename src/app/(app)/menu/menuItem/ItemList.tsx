"use client";

import { useState } from "react";
import { useItemStore } from "@/app/store/useItemStore";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import UpdateItemForm from "./UpdateItemForm";
import AddOptionGroupForm from "./AddOptionGroupForm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";

export default function ItemsList() {
  const { items, loading, deleteItem, updateItem } = useItemStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const { categories, updateCategory } = useCategoriesStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      // Step 1: Remove the item from all option groups
      const updateGroupPromises = optionGroups.map((group) => {
        if (!group.itemIds?.includes(item.id!)) return Promise.resolve();
        const updatedItemIds = group.itemIds.filter((i) => i !== item.id);
        return updateOptionGroup(group.id!, { itemIds: updatedItemIds });
      });

      // Step 2: Remove the item from all categories
      const updateCategoryPromises = categories.map((cat) => {
        if (!cat.itemIds?.includes(item.id!)) return Promise.resolve();
        const updatedItemIds = cat.itemIds.filter((i) => i !== item.id);
        return updateCategory(cat.id!, { itemIds: updatedItemIds });
      });

      // Step 3: Run all updates in parallel
      await Promise.all([...updateGroupPromises, ...updateCategoryPromises]);

      // Step 4: Delete the item itself
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
      // Step 1: Remove the group from the item's optionGroupIds
      const updatedOptionGroupIds =
        item.optionGroupIds?.filter((gid) => gid !== groupToRemove.id) ?? [];
      await updateItem(item.id!, { optionGroupIds: updatedOptionGroupIds });

      // Step 2: Remove the item from the group's itemIds
      const updatedItemIds =
        groupToRemove.itemIds?.filter((i) => i !== item.id) ?? [];
      await updateOptionGroup(groupToRemove.id!, { itemIds: updatedItemIds });
    } catch (err) {
      console.error("Failed to remove option group:", err);
      alert("Failed to remove option group");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {items.map((item) => {
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
              ${item.price.toFixed(2)} • Kitchen: {item.kitchenType}
            </p>

            {/* Expandable Option Groups */}
            {expanded[item.id!] && (
              <div className="ml-8 mt-2 space-y-2">
                {itemOptionGroups.length > 0 &&
                  itemOptionGroups.map((group) => (
                    <div
                      key={group.id}
                      className="border px-3 py-2 rounded bg-gray-50 space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{group.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRemoveOptionGroup(item, group)}
                            className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Min: {group.minSelection} • Max: {group.maxSelection}
                      </p>
                    </div>
                  ))}

                {/* Add Option Group */}
                <AddOptionGroupForm item={item} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
