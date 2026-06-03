"use client";

import { useState } from "react";
import { deleteField } from "firebase/firestore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { useItemStore } from "@/stores/useItemStore";
import { patchClearDefaultIfOptionRemoved } from "@/lib/option-group-updates";
import {
  itemReferencesOptionGroup,
  removeOptionGroupRef,
} from "@/lib/menu-item-option-groups";
import UpdateOptionGroupForm from "./UpdateOptionGroupForm";
import AddOptionForm from "./AddOptionForm";
import UpdateOptionForm from "@/features/menu/options/UpdateOptionForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ItemOption, OptionGroup } from "@/types";


type Props = { group: OptionGroup };

export function OptionGroupCard({ group }: Props) {
  const { deleteOptionGroup, updateOptionGroup } = useOptionGroupStore();
  const { options, updateOption } = useOptionStore();
  const { items, updateItem } = useItemStore();
  const [expanded, setExpanded] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);

  const groupOptions = options.filter((opt) =>
    group.optionIds?.includes(opt.id!),
  );
  const isUnused = (group.itemIds?.length ?? 0) === 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this option group?")) return;
    try {
      await Promise.all([
        ...(items ?? [])
          .filter((item) => itemReferencesOptionGroup(item, group.id!))
          .map((item) =>
            updateItem(item.id!, {
              optionGroupIds: removeOptionGroupRef(item, group.id!),
            }),
          ),
        ...(options ?? [])
          .filter((opt) => opt.groupIds?.includes(group.id!))
          .map((opt) =>
            updateOption(opt.id!, {
              groupIds: opt.groupIds?.filter((gid) => gid !== group.id) ?? [],
            }),
          ),
      ]);
      await deleteOptionGroup(group.id!);
    } catch (err) {
      console.error("Failed to delete option group:", err);
      alert("Failed to delete option group");
    }
  };

  const handleRemoveOption = async (option: ItemOption) => {
    if (!confirm("Are you sure you want to remove this option?")) return;
    try {
      await Promise.all([
        updateOptionGroup(group.id!, {
          optionIds: group.optionIds?.filter((id) => id !== option.id) ?? [],
          ...patchClearDefaultIfOptionRemoved(group, option.id),
        } as unknown as Partial<OptionGroup>),
        updateOption(option.id!, {
          groupIds: option.groupIds?.filter((id) => id !== group.id) ?? [],
        }),
      ]);
    } catch (err) {
      console.error("Failed to remove option:", err);
      alert("Failed to remove option");
    }
  };

  const handleDefaultOptionToggle = async (
    optionId: string,
    checked: boolean,
  ) => {
    setSavingDefault(true);
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
      setSavingDefault(false);
    }
  };

  return (
    <li className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-w-0 max-w-full justify-start gap-2 px-2 py-1.5 font-semibold text-foreground hover:bg-muted"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <ChevronDown className="size-4 shrink-0 opacity-70" />
          ) : (
            <ChevronRight className="size-4 shrink-0 opacity-70" />
          )}
          <span className="truncate">{group.name}</span>
          {isUnused ? (
            <span className="inline-flex shrink-0 items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              Unused
            </span>
          ) : null}
        </Button>

        <div className="flex shrink-0 flex-wrap gap-2">
          <UpdateOptionGroupForm group={group} />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <p className="ml-1 mt-2 text-sm sm:ml-7">
        Min {group.minSelection} · Max {group.maxSelection}
      </p>

      {expanded ? (
        <div className="ml-1 mt-4 space-y-3 border-t border-border/60 pt-4 sm:ml-6">
          {groupOptions.length > 0 ? (
            groupOptions.map((opt) => (
              <div
                key={opt.id}
                className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <span className="truncate text-sm text-foreground">
                    {opt.name} <span>· ${opt.price.toFixed(2)}</span>
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <Checkbox
                      id={`default-${group.id}-${opt.id}`}
                      checked={group.defaultOptionId === opt.id}
                      disabled={savingDefault}
                      onCheckedChange={(value) => {
                        const checked = value === true;
                        const isDefault = group.defaultOptionId === opt.id;
                        if (checked && !isDefault)
                          void handleDefaultOptionToggle(opt.id!, true);
                        else if (!checked && isDefault)
                          void handleDefaultOptionToggle(opt.id!, false);
                      }}
                    />
                    <Label
                      htmlFor={`default-${group.id}-${opt.id}`}
                      className="cursor-pointer whitespace-nowrap text-sm font-normal"
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
                    onClick={() => handleRemoveOption(opt)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No options in this group.
            </p>
          )}

          <AddOptionForm group={group} />
        </div>
      ) : null}
    </li>
  );
}
