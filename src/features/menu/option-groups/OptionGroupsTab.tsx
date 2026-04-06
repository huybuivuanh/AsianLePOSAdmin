"use client";

import CreateOptionGroupForm from "./CreateOptionGroupForm";
import OptionGroupList from "./OptionGroupList";

export default function OptionGroupsTab() {
  return (
    <div className="p-4 space-y-4">
      <CreateOptionGroupForm></CreateOptionGroupForm>
      <OptionGroupList></OptionGroupList>
    </div>
  );
}
