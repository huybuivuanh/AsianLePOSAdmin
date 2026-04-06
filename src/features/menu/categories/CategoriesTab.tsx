"use client";

import CategoriesList from "./CategoriesList";
import CreateCategoriesForm from "./CreateCategoriesForm";
import SortCategories from "./SortCategories";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function CategoriesTab() {
  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">
      <PublishMenuToolbar>
        <CreateCategoriesForm />
        <SortCategories />
      </PublishMenuToolbar>

      <CategoriesList />
    </div>
  );
}
