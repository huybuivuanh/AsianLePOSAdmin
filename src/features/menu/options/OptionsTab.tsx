"use client";

import CreateOptionForm from "./CreateOptionForm";
import OptionList from "./OptionList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function OptionsTab() {
  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6">
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <PublishMenuToolbar>
          <CreateOptionForm />
        </PublishMenuToolbar>
      </div>
      <OptionList />
    </div>
  );
}
