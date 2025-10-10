"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
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
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Admin Panel
        </Link>

        {/* Links */}
        <div className="hidden space-x-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-blue-400 transition ${
                pathname === link.href ? "text-blue-400 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
