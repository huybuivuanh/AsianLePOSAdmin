"use client";

import CreateItemForm from "./CreateItemForm";
import ItemList from "./ItemList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function ItemsTab() {
  return (
    <div className="space-y-6 p-3 sm:p-4 md:p-6">
      <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <PublishMenuToolbar>
          <CreateItemForm />
        </PublishMenuToolbar>
      </div>
      <ItemList />
    </div>
  );
}
