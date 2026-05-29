"use client";

import { useCreditStore } from "@/stores/useCreditStore";
import { Button } from "@/components/ui/button";
import UpdateCreditForm from "./UpdateCreditForm";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { formatTimestamp } from "@/lib/formatters";
import type { Credit } from "@/types";

type Props = { credit: Credit };

export function CreditTableRow({ credit }: Props) {
  const { deleteCredit, updateCredit } = useCreditStore();

  const handleDelete = async () => {
    if (!confirm("Delete this credit?")) return;
    try {
      await deleteCredit(credit.id!);
    } catch {
      alert("Failed to delete credit");
    }
  };

  const handleToggleCompleted = async () => {
    try {
      await updateCredit(credit.id!, { completed: !credit.completed });
    } catch {
      alert("Failed to update credit");
    }
  };

  return (
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-3 py-3 font-medium text-foreground sm:px-4">
        {credit.name ?? "—"}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
        {credit.phoneNumber ?? "—"}
      </td>
      <td className="max-w-[18rem] break-words px-3 py-3 text-muted-foreground sm:max-w-none sm:px-4">
        {credit.description ?? "—"}
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
        {typeof credit.amount === "number" ? credit.amount.toFixed(2) : "0.00"}
      </td>
      <td className="px-3 py-3 sm:px-4">
        <span
          className={
            credit.completed
              ? "inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700"
              : "inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
          }
        >
          {credit.completed ? "Yes" : "No"}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
        {formatTimestamp(credit.createdAt)}
      </td>
      <td className="px-3 py-3 sm:px-4">
        <div className="flex flex-wrap gap-2">
          <UpdateCreditForm credit={credit} />
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
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
}
