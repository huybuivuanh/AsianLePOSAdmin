"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CustomerForm } from "@/features/customers/CustomerForm";
import { CustomerList } from "@/features/customers/CustomerList";
import { useCustomerStore } from "@/stores/useCustomerStore";

export default function CustomersPage() {
  const customers = useCustomerStore((s) => s.customers);
  const loading = useCustomerStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Customers" count={loading && customers.length === 0 ? undefined : customers.length}>
        <CustomerForm />
      </PageHeader>
      <CustomerList />
    </div>
  );
}
