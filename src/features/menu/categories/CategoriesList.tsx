"use client";

import { useState } from "react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useItemStore } from "@/stores/useItemStore";
import AddItemForm from "./AddItemForm";
import UpdateCategoriesForm from "./UpdateCategoriesForm"; // optional
import { ChevronDown, ChevronRight } from "lucide-react";

export default function CategoriesList() {
  const { categories, loading, deleteCategory, updateCategory } =
    useCategoriesStore();
  const { items, updateItem } = useItemStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDeleteCategory = async (category: FoodCategory) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const updatePromises = (items ?? [])
        .filter((item) => item.categoryIds?.includes(category.id!))
        .map((item) => {
          const updatedCategoryIds =
            item.categoryIds?.filter((cid) => cid !== category.id) ?? [];
          return updateItem(item.id!, { categoryIds: updatedCategoryIds });
        });

      await Promise.all(updatePromises);
      await deleteCategory(category.id!);
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
      const updatedCategoryItemIds =
        category.itemIds?.filter((id) => id !== itemId) ?? [];
      await updateCategory(category.id!, { itemIds: updatedCategoryItemIds });

      const item = items.find((i) => i.id === itemId);
      if (item) {
        const updatedCategoryIds =
          item.categoryIds?.filter((cid) => cid !== category.id) ?? [];
        await updateItem(itemId, { categoryIds: updatedCategoryIds });
      }
    } catch (err) {
      console.error("Failed to remove item from category:", err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <p>Loading...</p>;

  // Filter categories based on search term
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>

      <ul className="space-y-2">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => {
            const catItems = items.filter((item) =>
              cat.itemIds?.includes(item.id!)
            );

            return (
              <li key={cat.id} className="rounded border px-3 py-2 sm:px-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  {/* Expand/Collapse */}
                  <button
                    onClick={() => toggleExpand(cat.id!)}
                    className="flex min-w-0 max-w-full items-center gap-2 text-left font-medium"
                  >
                    {expanded[cat.id!] ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    {cat.name}
                  </button>

                  <div className="flex flex-wrap gap-2 shrink-0">
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
                  <div className="mt-2 ml-2 space-y-2 sm:ml-8">
                    {catItems.length > 0 ? (
                      catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded border bg-gray-50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="min-w-0 break-words">
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
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No items in this category
                      </p>
                    )}

                    <AddItemForm category={cat} />
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">
            No categories match your search
          </p>
        )}
      </ul>
    </div>
  );
}
