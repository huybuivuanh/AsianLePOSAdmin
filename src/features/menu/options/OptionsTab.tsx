"use client";

import CreateOptionForm from "./CreateOptionForm";
import OptionList from "./OptionList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function OptionsTab() {
  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">
      <PublishMenuToolbar>
        <CreateOptionForm />
      </PublishMenuToolbar>
      <OptionList />
    </div>
  );
}
