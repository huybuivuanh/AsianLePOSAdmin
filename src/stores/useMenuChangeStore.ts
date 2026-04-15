"use client";

import { create } from "zustand";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase-config";
import { asTimestamp } from "@/lib/firestore-timestamp";

type MenuChangeState = {
  menuChanges: MenuChange[];
  loading: boolean;
  error: string | null;
  subscribe: () => () => void;
  createMenuChange: (
    data: Omit<MenuChange, "id" | "createdAt">,
  ) => Promise<void>;
  updateMenuChange: (id: string, data: Partial<MenuChange>) => Promise<void>;
  deleteMenuChange: (id: string) => Promise<void>;
};

export const useMenuChangeStore = create<MenuChangeState>((set) => ({
  menuChanges: [],
  loading: true,
  error: null,

  subscribe: () => {
    const ref = collection(clientDb, "menuChanges");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const menuChanges: MenuChange[] = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            from: String(raw.from ?? ""),
            to: String(raw.to ?? ""),
            price: typeof raw.price === "number" ? raw.price : 0,
            createdAt:
              raw.createdAt === undefined
                ? undefined
                : (asTimestamp(raw.createdAt) as Timestamp),
          } as MenuChange;
        });
        set({ menuChanges, loading: false, error: null });
      },
      (err) => set({ error: err.message, loading: false }),
    );
    return unsub;
  },

  createMenuChange: async (data) => {
    const ref = collection(clientDb, "menuChanges");
    data.from = data.from.toUpperCase();
    data.to = data.to.toUpperCase();
    await addDoc(ref, { ...data, createdAt: Timestamp.now() });
  },

  updateMenuChange: async (id, data) => {
    const ref = doc(clientDb, "menuChanges", id);
    data.from = data.from?.toUpperCase();
    data.to = data.to?.toUpperCase();
    await updateDoc(ref, { ...data });
  },

  deleteMenuChange: async (id) => {
    const ref = doc(clientDb, "menuChanges", id);
    await deleteDoc(ref);
  },
}));
