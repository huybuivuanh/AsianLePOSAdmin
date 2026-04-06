"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { StoreProvider } from "@/providers/StoreProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return <div>Redirecting...</div>;

  return (
    <>
      <StoreProvider>
        <Navbar />
        <main>{children}</main>
      </StoreProvider>
    </>
  );
}
