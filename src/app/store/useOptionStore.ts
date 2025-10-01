"use client";

import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseConfig";

interface OptionStore {
  options: ItemOption[];
  loading: boolean;
  createOption: (option: Omit<ItemOption, "id">) => Promise<void>;
  updateOption: (id: string, data: Partial<ItemOption>) => Promise<void>;
  deleteOption: (id: string) => Promise<void>;
  subscribe: () => () => void;
}

export const useOptionStore = create<OptionStore>((set) => ({
  options: [],
  loading: true,

  subscribe: () => {
    const q = query(
      collection(clientDb, "options"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const opts: ItemOption[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as ItemOption[];
      set({ options: opts, loading: false });
    });
    return unsub;
  },

  createOption: async (option) => {
    await addDoc(collection(clientDb, "options"), option);
  },

  updateOption: async (id, data) => {
    await updateDoc(doc(clientDb, "options", id), data);
  },

  deleteOption: async (id) => {
    await deleteDoc(doc(clientDb, "options", id));
  },
}));
