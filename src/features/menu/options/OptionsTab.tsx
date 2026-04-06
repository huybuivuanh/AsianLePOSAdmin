"use client";

import CreateOptionForm from "./CreateOptionForm";
import OptionList from "./OptionList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function OptionsTab() {
  return (
    <div className="p-4 space-y-4">
      <PublishMenuToolbar>
        <CreateOptionForm />
      </PublishMenuToolbar>
      <OptionList />
    </div>
  );
}
