"use client";

import { FolderOpen, LayoutList, ListTree, SlidersHorizontal } from "lucide-react";
import {
  SectionSidebar,
  type SectionSidebarLink,
} from "@/components/layout/SectionSidebar";

const menuNavLinks: readonly SectionSidebarLink[] = [
  { href: "/menu/categories", label: "Categories", icon: <ListTree /> },
  { href: "/menu/items", label: "Items", icon: <LayoutList /> },
  { href: "/menu/option-groups", label: "Option Groups", icon: <FolderOpen /> },
  { href: "/menu/options", label: "Options", icon: <SlidersHorizontal /> },
];

export function MenuSidebar() {
  return (
    <SectionSidebar
      title="Menu"
      links={menuNavLinks}
      ariaLabel="Menu section navigation"
    />
  );
}
