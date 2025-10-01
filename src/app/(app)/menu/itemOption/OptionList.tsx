"use client";

import { useEffect } from "react";
import { useOptionStore } from "@/app/store/useOptionStore";
import UpdateOptionForm from "./UpdateOptionForm";

export default function OptionsList() {
  const { options, loading, subscribe, deleteOption } = useOptionStore();

  useEffect(() => {
    const unsub = subscribe();
    return () => unsub();
  }, [subscribe]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option?")) return;
    try {
      await deleteOption(id);
    } catch {
      alert("Failed to delete option");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {options.map((opt) => (
        <li
          key={opt.id}
          className="flex justify-between items-center border px-4 py-2 rounded"
        >
          <div>
            <p className="font-medium">{opt.name}</p>
            <p className="text-sm text-gray-500">${opt.price.toFixed(2)}</p>
          </div>

          <div className="flex gap-2">
            <UpdateOptionForm option={opt} />
            <button
              onClick={() => handleDelete(opt.id!)}
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
