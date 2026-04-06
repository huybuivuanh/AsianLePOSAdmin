"use client";

import { useState } from "react";
import CategoriesTab from "@/features/menu/categories/CategoriesTab";
import ItemsTab from "@/features/menu/items/ItemsTab";
import OptionGroupsTab from "@/features/menu/option-groups/OptionGroupsTab";
import OptionsTab from "@/features/menu/options/OptionsTab";

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
    <div className="flex h-full">
      <div className="w-64 bg-gray-100 p-4 border-r">
        <ul className="space-y-2">
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                activeTab === "categories" ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                activeTab === "items" ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setActiveTab("items")}
            >
              Items
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                activeTab === "optionGroups" ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setActiveTab("optionGroups")}
            >
              Option Groups
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left p-2 rounded hover:bg-gray-200 ${
                activeTab === "options" ? "bg-gray-200 font-bold" : ""
              }`}
              onClick={() => setActiveTab("options")}
            >
              Options
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">{renderTab()}</div>
    </div>
  );
}
