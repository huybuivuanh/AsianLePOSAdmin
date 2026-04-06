"use client";

import CreateItemForm from "./CreateItemForm";
import ItemList from "./ItemList";
import { PublishMenuToolbar } from "../PublishMenuToolbar";

export default function ItemsTab() {
  return (
    <div className="p-4 space-y-4">
      <PublishMenuToolbar>
        <CreateItemForm />
      </PublishMenuToolbar>
      <ItemList />
    </div>
  );
}
