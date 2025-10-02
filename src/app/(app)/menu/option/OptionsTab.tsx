"use client";

import CreateOptionForm from "./CreateOptionForm";
import OptionList from "./OptionList";

export default function OptionsTab() {
  return (
    <div className="p-4 space-y-4">
      <CreateOptionForm />
      <OptionList />
    </div>
  );
}
