"use client";

import { useEffect } from "react";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import UpdateOptionGroupDialog from "./UpdateOptionGroupForm";

export default function OptionGroupsList() {
  const { optionGroups, loading, subscribe, deleteOptionGroup } =
    useOptionGroupStore();

  useEffect(() => {
    const unsub = subscribe();
    return () => unsub();
  }, [subscribe]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      await deleteOptionGroup(id);
      alert("Option group deleted!");
    } catch {
      alert("Failed to delete option group");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {optionGroups.map((group) => (
        <li
          key={group.id}
          className="flex justify-between items-center border px-4 py-2 rounded"
        >
          <div>
            <p className="font-medium">{group.name}</p>
            <p className="text-sm text-gray-600">
              Min: {group.minSelection} • Max: {group.maxSelection}
            </p>
          </div>
          <div className="flex gap-2">
            <UpdateOptionGroupDialog group={group} />
            <button
              onClick={() => handleDelete(group.id!)}
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
