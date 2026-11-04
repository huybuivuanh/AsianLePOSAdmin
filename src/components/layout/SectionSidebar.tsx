"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SectionSidebarLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

// Saved separately for phones and larger screens, so expanding it on a desktop
// doesn't make it open full-width on a phone.
const SMALL_SCREEN = 768;
const storageKey = () =>
  window.innerWidth < SMALL_SCREEN
    ? "section-sidebar-collapsed-sm"
    : "section-sidebar-collapsed";

// Shared collapsed state, saved in localStorage and synced across every
// mounted sidebar (and across browser tabs via the `storage` event).
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  // With no saved preference the collapsed state follows the viewport, so
  // re-check when it crosses the breakpoint.
  window.addEventListener("resize", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener("resize", callback);
  };
}

function getSnapshot() {
  try {
    const stored = localStorage.getItem(storageKey());
    if (stored === "1") return true;
    if (stored === "0") return false;
  } catch {
    /* localStorage unavailable — fall through to the viewport default */
  }
  // No saved preference: start collapsed on small screens.
  return typeof window !== "undefined" && window.innerWidth < SMALL_SCREEN;
}

function setCollapsed(next: boolean) {
  try {
    localStorage.setItem(storageKey(), next ? "1" : "0");
  } catch {
    /* ignore write failures (private mode, disabled storage) */
  }
  listeners.forEach((l) => l());
}

/** Collapsible left sidebar for a section with sub-pages (same as website-admin). */
export function SectionSidebar({
  title,
  links,
  ariaLabel,
}: {
  title: string;
  links: readonly SectionSidebarLink[];
  ariaLabel: string;
}) {
  const pathname = usePathname();
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return (
    <aside
      className={cn(
        "min-h-[calc(100dvh-4rem)] shrink-0 border-r border-foreground/10 bg-foreground/[0.03] transition-[width] duration-200",
        collapsed ? "w-14" : "w-60",
      )}
      aria-label={ariaLabel}
    >
      <div className="sticky top-16 px-2 py-4">
        <div
          className={cn(
            "mb-3 flex items-center",
            collapsed ? "justify-center" : "justify-between px-2",
          )}
        >
          {!collapsed && (
            <p className="truncate text-xs font-semibold tracking-wide text-foreground/60 uppercase">
              {title}
            </p>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            className="rounded-lg p-1.5 text-foreground/60 transition-colors outline-none hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <ChevronRight
              className={cn("size-4 transition-transform", !collapsed && "rotate-180")}
              aria-hidden
            />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                aria-label={collapsed ? label : undefined}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center rounded-xl text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                  collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5",
                  isActive
                    ? "bg-foreground/10 text-foreground"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                <span className="shrink-0 [&>svg]:size-5" aria-hidden>
                  {icon}
                </span>
                {!collapsed && <span className="pl-3">{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
