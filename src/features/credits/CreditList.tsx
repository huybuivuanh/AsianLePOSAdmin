"use client";

import { useMemo, useState } from "react";
import { useCreditStore } from "@/stores/useCreditStore";
import { Button } from "@/components/ui/button";
import UpdateCreditForm from "@/features/credits/UpdateCreditForm";
import { ArrowDown, ArrowUp, CheckCircle2, RotateCcw } from "lucide-react";
import { SearchField } from "@/components/ui/search-field";

function matchesSearch(credit: Credit, q: string): boolean {
  if (!q.trim()) return true;
  const n = q.trim().toLowerCase();
  return (
    (credit.name ?? "").toLowerCase().includes(n) ||
    (credit.phoneNumber ?? "").toLowerCase().includes(n)
  );
}

function formatCreatedAt(credit: Credit): string {
  try {
    const createdAt = (credit as Credit & { createdAt?: unknown }).createdAt as
      | { toDate?: () => Date }
      | undefined;
    if (!createdAt || typeof createdAt.toDate !== "function") return "—";
    return createdAt.toDate().toLocaleString();
  } catch {
    return "—";
  }
}

export default function CreditList() {
  const { credits, loading, error, deleteCredit, updateCredit } =
    useCreditStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "name">("created");
  const [createdSort, setCreatedSort] = useState<"desc" | "asc">("desc");
  const [nameSort, setNameSort] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(
    () => credits.filter((c) => matchesSearch(c, searchTerm)),
    [credits, searchTerm],
  );

  const visible = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      if (sortBy === "name") {
        const av = (a.name ?? "").toLowerCase();
        const bv = (b.name ?? "").toLowerCase();
        const cmp = av.localeCompare(bv);
        return nameSort === "asc" ? cmp : -cmp;
      }

      const av = a.createdAt?.toMillis?.() ?? 0;
      const bv = b.createdAt?.toMillis?.() ?? 0;
      return createdSort === "desc" ? bv - av : av - bv;
    });
    return rows;
  }, [filtered, sortBy, nameSort, createdSort]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this credit?")) return;
    try {
      await deleteCredit(id);
    } catch {
      alert("Failed to delete credit");
    }
  };

  const handleToggleCompleted = async (credit: Credit) => {
    try {
      await updateCredit(credit.id!, { completed: !credit.completed });
    } catch {
      alert("Failed to update credit");
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
                Phone number
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Description
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Amount
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
                Completed
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
              <th className="px-3 py-3 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase sm:px-4">
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
                <tr
                  key={credit.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <td className="px-3 py-3 font-medium text-foreground sm:px-4">
                    {credit.name ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {credit.phoneNumber ?? "—"}
                  </td>
                  <td className="max-w-[18rem] px-3 py-3 break-words text-muted-foreground sm:max-w-none sm:px-4">
                    {credit.description ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground sm:px-4">
                    {typeof credit.amount === "number"
                      ? credit.amount.toFixed(2)
                      : "0.00"}
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
                    {formatCreatedAt(credit)}
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
                        onClick={() => handleToggleCompleted(credit)}
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
                        onClick={() => handleDelete(credit.id!)}
                      >
                        Delete
                      </Button>
                    </div>
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
