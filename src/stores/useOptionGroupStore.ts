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
import { clientDb } from "@/lib/firebase-config";
import { sortByAlphabet } from "@/lib/sort";
import { asTimestamp } from "@/lib/firestore-timestamp";

type OptionGroupState = {
  optionGroups: OptionGroup[];
  loading: boolean;
  subscribe: () => () => void;
  createOptionGroup: (group: OptionGroup) => Promise<void>;
  updateOptionGroup: (id: string, group: Partial<OptionGroup>) => Promise<void>;
  deleteOptionGroup: (id: string) => Promise<void>;
};

export const useOptionGroupStore = create<OptionGroupState>((set) => ({
  optionGroups: [],
  loading: true,

  subscribe: () => {
    const ref = collection(clientDb, "optionGroups");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const multipleOptionQuantity =
          typeof docData.multipleOptionQuantity === "boolean"
            ? docData.multipleOptionQuantity
            : docData.multipleSelection === true;
        return {
          id: doc.id,
          ...docData,
          multipleOptionQuantity,
          createdAt: asTimestamp(docData.createdAt),
        } as OptionGroup;
      });
      const sortedData = sortByAlphabet(data);
      set({ optionGroups: sortedData, loading: false });
    });
    return unsub;
  },

  createOptionGroup: async (group) => {
    const ref = collection(clientDb, "optionGroups");
    await addDoc(ref, group);
  },

  updateOptionGroup: async (id, group) => {
    const ref = doc(clientDb, "optionGroups", id);
    await updateDoc(ref, group);
  },

  deleteOptionGroup: async (id) => {
    const ref = doc(clientDb, "optionGroups", id);
    await deleteDoc(ref);
  },
}));
