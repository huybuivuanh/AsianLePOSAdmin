"use client";

import { useState } from "react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useItemStore } from "@/stores/useItemStore";
import AddItemForm from "./AddItemForm";
import UpdateCategoriesForm from "./UpdateCategoriesForm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

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
    itemId: string,
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

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading categories…</p>
    );
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search categories…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search categories"
      />

      <ul className="space-y-3">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => {
            const catItems = items.filter((item) =>
              cat.itemIds?.includes(item.id!),
            );

            return (
              <li
                key={cat.id}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto min-w-0 max-w-full justify-start gap-2 px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
                    onClick={() => toggleExpand(cat.id!)}
                  >
                    {expanded[cat.id!] ? (
                      <ChevronDown className="size-4 shrink-0 opacity-70" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 opacity-70" />
                    )}
                    <span className="truncate">{cat.name}</span>
                  </Button>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <UpdateCategoriesForm category={cat} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteCategory(cat)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {expanded[cat.id!] && (
                  <div className="mt-4 ml-1 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
                    {catItems.length > 0 ? (
                      catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <span className="min-w-0 text-sm break-words text-foreground">
                            {item.name}{" "}
                            <span className="text-muted-foreground">
                              · ${item.price.toFixed(2)}
                            </span>
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() =>
                              handleRemoveItemFromCategory(cat, item.id!)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No items in this category yet.
                      </p>
                    )}

                    <AddItemForm category={cat} />
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No categories match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
