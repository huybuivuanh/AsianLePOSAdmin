"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRewardsAuthStore } from "@/stores/useRewardsAuthStore";

function signInErrorMessage(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
      case "auth/invalid-email":
        return "Wrong email or password.";
      case "auth/too-many-requests":
        return "Too many attempts. Try again in a few minutes.";
      case "auth/network-request-failed":
        return "No connection. Check the internet and try again.";
    }
  }
  return "Could not sign in. Try again.";
}

/** Dashboard section: sign this browser into the Rewards project once. */
export function RewardsSignInCard() {
  const configured = useRewardsAuthStore((s) => s.configured);
  const ready = useRewardsAuthStore((s) => s.ready);
  const user = useRewardsAuthStore((s) => s.user);
  const isPosAccount = useRewardsAuthStore((s) => s.isPosAccount);
  const signIn = useRewardsAuthStore((s) => s.signIn);
  const signOut = useRewardsAuthStore((s) => s.signOut);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !busy && email.trim() !== "" && password !== "";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      setPassword("");
    } catch (err) {
      setError(signInErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-border/80 bg-card px-4 py-4 shadow-sm">
      <p className="text-base font-semibold text-foreground">Rewards</p>

      {!configured ? (
        <p className="mt-0.5 text-sm text-muted-foreground">
          Rewards isn&apos;t set up (missing NEXT_PUBLIC_REWARDS_FIREBASE_*
          values).
        </p>
      ) : !ready ? (
        <div className="mt-3 size-5 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary" />
      ) : user ? (
        <div className="mt-2 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              This browser is signed in to Rewards. Cancelled orders will have
              their points reversed.
            </p>
            <p className="truncate text-sm font-semibold text-foreground">
              {user.email}
            </p>
            {!isPosAccount ? (
              <p className="mt-0.5 text-xs text-amber-700">
                This account doesn&apos;t have POS access yet (role: pos).
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSignIn} className="mt-2">
          <p className="text-sm text-muted-foreground">
            Sign this browser in once so cancelling an order reverses its
            rewards points.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              placeholder="Email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={!canSubmit}>
              {busy ? "Signing in…" : "Sign in to Rewards"}
            </Button>
          </div>
          {error ? (
            <p className="mt-2 text-sm text-destructive">{error}</p>
          ) : null}
        </form>
      )}
    </div>
  );
}
