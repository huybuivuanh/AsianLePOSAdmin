"use client";

import CategoriesList from "./CategoriesList";
import CreateCategoriesForm from "./CreateCategoriesForm";

export default function CategoriesTab() {
  return (
    <div className="p-4 space-y-4">
      <CreateCategoriesForm />
      <CategoriesList />
    </div>
  );
}
