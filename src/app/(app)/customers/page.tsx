"use client";

import CustomerList from "@/features/customers/CustomerList";
import { PageHeader } from "@/components/layout/PageHeader";

export default function CustomersPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Customers"
        description="Customers synced from Firestore in real time."
      />

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <CustomerList />
      </div>
    </div>
  );
}
