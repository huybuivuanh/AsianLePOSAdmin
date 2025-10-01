"use client";

import { create } from "zustand";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { clientDb } from "@/app/lib/firebaseConfig";

type CategoriesState = {
  categories: FoodCategory[];
  loading: boolean;
  subscribe: () => () => void;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: true,

  // Realtime subscription
  subscribe: () => {
    const ref = collection(clientDb, "categories");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FoodCategory[];
      set({ categories: data, loading: false });
    });
    return unsub;
  },

  createCategory: async (name) => {
    const ref = collection(clientDb, "categories");
    await addDoc(ref, { name, createdAt: new Date() });
  },

  updateCategory: async (id, name) => {
    const ref = doc(clientDb, "categories", id);
    await updateDoc(ref, { name });
  },

  deleteCategory: async (id) => {
    const ref = doc(clientDb, "categories", id);
    await deleteDoc(ref);
  },
}));
