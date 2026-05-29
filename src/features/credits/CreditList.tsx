"use client";

import { useMemo, useState } from "react";
import { useCreditStore } from "@/stores/useCreditStore";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SearchField } from "@/components/ui/search-field";
import { matchesQuery, sortByNameAndCreated } from "@/lib/list-utils";
import { CreditTableRow } from "./CreditTableRow";

export default function CreditList() {
  const { credits, loading, error } = useCreditStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "name">("created");
  const [createdSort, setCreatedSort] = useState<"desc" | "asc">("desc");
  const [nameSort, setNameSort] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(
    () =>
      credits.filter((c) =>
        matchesQuery(searchTerm, c.name ?? "", c.phoneNumber ?? ""),
      ),
    [credits, searchTerm],
  );

  const visible = useMemo(
    () => sortByNameAndCreated(filtered, sortBy, nameSort, createdSort),
    [filtered, sortBy, nameSort, createdSort],
  );

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
        Loading credits…
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 sm:p-5">
      <SearchField
        placeholder="Search by name or phone number…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search credits"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
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
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                Phone number
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                Amount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                Completed
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setSortBy("created");
                    setCreatedSort((s) => (s === "desc" ? "asc" : "desc"));
                  }}
                >
                  Created at
                  {sortBy === "created" ? (
                    createdSort === "desc" ? (
                      <ArrowDown className="size-3.5" aria-hidden />
                    ) : (
                      <ArrowUp className="size-3.5" aria-hidden />
                    )
                  ) : null}
                </Button>
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {credits.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No credits yet. Use &quot;Add credit&quot; to create the first
                  entry.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No credits match your search.
                </td>
              </tr>
            ) : (
              visible.map((credit) => (
                <CreditTableRow key={credit.id} credit={credit} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
