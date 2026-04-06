"use client";

import { useAuth } from "@/providers/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
      <p>Welcome, {user ? user.email : "Guest"}</p>
    </div>
  );
}
