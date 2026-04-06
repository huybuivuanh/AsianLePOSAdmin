"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { Menu, X } from "lucide-react";

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
    { href: "/users", label: "Users" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-gray-800 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <Link
          href="/dashboard"
          className="shrink-0 text-lg font-bold text-white sm:text-xl"
          onClick={() => setMobileOpen(false)}
        >
          Admin Panel
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-blue-400 ${
                pathname === link.href ? "font-semibold text-blue-400" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded p-2 hover:bg-gray-700 md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded bg-red-600 px-3 py-2 text-xs font-semibold transition hover:bg-red-700 sm:px-4 sm:text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-700 px-3 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-md px-3 py-2.5 text-sm transition hover:bg-gray-700 ${
                    pathname === link.href ? "bg-gray-700 font-semibold" : ""
                  }`}
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
