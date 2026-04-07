"use client";

import { LayoutDashboard } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { PageHeader } from "@/components/layout/PageHeader";
import DashboardTablesSection from "@/features/tables/DashboardTablesSection";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description={
          user?.email
            ? `Signed in as ${user.email}`
            : "Welcome to the admin console."
        }
      />

      <DashboardTablesSection />

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <LayoutDashboard className="size-3.5 shrink-0" aria-hidden />
        Asian Le POS Admin
      </p>
    </div>
  );
}
