"use client";

import CreateOptionGroupForm from "./CreateOptionGroupForm";
import OptionGroupList from "./OptionGroupList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function OptionGroupsTab() {
  return (
    <div className="p-4 space-y-4">
      <PublishMenuToolbar>
        <CreateOptionGroupForm />
      </PublishMenuToolbar>
      <OptionGroupList />
    </div>
  );
}
