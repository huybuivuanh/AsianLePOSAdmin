"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { cn } from "@/lib/utils";
import { addButtonClass } from "@/components/layout/RowParts";

/**
 * Dialog shell shared by every "add or edit" form: trigger button, title, form, and
 * the save button. Add mode shows "+ Add …"; edit mode shows "Edit" and a blue save.
 * The form owns its fields and calls `onOpenChange(true)` to load them fresh.
 */
export function EntityFormDialog({
  isEdit,
  addLabel,
  addStyle = "primary",
  editLabel = "Edit",
  title,
  description,
  open,
  onOpenChange,
  saving,
  canSubmit = true,
  onSubmit,
  submitLabel,
  contentClassName,
  children,
}: {
  isEdit: boolean;
  /** Trigger text in add mode, e.g. "+ Add credit". */
  addLabel: string;
  /** "inline" = small dashed button used inside an expanded row. */
  addStyle?: "primary" | "inline";
  /** Trigger text in edit mode. */
  editLabel?: string;
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  saving: boolean;
  canSubmit?: boolean;
  onSubmit: () => void | Promise<void>;
  /** Save button text; defaults to "Add" / "Save changes". */
  submitLabel?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <>
      <LoadingOverlay visible={saving} />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {isEdit ? (
            <Button type="button" variant="outline" size="sm">
              {editLabel}
            </Button>
          ) : addStyle === "inline" ? (
            <Button type="button" variant="ghost" size="sm" className={addButtonClass}>
              {addLabel}
            </Button>
          ) : (
            <Button type="button">{addLabel}</Button>
          )}
        </DialogTrigger>
        <DialogContent className={cn("sm:max-w-xl", contentClassName)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit && !saving) void onSubmit();
            }}
            className="flex flex-col gap-4"
          >
            {children}
            <DialogFooter>
              <Button
                type="submit"
                disabled={!canSubmit || saving}
                className={cn(isEdit && "bg-blue-500 text-white hover:bg-blue-600")}
              >
                {submitLabel ?? (isEdit ? "Save changes" : "Add")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
