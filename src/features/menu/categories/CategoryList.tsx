"use client";

import { useState } from "react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { useItemStore } from "@/stores/useItemStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import { SearchField } from "@/components/ui/search-field";
import {
  EmptyState,
  ExpandChevron,
  RemoveButton,
  RowActions,
  rowCardClass,
  rowHeaderClass,
} from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { deleteCategory, removeItemFromCategory } from "@/lib/linked-writes";
import { cn } from "@/lib/utils";
import { AddCategoryItemsForm } from "./AddCategoryItemsForm";
import { CategoryForm } from "./CategoryForm";

export function CategoryList() {
  const { categories, loading } = useCategoriesStore();
  const { items } = useItemStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDeleteCategory = async (category: FoodCategory) => {
    if (
      !(await confirmDialog(`Delete "${category.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    setDeletingId(category.id!);
    try {
      await deleteCategory(category.id!);
    } catch (err) {
      console.error("Failed to delete category:", err);
      await alertDialog(`Couldn't delete "${category.name}". Try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveItemFromCategory = async (
    category: FoodCategory,
    item: MenuItem,
  ) => {
    if (
      !(await confirmDialog(`Remove "${item.name}" from "${category.name}"?`, {
        confirmLabel: "Remove",
      }))
    )
      return;
    try {
      await removeItemFromCategory(category.id!, item.id!);
    } catch (err) {
      console.error("Failed to remove item from category:", err);
      await alertDialog("Couldn't remove the item. Try again.");
    }
  };

  if (loading) {
    return <p className="text-sm text-foreground/60">Loading categories…</p>;
  }

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search categories…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search categories"
      />

      {categories.length === 0 ? (
        <EmptyState title="No categories yet." hint="Add one to get started." />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          title={`No categories match “${searchTerm.trim()}”.`}
          hint="Try a different search."
        />
      ) : (
        <ul className="space-y-2">
          {filteredCategories.map((cat) => {
            const isOpen = !!expanded[cat.id!];
            const catItems = items.filter((item) =>
              cat.itemIds?.includes(item.id!),
            );
            const deleting = deletingId === cat.id;

            return (
              <li key={cat.id} className={cn(rowCardClass, deleting && "opacity-50")}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  className={rowHeaderClass}
                  onClick={() => toggleExpand(cat.id!)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(cat.id!);
                    }
                  }}
                >
                  <ExpandChevron expanded={isOpen} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{cat.name}</p>
                    <p className="text-sm text-foreground/50">
                      {catItems.length} {catItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <RowActions
                    name={cat.name}
                    onDelete={() => handleDeleteCategory(cat)}
                    deleting={deleting}
                  >
                    <CategoryForm category={cat} />
                  </RowActions>
                </div>

                {isOpen && (
                  <div className="border-t border-foreground/10 px-3 py-3 sm:px-4">
                    {catItems.length > 0 ? (
                      <ul className="mb-3 divide-y divide-foreground/10">
                        {catItems.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center justify-between gap-3 py-2"
                          >
                            <span className="min-w-0 text-sm break-words text-foreground">
                              {item.name}
                              <span className="text-foreground/50">
                                {" · "}
                                {formatCurrency(item.price)}
                              </span>
                            </span>
                            <RemoveButton
                              label={`Remove ${item.name} from ${cat.name}`}
                              onClick={() => handleRemoveItemFromCategory(cat, item)}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mb-3 text-sm text-foreground/60">
                        No items in this category yet.
                      </p>
                    )}
                    <AddCategoryItemsForm category={cat} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
