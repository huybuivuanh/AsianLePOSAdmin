"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import CreateCategoriesForm from "./CreateCategoriesForm";
import SortCategories from "./SortCategories";
import CategoriesList from "./CategoriesList";

export default function CategoriesTab() {
  const categories = useCategoriesStore((s) => s.categories);
  const loading = useCategoriesStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Categories"
        count={loading && categories.length === 0 ? undefined : categories.length}
      >
        <SortCategories />
        <CreateCategoriesForm />
      </PageHeader>
      <CategoriesList />
    </div>
  );
}
