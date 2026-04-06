"use client";

import CategoriesList from "./CategoriesList";
import CreateCategoriesForm from "./CreateCategoriesForm";
import SortCategories from "./SortCategories";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function CategoriesTab() {
  return (
    <div className="p-4 space-y-4">
      <PublishMenuToolbar>
        <CreateCategoriesForm />
        <SortCategories />
      </PublishMenuToolbar>

      <CategoriesList />
    </div>
  );
}
