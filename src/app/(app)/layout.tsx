"use client";
import { useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // redirect to login if not authenticated
    }
  }, [user, router]);

  if (!user) return <div>Redirecting...</div>; // loading state

  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
