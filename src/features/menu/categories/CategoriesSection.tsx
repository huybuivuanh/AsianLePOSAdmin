"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { SortCategoriesForm } from "./SortCategoriesForm";
import { CategoryList } from "./CategoryList";

export function CategoriesSection() {
  const categories = useCategoriesStore((s) => s.categories);
  const loading = useCategoriesStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Categories"
        count={loading && categories.length === 0 ? undefined : categories.length}
      >
        <SortCategoriesForm />
        <CreateCategoryForm />
      </PageHeader>
      <CategoryList />
    </div>
  );
}
