"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import CreateAddExtraForm from "@/features/add-extras/CreateAddExtraForm";
import AddExtraList from "@/features/add-extras/AddExtraList";

export default function AddExtrasPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Add Extras"
        description="Catalog of extras that can be added to order items."
      >
        <CreateAddExtraForm />
      </PageHeader>

      <AddExtraList />
    </div>
  );
}
