"use client";

import { useEffect, useMemo, useState } from "react";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { CustomerTableRow } from "./CustomerTableRow";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import { matchesQuery, sortByNameAndCreated } from "@/lib/list-utils";

const PAGE_SIZE = 100;

export default function CustomerList() {
  const { customers, loading, error } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "name" | "status">(
    "created",
  );
  const [createdSort, setCreatedSort] = useState<"desc" | "asc">("desc");
  const [nameSort, setNameSort] = useState<"asc" | "desc">("asc");
  const [statusSort, setStatusSort] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => customers.filter((c) => matchesQuery(searchTerm, c.name, c.phone)),
    [customers, searchTerm],
  );

  const sorted = useMemo(
    () =>
      sortByNameAndCreated(
        filtered,
        sortBy,
        nameSort,
        createdSort,
        statusSort,
      ),
    [filtered, sortBy, nameSort, createdSort, statusSort],
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy, nameSort, createdSort, statusSort]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

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
      <div>
        <p className="ml-1 text-md font-medium tracking-tight text-muted-foreground">
          Customers Saved : {customers.length}
        </p>
      </div>
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
                  onClick={() => {
                    setSortBy("name");
                    setNameSort((s) => (s === "asc" ? "desc" : "asc"));
                  }}
                >
                  Name
                  {sortBy === "name" ? (
                    nameSort === "asc" ? (
                      <ArrowUp className="size-3.5" aria-hidden />
                    ) : (
                      <ArrowDown className="size-3.5" aria-hidden />
                    )
                  ) : null}
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Phone
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
                  onClick={() => {
                    setSortBy("created");
                    setCreatedSort((s) => (s === "desc" ? "asc" : "desc"));
                  }}
                >
                  Created
                  {sortBy === "created" ? (
                    createdSort === "desc" ? (
                      <ArrowDown className="size-3.5" aria-hidden />
                    ) : (
                      <ArrowUp className="size-3.5" aria-hidden />
                    )
                  ) : null}
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase hover:text-foreground"
                  onClick={() => {
                    setSortBy("status");
                    setStatusSort((s) => (s === "asc" ? "desc" : "asc"));
                  }}
                >
                  Status
                  {sortBy === "status" ? (
                    statusSort === "asc" ? (
                      <ArrowUp className="size-3.5" aria-hidden />
                    ) : (
                      <ArrowDown className="size-3.5" aria-hidden />
                    )
                  ) : null}
                </Button>
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
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No customers in Firestore yet.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No customers match your search.
                </td>
              </tr>
            ) : (
              visible.map((customer) => (
                <CustomerTableRow key={customer.id} customer={customer} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
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
            <span className="text-xs text-muted-foreground">
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
