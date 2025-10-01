"use client";

import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import UpdateCategoriesForm from "./UpdateCategoriesForm";

export default function CategoriesList() {
  const { categories, loading, deleteCategory } = useCategoriesStore();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      alert("Category deleted!");
    } catch {
      alert("Failed to delete category");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li
          key={cat.id}
          className="flex justify-between items-center border px-4 py-2 rounded"
        >
          <span>{cat.name}</span>

          <div className="flex gap-2">
            <UpdateCategoriesForm category={cat} />
            <button
              onClick={() => handleDelete(cat.id!)}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
