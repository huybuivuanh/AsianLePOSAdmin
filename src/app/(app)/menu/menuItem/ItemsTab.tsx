"use client";

import CreateItemForm from "./CreateItemForm";
import ItemList from "./ItemList";

export default function ItemsTab() {
  return (
    <div className="p-4 space-y-4">
      <CreateItemForm />
      <ItemList />
    </div>
  );
}
