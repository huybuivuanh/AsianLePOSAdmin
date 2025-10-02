"use client";

import { useState } from "react";
import { useOptionStore } from "@/app/store/useOptionStore";
import UpdateOptionForm from "./UpdateOptionForm";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { Button } from "@/components/ui/button";

export default function OptionsList() {
  const { options, loading, deleteOption } = useOptionStore();
  const { optionGroups, updateOptionGroup } = useOptionGroupStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (option: ItemOption) => {
    if (!confirm("Are you sure you want to delete this option?")) return;
    setIsDeleting(option.id!);
    try {
      // 1. Remove this option from all groups
      const updatePromises = (option.groupIds ?? []).map((groupId) => {
        const group = optionGroups.find((g) => g.id === groupId);
        if (!group) return Promise.resolve();
        const updatedOptionIds =
          group.optionIds?.filter((id) => id !== option.id) ?? [];
        return updateOptionGroup(groupId, { optionIds: updatedOptionIds });
      });

      await Promise.all(updatePromises);

      // 2. Delete the option
      await deleteOption(option.id!);
    } catch (err) {
      console.error("Failed to delete option:", err);
      alert("Failed to delete option");
    } finally {
      setIsDeleting(null);
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
            <Button
              onClick={() => handleDelete(opt)}
              disabled={isDeleting === opt.id}
              className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting === opt.id ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
