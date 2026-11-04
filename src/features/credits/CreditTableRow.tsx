"use client";

import { useCreditStore } from "@/stores/useCreditStore";
import { Button } from "@/components/ui/button";
import { CreditForm } from "./CreditForm";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { RowActions } from "@/components/layout/RowParts";
import { formatCurrency, formatTimestamp } from "@/lib/formatters";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";

type Props = { credit: Credit };

export function CreditTableRow({ credit }: Props) {
  const { deleteCredit, updateCredit } = useCreditStore();

  const handleDelete = async () => {
    if (
      !(await confirmDialog(
        `Delete the credit for "${credit.name ?? credit.phoneNumber ?? "this customer"}"? This cannot be undone.`,
        { danger: true, confirmLabel: "Delete" },
      ))
    )
      return;
    try {
      await deleteCredit(credit.id!);
    } catch {
      await alertDialog("Couldn't delete credit. Try again.");
    }
  };

  const handleToggleCompleted = async () => {
    try {
      await updateCredit(credit.id!, { completed: !credit.completed });
    } catch {
      await alertDialog("Couldn't update credit. Try again.");
    }
  };

  return (
    <tr className="transition-colors hover:bg-foreground/[0.02]">
      <td className="px-3 py-3 font-medium text-foreground sm:px-4">
        {credit.name ?? "—"}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
        {credit.phoneNumber ?? "—"}
      </td>
      <td className="max-w-[18rem] break-words px-3 py-3 text-foreground/60 sm:max-w-none sm:px-4">
        {credit.description ?? "—"}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
        {formatCurrency(typeof credit.amount === "number" ? credit.amount : 0)}
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span
          className={
            credit.completed
              ? "inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex rounded-full border border-foreground/15 px-2 py-0.5 text-xs font-medium text-foreground/70"
          }
        >
          {credit.completed ? "Yes" : "No"}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
        {formatTimestamp(credit.createdAt)}
      </td>
      <td className="px-3 py-3 sm:px-4">
        <RowActions name="credit" onDelete={handleDelete}>
          <CreditForm credit={credit} />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={
              credit.completed
                ? "border-amber-500/40 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800"
                : "border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800"
            }
            onClick={handleToggleCompleted}
          >
            {credit.completed ? (
              <>
                <RotateCcw className="size-4" aria-hidden />
                Mark incomplete
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" aria-hidden />
                Mark completed
              </>
            )}
          </Button>
        </RowActions>
      </td>
    </tr>
  );
}
