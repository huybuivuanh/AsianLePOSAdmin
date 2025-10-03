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

type OptionGroupState = {
  optionGroups: ItemOptionGroup[];
  loading: boolean;
  subscribe: () => () => void;
  createOptionGroup: (group: ItemOptionGroup) => Promise<void>;
  updateOptionGroup: (
    id: string,
    group: Partial<ItemOptionGroup>
  ) => Promise<void>;
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
        return {
          id: doc.id,
          ...docData,
          createdAt: docData.createdAt.toDate
            ? docData.createdAt.toDate()
            : docData.createdAt,
        } as ItemOptionGroup;
      });
      const sortedData = sortByAlphabet(data);
      console.log(sortedData);
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
