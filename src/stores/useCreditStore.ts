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

type CreditState = {
  credits: Credit[];
  loading: boolean;
  error: string | null;
  subscribe: () => () => void;
  createCredit: (
    data: Omit<Credit, "id" | "createdAt" | "completed">,
  ) => Promise<void>;
  updateCredit: (id: string, data: Partial<Credit>) => Promise<void>;
  deleteCredit: (id: string) => Promise<void>;
};

export const useCreditStore = create<CreditState>((set) => ({
  credits: [],
  loading: true,
  error: null,

  subscribe: () => {
    const ref = collection(clientDb, "credits");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const credits: Credit[] = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            name: raw.name === undefined ? undefined : String(raw.name),
            phoneNumber:
              raw.phoneNumber === undefined
                ? undefined
                : String(raw.phoneNumber),
            description:
              raw.description === undefined
                ? undefined
                : String(raw.description),
            amount: typeof raw.amount === "number" ? raw.amount : 0,
            completed: Boolean(raw.completed),
            createdAt:
              raw.createdAt === undefined
                ? Timestamp.now()
                : (asTimestamp(raw.createdAt) as Timestamp),
          } as Credit;
        });
        set({ credits, loading: false, error: null });
      },
      (err) => set({ error: err.message, loading: false }),
    );
    return unsub;
  },

  createCredit: async (data) => {
    const ref = collection(clientDb, "credits");
    if (data.name) {
      data.name = data.name.toUpperCase();
    }
    await addDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
      completed: false,
    });
  },

  updateCredit: async (id, data) => {
    const ref = doc(clientDb, "credits", id);
    if (data.name) {
      data.name = data.name.toUpperCase();
    }
    await updateDoc(ref, { ...data });
  },

  deleteCredit: async (id) => {
    const ref = doc(clientDb, "credits", id);
    await deleteDoc(ref);
  },
}));
