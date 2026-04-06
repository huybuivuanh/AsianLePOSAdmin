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
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

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

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading option groups…</p>
    );
  }

  // Filter option groups based on search term
  const filteredGroups = optionGroups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <SearchField
        placeholder="Search option groups…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search option groups"
      />

      <ul className="space-y-3">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => {
            const groupOptions = options.filter((opt) =>
              group.optionIds?.includes(opt.id!),
            );

            return (
              <li
                key={group.id}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto min-w-0 max-w-full justify-start gap-2 px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
                    onClick={() => toggleExpand(group.id!)}
                  >
                    {expanded[group.id!] ? (
                      <ChevronDown className="size-4 shrink-0 opacity-70" />
                    ) : (
                      <ChevronRight className="size-4 shrink-0 opacity-70" />
                    )}
                    <span className="truncate">{group.name}</span>
                  </Button>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <UpdateOptionGroupForm group={group} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(group)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <p className="mt-2 ml-1 text-sm text-muted-foreground sm:ml-7">
                  Min {group.minSelection} · Max {group.maxSelection}
                </p>

                {expanded[group.id!] && (
                  <div className="mt-4 ml-1 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
                    {groupOptions.length > 0 ? (
                      groupOptions.map((opt) => {
                        const isDefault = group.defaultOptionId === opt.id;
                        const saving = savingDefaultGroupId === group.id;
                        return (
                          <div
                            key={opt.id}
                            className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                          >
                            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                              <span className="truncate text-sm text-foreground">
                                {opt.name}{" "}
                                <span className="text-muted-foreground">
                                  · ${opt.price.toFixed(2)}
                                </span>
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
                            <div className="flex shrink-0 flex-wrap gap-2">
                              <UpdateOptionForm option={opt} />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-destructive/40 text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveOption(group, opt)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No options in this group.
                      </p>
                    )}

                    <AddOptionForm group={group} />
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
            No option groups match your search.
          </p>
        )}
      </ul>
    </div>
  );
}
