"use client";

import { useState } from "react";
import { useItemStore } from "@/app/store/useItemStore";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import UpdateItemForm from "./UpdateItemForm";
import AddOptionGroupForm from "./AddOptionGroupForm";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ItemsList() {
  const { items, loading, deleteItem, updateItem } = useItemStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteItem = async (item: MenuItem) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      // Step 1: Remove this item from all option groups that reference it
      const updatePromises = (optionGroups ?? [])
        .filter((group) => group.itemIds?.includes(item.id!))
        .map((group) => {
          const updatedItemIds = group.itemIds?.filter((i) => i !== item.id);
          return updateOptionGroup(group.id!, {
            itemIds: updatedItemIds ?? [],
          });
        });

      await Promise.all(updatePromises);

      // Step 2: Delete the item itself
      await deleteItem(item.id!);

      alert("Item deleted!");
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item");
    }
  };

  const handleRemoveOptionGroup = async (
    item: MenuItem,
    group: ItemOptionGroup
  ) => {
    if (!confirm("Are you sure you want to remove this option group?")) return;
    try {
      const updatedOptionGroupList = item.optionGroupIds?.filter(
        (groupId) => groupId !== group.id
      );
      await updateItem(item.id!, {
        optionGroupIds: updatedOptionGroupList ?? [],
      });
      const updatedItemList = group.itemIds?.filter(
        (itemId) => itemId !== item.id
      );
      await updateOptionGroup(group.id!, { itemIds: updatedItemList ?? [] });
      alert("Option group removed!");
    } catch {
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
