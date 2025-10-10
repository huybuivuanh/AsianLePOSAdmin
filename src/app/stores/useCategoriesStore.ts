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
  updateCategory: (
    id: string,
    category: Partial<FoodCategory>
  ) => Promise<void>;
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
      set({
        categories: data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        loading: false,
      });
    });
    return unsub;
  },

  createCategory: async (name) => {
    const ref = collection(clientDb, "categories");
    await addDoc(ref, { name, createdAt: new Date(), order: Date.now() });
  },

  updateCategory: async (id, category) => {
    const ref = doc(clientDb, "categories", id);
    await updateDoc(ref, category);
  },

  deleteCategory: async (id) => {
    const ref = doc(clientDb, "categories", id);
    await deleteDoc(ref);
  },
}));
