"use client";

import { useState } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useItemStore } from "@/app/store/useItemStore";
import AddItemForm from "./AddItemForm";
import UpdateCategoriesForm from "./UpdateCategoriesForm"; // optional
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CategoriesList() {
  const { categories, loading, deleteCategory, updateCategory } =
    useCategoriesStore();
  const { items, updateItem } = useItemStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDeleteCategory = async (category: FoodCategory) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      // Remove this category from all items that reference it
      const updatePromises = (items ?? [])
        .filter((item) => item.categoryIds?.includes(category.id!))
        .map((item) => {
          const updatedCategoryIds =
            item.categoryIds?.filter((cid) => cid !== category.id) ?? [];
          return updateItem(item.id!, { categoryIds: updatedCategoryIds });
        });

      await Promise.all(updatePromises);

      // Delete the category itself
      await deleteCategory(category.id!);

      alert("Category deleted!");
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  const handleRemoveItemFromCategory = async (
    category: FoodCategory,
    itemId: string
  ) => {
    if (!confirm("Remove this item from category?")) return;
    try {
      // Remove item from category's itemIds array
      const updatedCategoryItemIds =
        category.itemIds?.filter((id) => id !== itemId) ?? [];
      await updateCategory(category.id!, { itemIds: updatedCategoryItemIds });

      // Remove category from item's categoryIds array
      const item = items.find((i) => i.id === itemId);
      if (item) {
        const updatedCategoryIds =
          item.categoryIds?.filter((cid) => cid !== category.id) ?? [];
        await updateItem(itemId, { categoryIds: updatedCategoryIds });
      }

      alert("Item removed from category!");
    } catch (err) {
      console.error("Failed to remove item from category:", err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {categories.map((cat) => {
        const catItems = items.filter((item) =>
          cat.itemIds?.includes(item.id!)
        );

        return (
          <li key={cat.id} className="border px-4 py-2 rounded">
            <div className="flex justify-between items-center">
              {/* Expand/Collapse */}
              <button
                onClick={() => toggleExpand(cat.id!)}
                className="flex items-center gap-2 font-medium"
              >
                {expanded[cat.id!] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                {cat.name}
              </button>

              <div className="flex gap-2">
                <UpdateCategoriesForm category={cat} /> {/* optional */}
                <button
                  onClick={() => handleDeleteCategory(cat)}
                  className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Expandable items list */}
            {expanded[cat.id!] && (
              <div className="ml-8 mt-2 space-y-2">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border px-3 py-1 rounded bg-gray-50"
                  >
                    <span>
                      {item.name} – ${item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() =>
                        handleRemoveItemFromCategory(cat, item.id!)
                      }
                      className="px-2 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <AddItemForm category={cat} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
