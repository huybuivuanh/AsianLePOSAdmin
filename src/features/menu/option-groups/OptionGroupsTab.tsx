"use client";

import CreateOptionGroupForm from "./CreateOptionGroupForm";
import OptionGroupList from "./OptionGroupList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function OptionGroupsTab() {
  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">
      <PublishMenuToolbar>
        <CreateOptionGroupForm />
      </PublishMenuToolbar>
      <OptionGroupList />
    </div>
  );
}
