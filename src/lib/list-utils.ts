export type SortDir = "asc" | "desc";
export type NameCreatedSortBy = "name" | "created";

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
 * Sorts rows by name (localeCompare) or createdAt (Firestore Timestamp millis).
 * Works with any record that has an optional `name` string and a Firestore-style
 * `createdAt` with a `toMillis()` method.
 */
export function sortByNameAndCreated<
  T extends { name?: string; createdAt?: { toMillis?: () => number } },
>(
  rows: T[],
  sortBy: NameCreatedSortBy,
  nameSort: SortDir,
  createdSort: SortDir,
): T[] {
  const sorted = [...rows];
  sorted.sort((a, b) => {
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
  return sorted;
}
