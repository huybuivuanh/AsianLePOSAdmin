"use client";

import { useState } from "react";
import { useOptionGroupStore } from "@/app/store/useOptionGroupStore";
import { useOptionStore } from "@/app/store/useOptionStore";
import UpdateOptionGroupForm from "./UpdateOptionGroupForm";
import AddOptionForm from "./AddOptionForm"; // new dialog component
import { ChevronDown, ChevronRight } from "lucide-react";
import { useItemStore } from "@/app/store/useItemStore"; // import your item store

export default function OptionGroupsList() {
  const { optionGroups, loading, deleteOptionGroup, updateOptionGroup } =
    useOptionGroupStore();
  const { options, updateOption } = useOptionStore();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { items, updateItem } = useItemStore(); // import your item store

  const handleDelete = async (group: ItemOptionGroup) => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      // Step 1: Remove this group from all items that reference it
      const updatePromises = (items ?? [])
        .filter((item) => item.optionGroupIds?.includes(group.id!))
        .map((item) => {
          const updatedGroupIds = item.optionGroupIds?.filter(
            (gid) => gid !== group.id
          );
          return updateItem(item.id!, {
            optionGroupIds: updatedGroupIds ?? [],
          });
        });

      await Promise.all(updatePromises);

      // Step 2: Delete the option group itself
      await deleteOptionGroup(group.id!);

      alert("Option group deleted!");
    } catch (err) {
      console.error("Failed to delete option group:", err);
      alert("Failed to delete option group");
    }
  };

  const handleRemoveOption = async (
    group: ItemOptionGroup,
    option: ItemOption
  ) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      const updatedOptionList = group.optionIds?.filter(
        (optionId) => optionId !== option.id
      );
      await updateOptionGroup(group.id!, {
        optionIds: updatedOptionList ?? [],
      });
      const updatedOptionGroupList = option.groupIds?.filter(
        (groupId) => groupId !== group.id
      );
      await updateOption(option.id!, {
        groupIds: updatedOptionGroupList ?? [],
      });

      alert("Option removed!");
    } catch {
      alert("Failed to remove option");
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
          group.optionIds?.includes(opt.id!)
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
                  onClick={() => handleDelete(group)}
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
                        onClick={() => handleRemoveOption(group, opt)}
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
