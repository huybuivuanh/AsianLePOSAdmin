"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateCreditForm, CreditList } from "@/features/credits";

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Credits"
        description="Manage customer credits synced from Firestore in real time."
      >
        <CreateCreditForm />
      </PageHeader>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <CreditList />
      </div>
    </div>
  );
}
