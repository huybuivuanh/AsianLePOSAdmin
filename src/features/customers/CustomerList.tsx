"use client";

import { useMemo, useState } from "react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

function matchesSearch(customer: Customer, q: string): boolean {
  if (!q.trim()) return true;
  const n = q.trim().toLowerCase();
  return (
    customer.name.toLowerCase().includes(n) ||
    customer.phone.toLowerCase().includes(n)
  );
}

export default function CustomerList() {
  const { customers, loading, error, deleteCustomer } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(
    () => customers.filter((c) => matchesSearch(c, searchTerm)),
    [customers, searchTerm],
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
    } catch {
      alert("Failed to delete customer");
    }
  };

  if (error) {
    return (
      <div className="px-4 py-10 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Loading customers…
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <SearchField
        placeholder="Search by name or phone…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search customers"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Phone
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Created
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No customers in Firestore yet.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No customers match your search.
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                    {customer.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {customer.phone}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {customer.createdAt.toDate().toLocaleString()}
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(customer.id!)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
