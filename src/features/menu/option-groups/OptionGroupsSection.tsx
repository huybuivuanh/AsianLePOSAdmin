"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import { PublishMenuToolbar } from "../publish/PublishMenuToolbar";
import { CreateOptionGroupForm } from "./CreateOptionGroupForm";
import { OptionGroupList } from "./OptionGroupList";

export function OptionGroupsSection() {
  const optionGroups = useOptionGroupStore((s) => s.optionGroups);
  const loading = useOptionGroupStore((s) => s.loading);

  return (
    <div className="min-w-0">
      <PublishMenuToolbar />
      <PageHeader
        title="Option Groups"
        count={loading && optionGroups.length === 0 ? undefined : optionGroups.length}
      >
        <CreateOptionGroupForm />
      </PageHeader>
      <OptionGroupList />
    </div>
  );
}
