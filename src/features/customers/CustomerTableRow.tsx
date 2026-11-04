"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import UpdateCustomerForm from "./UpdateCustomerForm";
import { formatCurrency, formatTimestamp } from "@/lib/formatters";
import { cn } from "@/lib/utils";

type Props = {
  customer: Customer;
  expanded: boolean;
  onToggle: () => void;
};

export function CustomerTableRow({ customer, expanded, onToggle }: Props) {
  const { deleteCustomer, updateCustomer } = useCustomerStore();

  const note = customer.note?.trim();

  const handleDelete = async () => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(customer.id!);
    } catch {
      alert("Failed to delete customer");
    }
  };

  const handleToggleBlocked = async () => {
    try {
      await updateCustomer(customer.id!, { isBlocked: !customer.isBlocked });
    } catch {
      alert("Failed to update customer");
    }
  };

  return (
    <>
      <tr
        className={cn(
          "cursor-pointer transition-colors hover:bg-muted/40",
          !expanded && "border-b border-border",
        )}
        onClick={onToggle}
      >
        <td className="w-8 px-2 py-3 align-middle">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-6 text-muted-foreground hover:text-foreground"
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
        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
          {customer.phone}
        </td>
        <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
          {formatTimestamp(customer.createdAt)}
        </td>
        <td className="px-3 py-3 sm:px-4">
          <span
            className={
              customer.isBlocked
                ? "inline-flex rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive"
                : "inline-flex rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700"
            }
          >
            {customer.isBlocked ? "Blocked" : "Active"}
          </span>
        </td>
        <td className="px-3 py-3 sm:px-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap gap-2">
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
      {expanded ? (
        <tr className="border-b border-border bg-muted/20">
          <td />
          <td colSpan={5} className="px-3 py-4 sm:px-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-muted-foreground">Note:</dt>
                <dd className="min-w-0 whitespace-pre-wrap text-foreground">
                  {note || "—"}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-muted-foreground">Orders:</dt>
                <dd className="text-foreground">{customer.numberOfOrders}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-muted-foreground">
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
