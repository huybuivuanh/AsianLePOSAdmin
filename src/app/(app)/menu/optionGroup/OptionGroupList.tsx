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
  const { items, updateItem } = useItemStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (group: ItemOptionGroup) => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      const updatePromises = [
        // Update items
        ...(items ?? [])
          .filter((item) => item.optionGroupIds?.includes(group.id!))
          .map((item) => {
            const updatedGroupIds =
              item.optionGroupIds?.filter((gid) => gid !== group.id) ?? [];
            return updateItem(item.id!, { optionGroupIds: updatedGroupIds });
          }),
        // Update options
        ...(options ?? [])
          .filter((opt) => opt.groupIds?.includes(group.id!))
          .map((opt) => {
            const updatedGroupIds =
              opt.groupIds?.filter((gid) => gid !== group.id) ?? [];
            return updateOption(opt.id!, { groupIds: updatedGroupIds });
          }),
      ];

      await Promise.all(updatePromises);

      // Delete the group
      await deleteOptionGroup(group.id!);
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
      const updatedOptionIds =
        group.optionIds?.filter((id) => id !== option.id) ?? [];
      const updatedGroupIds =
        option.groupIds?.filter((id) => id !== group.id) ?? [];

      await Promise.all([
        updateOptionGroup(group.id!, { optionIds: updatedOptionIds }),
        updateOption(option.id!, { groupIds: updatedGroupIds }),
      ]);
    } catch (err) {
      console.error("Failed to remove option:", err);
      alert("Failed to remove option");
    }
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <p>Loading...</p>;

  // Filter option groups based on search term
  const filteredGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div>
        <input
          type="text"
          placeholder="Search option groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
      </div>

      <ul className="space-y-2">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
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
                    {groupOptions.length > 0 ? (
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
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No options in this group
                      </p>
                    )}

                    <AddOptionForm group={group} />
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p className="text-sm text-gray-500 italic">
            No option groups match your search
          </p>
        )}
      </ul>
    </div>
  );
}
