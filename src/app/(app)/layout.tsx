"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // Auth still resolving for a returning user — render nothing rather than
  // flashing "Redirecting…" before onAuthStateChanged fires.
  if (!user) {
    if (loading) return null;
    return (
      <div className="flex min-h-dvh items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="min-h-0 w-full flex-1 px-3 py-4 sm:px-4 md:px-6 md:py-6">
        {children}
      </main>
    </div>
  );
}
