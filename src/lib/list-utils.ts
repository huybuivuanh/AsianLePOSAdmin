export type SortDir = "asc" | "desc";
export type NameCreatedSortBy = "name" | "created" | "status";

export function sortByAlphabet<T extends { name: string }>(array: T[]): T[] {
  return array.slice().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

/** Returns true when all non-empty fields contain the query term. */
export function matchesQuery(q: string, ...fields: string[]): boolean {
  if (!q.trim()) return true;
  const term = q.trim().toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(term));
}

/**
 * Sorts rows by name (localeCompare), createdAt (Firestore Timestamp millis),
 * or status (`isBlocked`, Active before Blocked). Works with any record that
 * has an optional `name` string, a Firestore-style `createdAt` with a
 * `toMillis()` method, and an optional `isBlocked` boolean.
 */
export function sortByNameAndCreated<
  T extends {
    name?: string;
    createdAt?: { toMillis?: () => number };
    isBlocked?: boolean;
  },
>(
  rows: T[],
  sortBy: NameCreatedSortBy,
  nameSort: SortDir,
  createdSort: SortDir,
  statusSort: SortDir = "asc",
): T[] {
  const sorted = [...rows];
  sorted.sort((a, b) => {
    if (sortBy === "name") {
      const av = (a.name ?? "").toLowerCase();
      const bv = (b.name ?? "").toLowerCase();
      const cmp = av.localeCompare(bv);
      return nameSort === "asc" ? cmp : -cmp;
    }
    if (sortBy === "status") {
      const av = a.isBlocked ? 1 : 0;
      const bv = b.isBlocked ? 1 : 0;
      const cmp = av - bv;
      return statusSort === "asc" ? cmp : -cmp;
    }
    const av = a.createdAt?.toMillis?.() ?? 0;
    const bv = b.createdAt?.toMillis?.() ?? 0;
    return createdSort === "desc" ? bv - av : av - bv;
  });
  return sorted;
}

export type CustomerSort =
  | "created_desc"
  | "created_asc"
  | "name_asc"
  | "name_desc"
  | "orders_desc"
  | "spent_desc"
  | "active"
  | "blocked";

/**
 * Single-key sort for the customers list. Value-based sorts
 * (`orders_desc`, `spent_desc`) fall back to name order for ties so the
 * list stays stable. `active` / `blocked` keep only those customers,
 * newest first.
 */
export function sortCustomers<
  T extends {
    name?: string;
    createdAt?: { toMillis?: () => number };
    isBlocked?: boolean;
    numberOfOrders?: number;
    totalSpent?: number;
  },
>(rows: T[], sort: CustomerSort): T[] {
  const byName = (a: T, b: T) =>
    (a.name ?? "").toLowerCase().localeCompare((b.name ?? "").toLowerCase());
  const byCreated = (a: T, b: T) =>
    (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0);

  const out =
    sort === "active"
      ? rows.filter((r) => !r.isBlocked)
      : sort === "blocked"
        ? rows.filter((r) => r.isBlocked)
        : [...rows];
  out.sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return byName(a, b);
      case "name_desc":
        return -byName(a, b);
      case "created_asc":
        return byCreated(a, b);
      case "created_desc":
      case "active":
      case "blocked":
        return -byCreated(a, b);
      case "orders_desc":
        return (
          (b.numberOfOrders ?? 0) - (a.numberOfOrders ?? 0) || byName(a, b)
        );
      case "spent_desc":
        return (b.totalSpent ?? 0) - (a.totalSpent ?? 0) || byName(a, b);
      default:
        return 0;
    }
  });
  return out;
}
