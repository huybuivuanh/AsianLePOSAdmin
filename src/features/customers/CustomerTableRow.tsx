"use client";

import { useCustomerStore } from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import UpdateCustomerForm from "./UpdateCustomerForm";
import CustomerNoteButton from "./CustomerNoteButton";
import { formatTimestamp } from "@/lib/formatters";
import type { Customer } from "@/types";

type Props = { customer: Customer };

export function CustomerTableRow({ customer }: Props) {
  const { deleteCustomer, updateCustomer } = useCustomerStore();

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
    <tr className="transition-colors hover:bg-muted/40">
      <td className="px-3 py-3 font-medium text-foreground sm:px-4">
        <span className="inline-flex items-center gap-1.5">
          {customer.name}
          <CustomerNoteButton name={customer.name} note={customer.note} />
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
      <td className="px-3 py-3 sm:px-4">
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
  );
}
