"use client";

import { useState } from "react";
import CategoriesTab from "@/features/menu/categories/CategoriesTab";
import ItemsTab from "@/features/menu/items/ItemsTab";
import OptionGroupsTab from "@/features/menu/option-groups/OptionGroupsTab";
import OptionsTab from "@/features/menu/options/OptionsTab";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

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
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 border-b border-border/80 bg-card/80 px-3 py-5 backdrop-blur-sm sm:px-4 md:px-6">
        <PageHeader
          title="Menu"
          description="Edit what appears on the POS — publish when you are ready to go live."
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:min-h-[calc(100dvh-12rem)] md:flex-row">
        <aside className="shrink-0 border-b border-border bg-muted/40 md:w-56 md:border-r md:border-b-0 lg:w-64">
          <nav
            className="flex flex-row gap-1 overflow-x-auto p-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-col md:gap-1.5 md:overflow-visible md:p-3 [&::-webkit-scrollbar]:hidden"
            aria-label="Menu sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-all md:w-full md:py-2 md:text-sm",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}
