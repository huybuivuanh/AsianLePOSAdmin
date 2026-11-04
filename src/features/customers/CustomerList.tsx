"use client";

import { useEffect, useMemo, useState } from "react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { CustomerTableRow } from "./CustomerTableRow";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { tableCardClass } from "@/components/layout/RowParts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { matchesQuery, sortCustomers, type CustomerSort } from "@/lib/list-utils";

const PAGE_SIZE = 100;

const SORT_OPTIONS: { value: CustomerSort; label: string }[] = [
  { value: "created_desc", label: "Newest first" },
  { value: "created_asc", label: "Oldest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "orders_desc", label: "Most orders" },
  { value: "spent_desc", label: "Most spent" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

export function CustomerList() {
  const { customers, loading, error } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<CustomerSort>("created_desc");
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(
    () => customers.filter((c) => matchesQuery(searchTerm, c.name, c.phone)),
    [customers, searchTerm],
  );

  const sorted = useMemo(
    () => sortCustomers(filtered, sort),
    [filtered, sort],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
    setExpandedIds(new Set());
  }, [searchTerm, sort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  if (error) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-foreground/60">Loading customers…</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          className="flex-1"
          placeholder="Search by name or phone…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search customers"
        />
        <div className="flex shrink-0 items-center gap-2">
          <label
            htmlFor="customer-sort"
            className="text-xs font-medium tracking-wide text-foreground/60 uppercase"
          >
            Sort by
          </label>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as CustomerSort)}
          >
            <SelectTrigger id="customer-sort" className="h-10 w-48 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`${tableCardClass} overflow-x-auto`}>
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/[0.03]">
              <th className="w-8 px-2 py-3" aria-hidden />
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
                Phone
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
                Created
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-foreground/60 uppercase sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-foreground/60"
                >
                  No customers in Firestore yet.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-foreground/60"
                >
                  No customers match your search.
                </td>
              </tr>
            ) : (
              visible.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  expanded={!!customer.id && expandedIds.has(customer.id)}
                  onToggle={() => customer.id && toggleExpanded(customer.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-foreground/60">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden />
              Previous
            </Button>
            <span className="text-xs text-foreground/60">
              Page {page} of {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
