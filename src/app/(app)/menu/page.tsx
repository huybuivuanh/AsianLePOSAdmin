"use client";

import { useState } from "react";
import CategoriesTab from "@/features/menu/categories/CategoriesTab";
import ItemsTab from "@/features/menu/items/ItemsTab";
import OptionGroupsTab from "@/features/menu/option-groups/OptionGroupsTab";
import OptionsTab from "@/features/menu/options/OptionsTab";

const TABS = [
  { id: "categories" as const, label: "Categories" },
  { id: "items" as const, label: "Items" },
  { id: "optionGroups" as const, label: "Option Groups" },
  { id: "options" as const, label: "Options" },
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState<
    "categories" | "items" | "optionGroups" | "options"
  >("categories");

  const renderTab = () => {
    switch (activeTab) {
      case "categories":
        return <CategoriesTab />;
      case "items":
        return <ItemsTab />;
      case "optionGroups":
        return <OptionGroupsTab />;
      case "options":
        return <OptionsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-col gap-0 md:min-h-[calc(100dvh-5.5rem)] md:flex-row">
      <aside className="shrink-0 border-b border-gray-200 bg-gray-100 md:w-64 md:border-r md:border-b-0">
        <nav
          className="flex flex-row gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:overflow-visible md:p-4 [&::-webkit-scrollbar]:hidden"
          aria-label="Menu sections"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 rounded-md px-3 py-2.5 text-left text-sm whitespace-nowrap transition hover:bg-gray-200 md:w-full md:px-3 md:py-2 md:text-base ${
                activeTab === tab.id ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        {renderTab()}
      </div>
    </div>
  );
}
