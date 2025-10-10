"use client";

import { create } from "zustand";
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseConfig";

type MenuVersion = {
  version: number;
  lastUpdated: Date | null;
};

type MenuVersionState = {
  version: MenuVersion | null;
  loading: boolean;
  subscribe: () => () => void;
  publishMenu: () => Promise<void>;
};

export const useMenuVersionStore = create<MenuVersionState>((set) => ({
  version: null,
  loading: true,

  // 🕒 Realtime subscription to versionDoc
  subscribe: () => {
    const ref = doc(clientDb, "menuVersion", "versionDoc");

    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        set({
          version: {
            version: data.version ?? 0,
            lastUpdated: data.lastUpdated?.toDate
              ? data.lastUpdated.toDate()
              : data.lastUpdated ?? null,
          },
          loading: false,
        });
      } else {
        set({ version: null, loading: false });
      }
    });

    return unsub;
  },

  // 🚀 Publish menu (increment version + update date)
  publishMenu: async () => {
    const ref = doc(clientDb, "menuVersion", "versionDoc");

    await updateDoc(ref, {
      lastUpdated: new Date(),
      version: increment(1),
    });
  },
}));
