"use client";
import { useEffect } from "react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { StoreProvider } from "../providers/StoreProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // redirect to login if not authenticated
    }
  }, [user, router]);

  if (!user) return <div>Redirecting...</div>; // loading state

  return (
    <>
      <StoreProvider>
        <Navbar />
        <main>{children}</main>
      </StoreProvider>
    </>
  );
}
