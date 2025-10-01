"use client";

import { useState } from "react";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { useOptionStore } from "@/app/store/useOptionStore";
import UpdateOptionGroupForm from "./UpdateOptionGroupForm";
import AddOptionForm from "./AddOptionForm"; // new dialog component
import { ChevronDown, ChevronRight } from "lucide-react";

export default function OptionGroupsList() {
  const { optionGroups, loading, deleteOptionGroup, updateOptionGroup } =
    useOptionGroupStore();
  const { options } = useOptionStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      await deleteOptionGroup(id);
      alert("Option group deleted!");
    } catch {
      alert("Failed to delete option group");
    }
  };

  const handleDeleteOption = async (
    group: ItemOptionGroup,
    optionId: string
  ) => {
    if (!confirm("Are you sure you want to delete this option?")) return;
    try {
      const updatedOptionList = group.itemOptionIds?.filter(
        (option) => option !== optionId
      );
      await updateOptionGroup(group.id!, { itemOptionIds: updatedOptionList });
      alert("Option removed!");
    } catch {
      alert("Failed to remmove option");
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ul className="space-y-2">
      {optionGroups.map((group) => {
        const groupOptions = options.filter((opt) =>
          group.itemOptionIds?.includes(opt.id!)
        );

        return (
          <li key={group.id} className="border px-4 py-2 rounded">
            <div className="flex justify-between items-center">
              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleExpand(group.id!)}
                className="flex items-center gap-2 font-medium"
              >
                {expanded[group.id!] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
                {group.name}
              </button>

              <div className="flex gap-2">
                <UpdateOptionGroupForm group={group} />
                <button
                  onClick={() => handleDelete(group.id!)}
                  className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 ml-6">
              Min: {group.minSelection} • Max: {group.maxSelection}
            </p>

            {/* Expandable Options List */}
            {expanded[group.id!] && (
              <div className="ml-8 mt-2 space-y-1">
                {groupOptions.length > 0 &&
                  groupOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex justify-between items-center border px-3 py-1 rounded bg-gray-50"
                    >
                      <span>
                        {opt.name} – ${opt.price}
                      </span>
                      <button
                        onClick={() => handleDeleteOption(group, opt.id!)}
                        className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                <AddOptionForm group={group} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
