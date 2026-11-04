"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useOptionStore } from "@/stores/useOptionStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import CreateOptionForm from "./CreateOptionForm";
import OptionList from "./OptionList";

export default function OptionsTab() {
  const options = useOptionStore((s) => s.options);
  const loading = useOptionStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Options"
        count={loading && options.length === 0 ? undefined : options.length}
      >
        <CreateOptionForm />
      </PageHeader>
      <OptionList />
    </div>
  );
}
