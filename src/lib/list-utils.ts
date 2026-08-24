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
