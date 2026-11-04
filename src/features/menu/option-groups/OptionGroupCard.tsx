"use client";

import { useState } from "react";
import { deleteField } from "firebase/firestore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { useOptionStore } from "@/stores/useOptionStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";
import { deleteOptionGroup, removeOptionFromGroup } from "@/lib/linked-writes";
import UpdateOptionGroupForm from "./UpdateOptionGroupForm";
import AddOptionForm from "./AddOptionForm";
import UpdateOptionForm from "@/features/menu/options/UpdateOptionForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ExpandChevron,
  RemoveButton,
  RowActions,
  UnusedBadge,
  rowCardClass,
  rowHeaderClass,
} from "@/components/layout/RowParts";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = { group: OptionGroup };

export function OptionGroupCard({ group }: Props) {
  const { updateOptionGroup } = useOptionGroupStore();
  const { options } = useOptionStore();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingDefault, setSavingDefault] = useState(false);

  const groupOptions = options.filter((opt) =>
    group.optionIds?.includes(opt.id!),
  );
  const isUnused = (group.itemIds?.length ?? 0) === 0;

  const handleDelete = async () => {
    if (
      !(await confirmDialog(`Delete "${group.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    setDeleting(true);
    try {
      await deleteOptionGroup(group.id!);
    } catch (err) {
      console.error("Failed to delete option group:", err);
      setDeleting(false);
      await alertDialog(`Couldn't delete "${group.name}". Try again.`);
    }
  };

  const handleRemoveOption = async (option: ItemOption) => {
    if (
      !(await confirmDialog(`Remove "${option.name}" from "${group.name}"?`, {
        confirmLabel: "Remove",
      }))
    )
      return;
    try {
      await removeOptionFromGroup(group.id!, option.id!);
    } catch (err) {
      console.error("Failed to remove option:", err);
      await alertDialog("Couldn't remove the option. Try again.");
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
      await alertDialog("Couldn't update the default option. Try again.");
    } finally {
      setSavingDefault(false);
    }
  };

  const toggle = () => setExpanded((v) => !v);

  return (
    <li className={cn(rowCardClass, deleting && "opacity-50")}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={rowHeaderClass}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <ExpandChevron expanded={expanded} />
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate font-medium text-foreground">{group.name}</p>
            {isUnused && <UnusedBadge />}
          </div>
          <p className="text-sm text-foreground/50">
            Min {group.minSelection} · Max {group.maxSelection} ·{" "}
            {groupOptions.length} {groupOptions.length === 1 ? "option" : "options"}
          </p>
        </div>
        <RowActions name={group.name} onDelete={handleDelete} deleting={deleting}>
          <UpdateOptionGroupForm group={group} />
        </RowActions>
      </div>

      {expanded ? (
        <div className="border-t border-foreground/10 px-3 py-3 sm:px-4">
          {groupOptions.length > 0 ? (
            <ul className="mb-3 divide-y divide-foreground/10">
              {groupOptions.map((opt) => (
                <li
                  key={opt.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2"
                >
                  <span className="min-w-0 text-sm break-words text-foreground">
                    {opt.name}
                    <span className="text-foreground/50">
                      {" · "}
                      {formatCurrency(opt.price)}
                    </span>
                  </span>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-2">
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
                        className="cursor-pointer text-sm font-normal whitespace-nowrap text-foreground/70"
                      >
                        Default
                      </Label>
                    </div>
                    <UpdateOptionForm option={opt} />
                    <RemoveButton
                      label={`Remove ${opt.name} from ${group.name}`}
                      onClick={() => handleRemoveOption(opt)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mb-3 text-sm text-foreground/60">No options in this group.</p>
          )}

          <AddOptionForm group={group} />
        </div>
      ) : null}
    </li>
  );
}
