"use client";

import { useMemo, useState } from "react";
import { useCreditStore } from "@/stores/useCreditStore";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { SearchField } from "@/components/ui/search-field";
import { tableCardClass } from "@/components/layout/RowParts";
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
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-sm text-foreground/60">Loading credits…</p>
    );
  }

  return (
    <div>
      <SearchField
        className="mb-4"
        placeholder="Search by name or phone number…"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search credits"
      />

      <div className={`${tableCardClass} overflow-x-auto`}>
        <table className="w-full min-w-[56rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-foreground/10 bg-foreground/[0.03]">
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium uppercase tracking-wide text-foreground/60 hover:text-foreground"
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
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                Phone number
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                Amount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                Completed
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 h-auto px-2 py-1 text-xs font-medium uppercase tracking-wide text-foreground/60 hover:text-foreground"
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
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-foreground/60 sm:px-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {credits.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-foreground/60"
                >
                  No credits yet. Use &quot;Add credit&quot; to create the first
                  entry.
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-foreground/60"
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
