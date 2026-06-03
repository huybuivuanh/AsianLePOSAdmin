"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import DashboardTablesSection from "@/features/tables/DashboardTablesSection";

export default function TablesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Tables"
        description="Manage tables — tap a table to rename or remove it."
      />
      <DashboardTablesSection />
    </div>
  );
}
