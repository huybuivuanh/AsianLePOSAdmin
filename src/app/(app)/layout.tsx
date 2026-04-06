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
    <StoreProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="min-h-0 w-full flex-1 px-3 py-4 sm:px-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>
    </StoreProvider>
  );
}
