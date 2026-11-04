"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { CreateAddExtraForm } from "@/features/add-extras/CreateAddExtraForm";
import { AddExtraList } from "@/features/add-extras/AddExtraList";
import { useAddExtraStore } from "@/stores/useAddExtraStore";

export default function AddExtrasPage() {
  const extras = useAddExtraStore((s) => s.extras);
  const loading = useAddExtraStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PageHeader title="Add Extras" count={loading && extras.length === 0 ? undefined : extras.length}>
        <CreateAddExtraForm />
      </PageHeader>
      <AddExtraList />
    </div>
  );
}
