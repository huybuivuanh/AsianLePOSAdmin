// Shared list-row styling (same as website-admin's components/menu/RowParts).
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Outer card for every list row. */
export const rowCardClass =
  "rounded-xl border border-foreground/10 bg-background transition-colors hover:border-foreground/20";

/** The clickable header of an expandable row. */
export const rowHeaderClass =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 sm:px-4";

/** Dashed "+ Add …" button used inside expanded rows. */
export const addButtonClass =
  "inline-flex min-h-9 items-center rounded-lg border border-dashed border-foreground/25 px-3 text-sm font-medium text-foreground/80 hover:border-foreground/40 hover:bg-foreground/5 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

/** Quiet outlined button for secondary actions inside rows. */
export const subtleButtonClass =
  "inline-flex min-h-9 items-center rounded-lg border border-foreground/15 px-3 text-sm font-medium text-foreground hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:opacity-50";

/** Bordered table wrapper for table-style lists (customers, credits, users). */
export const tableCardClass =
  "overflow-hidden rounded-xl border border-foreground/10 bg-background";

/** Points right when closed, down when open. Hidden on phones to save room. */
export function ExpandChevron({ expanded }: { expanded: boolean }) {
  return (
    <ChevronRight
      className={cn(
        "hidden size-4 shrink-0 text-foreground/40 transition-transform sm:block",
        expanded && "rotate-90",
      )}
      aria-hidden
    />
  );
}

/** Edit + a red Delete button. Clicks don't toggle the row they sit in. */
export function RowActions({
  name,
  onEdit,
  onDelete,
  deleting = false,
  children,
}: {
  /** Used in the delete button's accessible label. */
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleting?: boolean;
  /** Extra buttons shown before Edit. */
  children?: ReactNode;
}) {
  return (
    <div
      className="flex shrink-0 flex-wrap items-center justify-end gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {children}
      {onEdit && (
        <Button type="button" variant="outline" size="sm" onClick={onEdit} disabled={deleting}>
          Edit
        </Button>
      )}
      {onDelete && (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Delete ${name}`}
        >
          {deleting ? "Deleting…" : "Delete"}
        </Button>
      )}
    </div>
  );
}

/** Small red outlined button for removing something from a list. */
export function RemoveButton({
  onClick,
  label,
  children = "Remove",
}: {
  onClick: () => void;
  /** Accessible label, e.g. `Remove Large from Size`. */
  label: string;
  children?: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-label={label}
      className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      {children}
    </Button>
  );
}

/** Soft box for "nothing here" / "no matches" states. */
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6">
      <p className="text-sm font-medium text-foreground">{title}</p>
      {hint && <p className="mt-1 text-sm text-foreground/60">{hint}</p>}
    </div>
  );
}

/** Amber tag for menu entries nothing uses (e.g. an item in no category). */
export function UnusedBadge() {
  return (
    <span className="shrink-0 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      Unused
    </span>
  );
}

/** Toggle next to a menu page's search box that shows only unused entries. */
export function UnusedFilterButton({
  active,
  count,
  onToggle,
  title,
}: {
  active: boolean;
  count: number;
  onToggle: () => void;
  /** Tooltip explaining what "unused" means on this page. */
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      disabled={count === 0 && !active}
      title={title}
      className={cn(
        "h-10 shrink-0 rounded-xl border px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 disabled:opacity-50",
        active
          ? "border-amber-400 bg-amber-100 text-amber-800"
          : "border-foreground/20 text-foreground hover:bg-foreground/5",
      )}
    >
      Unused {count}
    </button>
  );
}
