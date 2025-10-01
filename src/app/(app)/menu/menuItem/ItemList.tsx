"use client";

import { useItemStore } from "@/app/store/useItemStore";
import UpdateItemForm from "./UpdateItemForm"; // similar to UpdateCategoriesForm

export default function MenuItemsList() {
  const { items, loading, deleteItem } = useItemStore();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      alert("Item deleted!");
    } catch {
      alert("Failed to delete item");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {items.map((item: MenuItem) => (
        <li
          key={item.id}
          className="flex justify-between items-center border px-4 py-2 rounded"
        >
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">
              ${item.price.toFixed(2)} • Kitchen: {item.kitchenType}
            </p>
          </div>

          <div className="flex gap-2">
            <UpdateItemForm item={item} />
            <button
              onClick={() => handleDelete(item.id!)}
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
