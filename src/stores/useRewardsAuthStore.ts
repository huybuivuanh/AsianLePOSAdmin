"use client";

import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { rewardsAuth, rewardsConfigured } from "@/lib/rewards-firebase";

type RewardsAuthState = {
  configured: boolean;
  /** False until the first auth state arrives (remembered login is restored). */
  ready: boolean;
  user: FirebaseUser | null;
  /** True when the signed-in account has the `role: "pos"` claim. */
  isPosAccount: boolean;
  subscribe: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Browser-level login: it is NOT cleared on admin logout, so each browser only
// signs in once.
export const useRewardsAuthStore = create<RewardsAuthState>((set) => ({
  configured: rewardsConfigured,
  ready: !rewardsConfigured,
  user: null,
  isPosAccount: false,

  subscribe: () => {
    if (!rewardsAuth) return () => {};
    return onAuthStateChanged(rewardsAuth, async (user) => {
      let isPosAccount = false;
      if (user) {
        try {
          const token = await user.getIdTokenResult();
          isPosAccount = token.claims.role === "pos";
        } catch {
          // Offline: keep the login; functions re-check the role anyway.
        }
      }
      set({ ready: true, user, isPosAccount });
    });
  },

  signIn: async (email, password) => {
    if (!rewardsAuth) throw new Error("Rewards is not set up.");
    await signInWithEmailAndPassword(rewardsAuth, email.trim(), password);
  },

  signOut: async () => {
    if (rewardsAuth) await signOut(rewardsAuth);
  },
}));
