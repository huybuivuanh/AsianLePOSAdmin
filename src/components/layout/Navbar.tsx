"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setMobileOpen(false);
    await signOut(auth);
    router.push("/");
  };

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/menu", label: "Menu" },
    { href: "/menu-changes", label: "Menu Changes" },
    { href: "/users", label: "Users" },
    { href: "/orders", label: "Orders" },
    { href: "/customers", label: "Customers" },
    { href: "/credits", label: "Credits" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <Link
          href="/dashboard"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-white sm:text-xl"
          onClick={() => setMobileOpen(false)}
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
            <LayoutDashboard className="size-5" aria-hidden />
          </span>
          <span className="truncate font-semibold tracking-tight">
            Admin Panel
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-white/15 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-400/50 bg-red-600 text-white hover:bg-red-700 hover:text-white"
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 px-3 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-white/15 text-white"
                      : "text-slate-200 hover:bg-white/10",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
