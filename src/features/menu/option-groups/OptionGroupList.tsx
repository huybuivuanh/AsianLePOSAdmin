"use client";

import { useState } from "react";
import { deleteField } from "firebase/firestore";
import { patchClearDefaultIfOptionRemoved } from "@/lib/option-group-updates";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import UpdateOptionGroupForm from "./UpdateOptionGroupForm";
import AddOptionForm from "./AddOptionForm";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useItemStore } from "@/stores/useItemStore";
import {
  itemReferencesOptionGroup,
  removeOptionGroupRef,
} from "@/lib/menu-item-option-groups";
import UpdateOptionForm from "@/features/menu/options/UpdateOptionForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function OptionGroupsList() {
  const { optionGroups, loading, deleteOptionGroup, updateOptionGroup } =
    useOptionGroupStore();
  const { options, updateOption } = useOptionStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { items, updateItem } = useItemStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [savingDefaultGroupId, setSavingDefaultGroupId] = useState<
    string | null
  >(null);

  const handleDelete = async (group: OptionGroup) => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      const updatePromises = [
        // Update items
        ...(items ?? [])
          .filter((item) => itemReferencesOptionGroup(item, group.id!))
          .map((item) => {
            const updatedGroupIds = removeOptionGroupRef(item, group.id!);
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

  const handleRemoveOption = async (group: OptionGroup, option: ItemOption) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      const updatedOptionIds =
        group.optionIds?.filter((id) => id !== option.id) ?? [];
      const updatedGroupIds =
        option.groupIds?.filter((id) => id !== group.id) ?? [];

      await Promise.all([
        updateOptionGroup(group.id!, {
          optionIds: updatedOptionIds,
          ...patchClearDefaultIfOptionRemoved(group, option.id),
        } as unknown as Partial<OptionGroup>),
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

  const handleDefaultOptionToggle = async (
    group: OptionGroup,
    optionId: string,
    checked: boolean
  ) => {
    setSavingDefaultGroupId(group.id!);
    try {
      if (checked) {
        await updateOptionGroup(group.id!, { defaultOptionId: optionId });
      } else {
        await updateOptionGroup(group.id!, {
          defaultOptionId: deleteField(),
        } as unknown as Partial<OptionGroup>);
      }
    } catch (err) {
      console.error("Failed to update default option:", err);
      alert("Failed to update default option");
    } finally {
      setSavingDefaultGroupId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  // Filter option groups based on search term
  const filteredGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
              group.optionIds?.includes(opt.id!),
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
                      groupOptions.map((opt) => {
                        const isDefault = group.defaultOptionId === opt.id;
                        const saving = savingDefaultGroupId === group.id;
                        return (
                          <div
                            key={opt.id}
                            className="flex flex-wrap justify-between items-center gap-2 border px-3 py-2 rounded bg-gray-50"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="truncate">
                                {opt.name} – ${opt.price.toFixed(2)}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <Checkbox
                                  id={`default-${group.id}-${opt.id}`}
                                  checked={isDefault}
                                  disabled={saving}
                                  onCheckedChange={(value) => {
                                    const checked = value === true;
                                    if (checked) {
                                      if (isDefault) return;
                                      void handleDefaultOptionToggle(
                                        group,
                                        opt.id!,
                                        true
                                      );
                                    } else if (isDefault) {
                                      void handleDefaultOptionToggle(
                                        group,
                                        opt.id!,
                                        false
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`default-${group.id}-${opt.id}`}
                                  className="text-sm font-normal cursor-pointer whitespace-nowrap"
                                >
                                  Default option
                                </Label>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <UpdateOptionForm option={opt} />
                              <button
                                onClick={() => handleRemoveOption(group, opt)}
                                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })
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
