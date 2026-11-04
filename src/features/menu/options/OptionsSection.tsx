"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useOptionStore } from "@/stores/useOptionStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import { OptionForm } from "./OptionForm";
import { OptionList } from "./OptionList";

export function OptionsSection() {
  const options = useOptionStore((s) => s.options);
  const loading = useOptionStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Options"
        count={loading && options.length === 0 ? undefined : options.length}
      >
        <OptionForm />
      </PageHeader>
      <OptionList />
    </div>
  );
}
