"use client";

import { create } from "zustand";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseConfig";
import { sortByAlphabet } from "../utils/utils";

type ItemState = {
  items: MenuItem[];
  loading: boolean;
  subscribe: () => () => void;
  createItem: (item: MenuItem) => Promise<void>;
  updateItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  loading: true,

  // Realtime subscription
  subscribe: () => {
    const ref = collection(clientDb, "menuItems");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt.toDate
            ? docData.createdAt.toDate()
            : docData.createdAt,
        } as MenuItem;
      });
      const sortedData = sortByAlphabet(data);
      set({ items: sortedData, loading: false });
    });
    return unsub;
  },

  createItem: async (item) => {
    const ref = collection(clientDb, "menuItems");
    await addDoc(ref, item);
  },

  updateItem: async (id, item) => {
    const ref = doc(clientDb, "menuItems", id);
    await updateDoc(ref, item);
  },

  deleteItem: async (id) => {
    const ref = doc(clientDb, "menuItems", id);
    await deleteDoc(ref);
  },
}));
