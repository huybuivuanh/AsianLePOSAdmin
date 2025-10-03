"use client";

import CategoriesList from "./CategoriesList";
import CreateCategoriesForm from "./CreateCategoriesForm";
import SortCategories from "./SortCategories";

export default function CategoriesTab() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <CreateCategoriesForm />
        <SortCategories />
      </div>

      <CategoriesList />
    </div>
  );
}
