"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import CreateCreditForm from "@/features/credits/CreateCreditForm";
import CreditList from "@/features/credits/CreditList";
import { useCreditStore } from "@/stores/useCreditStore";

export default function CreditsPage() {
  const credits = useCreditStore((s) => s.credits);
  const loading = useCreditStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Credits" count={loading && credits.length === 0 ? undefined : credits.length}>
        <CreateCreditForm />
      </PageHeader>
      <CreditList />
    </div>
  );
}
