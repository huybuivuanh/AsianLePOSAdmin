"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import UpdateCustomerForm from "./UpdateCustomerForm";
import { RowActions } from "@/components/layout/RowParts";
import { formatCurrency, formatTimestamp } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";

type Props = {
  customer: Customer;
  expanded: boolean;
  onToggle: () => void;
};

export function CustomerTableRow({ customer, expanded, onToggle }: Props) {
  const { deleteCustomer, updateCustomer } = useCustomerStore();

  const note = customer.note?.trim();

  const handleDelete = async () => {
    if (
      !(await confirmDialog(`Delete "${customer.name}"? This cannot be undone.`, {
        danger: true,
        confirmLabel: "Delete",
      }))
    )
      return;
    try {
      await deleteCustomer(customer.id!);
    } catch {
      await alertDialog("Couldn't delete customer. Try again.");
    }
  };

  const handleToggleBlocked = async () => {
    try {
      await updateCustomer(customer.id!, { isBlocked: !customer.isBlocked });
    } catch {
      await alertDialog("Couldn't update customer. Try again.");
    }
  };

  return (
    <>
      <tr
        className={cn(
          "cursor-pointer transition-colors hover:bg-foreground/[0.02]",
          !expanded && "border-b border-foreground/10",
        )}
        onClick={onToggle}
      >
        <td className="w-8 px-2 py-3 align-middle">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-foreground/60 hover:text-foreground"
            aria-label={expanded ? "Collapse row" : "Expand row"}
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {expanded ? (
              <ChevronDown className="size-4" aria-hidden />
            ) : (
              <ChevronRight className="size-4" aria-hidden />
            )}
          </Button>
        </td>
        <td className="px-3 py-3 font-medium text-foreground sm:px-4">
          <span className="inline-flex items-center gap-1.5">
            {customer.name}
            {note ? (
              <span
                className="size-1.5 rounded-full bg-amber-500"
                aria-label="Has note"
                title="Has note"
              />
            ) : null}
          </span>
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
          {customer.phone}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-foreground/60 sm:px-4">
          {formatTimestamp(customer.createdAt)}
        </td>
        <td className="px-3 py-3 sm:px-4">
          <span
            className={
              customer.isBlocked
                ? "inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                : "inline-flex rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
            }
          >
            {customer.isBlocked ? "Blocked" : "Active"}
          </span>
        </td>
        <td className="px-3 py-3 sm:px-4" onClick={(e) => e.stopPropagation()}>
          <RowActions name={customer.name} onDelete={handleDelete}>
            <UpdateCustomerForm customer={customer} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={
                customer.isBlocked
                  ? "border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/10 hover:text-emerald-800"
                  : "border-amber-500/40 text-amber-700 hover:bg-amber-500/10 hover:text-amber-800"
              }
              onClick={handleToggleBlocked}
            >
              {customer.isBlocked ? "Unblock" : "Block"}
            </Button>
          </RowActions>
        </td>
      </tr>
      {expanded ? (
        <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
          <td />
          <td colSpan={5} className="px-3 py-4 sm:px-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-foreground/60">Note:</dt>
                <dd className="min-w-0 whitespace-pre-wrap text-foreground">
                  {note || "—"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-foreground/60">Orders:</dt>
                <dd className="text-foreground">{customer.numberOfOrders}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-foreground/60">
                  Total spent:
                </dt>
                <dd className="text-foreground">
                  {formatCurrency(customer.totalSpent)}
                </dd>
              </div>
            </dl>
          </td>
        </tr>
      ) : null}
    </>
  );
}
