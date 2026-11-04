"use client";
import { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { useRewardsAuthStore } from "@/stores/useRewardsAuthStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const subRewardsAuth = useRewardsAuthStore((s) => s.subscribe);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Rewards sign-in state (card on the dashboard). Separate from the admin login.
  useEffect(() => {
    const unsub = subRewardsAuth();
    return unsub;
    // Zustand ref is stable; user/loading are the actual triggers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

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
