"use client";

import { useAuth } from "@/app/providers/AuthProvider";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="text-black p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {user ? user.email : "Guest"}</p>
    </div>
  );
}
