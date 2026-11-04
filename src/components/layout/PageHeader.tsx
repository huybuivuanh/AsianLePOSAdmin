import type { ReactNode } from "react";

/** Title + count on the left, actions on the right (same as website-admin). */
export function PageHeader({
  title,
  count,
  children,
}: {
  title: string;
  /** Hidden while the list hasn't loaded yet. */
  count?: number;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="flex items-baseline gap-2 text-xl font-semibold text-foreground sm:text-2xl">
        {title}
        {count != null && (
          <span className="text-base font-medium text-foreground/50">{count}</span>
        )}
      </h1>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
