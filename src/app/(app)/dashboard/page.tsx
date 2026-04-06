"use client";

import Link from "next/link";
import {
  ClipboardList,
  LayoutGrid,
  LayoutDashboard,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { PageHeader } from "@/components/layout/PageHeader";

const shortcuts = [
  {
    href: "/menu",
    title: "Menu",
    description: "Categories, items, option groups, and options.",
    icon: LayoutGrid,
  },
  {
    href: "/users",
    title: "Users",
    description: "Create accounts and assign roles.",
    icon: Users,
  },
  {
    href: "/orders",
    title: "Orders",
    description: "Review order history.",
    icon: ClipboardList,
  },
] as const;

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Dashboard"
        description={
          user?.email
            ? `Signed in as ${user.email}`
            : "Welcome to the admin console."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shortcuts.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden />
            </div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <LayoutDashboard className="size-3.5 shrink-0" aria-hidden />
        Asian Le POS Admin
      </p>
    </div>
  );
}
