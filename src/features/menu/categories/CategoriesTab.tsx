"use client";

import CategoriesList from "./CategoriesList";
import CreateCategoriesForm from "./CreateCategoriesForm";
import SortCategories from "./SortCategories";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function CategoriesTab() {
  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6">
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <PublishMenuToolbar>
          <CreateCategoriesForm />
          <SortCategories />
        </PublishMenuToolbar>
      </div>
      <CategoriesList />
    </div>
  );
}
