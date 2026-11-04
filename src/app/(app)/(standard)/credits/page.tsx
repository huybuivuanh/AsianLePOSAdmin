"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreditForm } from "@/features/credits/CreditForm";
import { CreditList } from "@/features/credits/CreditList";
import { useCreditStore } from "@/stores/useCreditStore";

export default function CreditsPage() {
  const credits = useCreditStore((s) => s.credits);
  const loading = useCreditStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Credits" count={loading && credits.length === 0 ? undefined : credits.length}>
        <CreditForm />
      </PageHeader>
      <CreditList />
    </div>
  );
}
