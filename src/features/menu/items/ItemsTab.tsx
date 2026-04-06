"use client";

import CreateItemForm from "./CreateItemForm";
import ItemList from "./ItemList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function ItemsTab() {
  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">
      <PublishMenuToolbar>
        <CreateItemForm />
      </PublishMenuToolbar>
      <ItemList />
    </div>
  );
}
