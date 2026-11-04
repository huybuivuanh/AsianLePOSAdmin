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
import { clientDb } from "@/lib/firebase-config";
import { asTimestamp } from "@/lib/firestore-timestamp";

function capitalizeDescription(description: string): string {
  return description.trim().toUpperCase();
}

interface AddExtraStore {
  extras: ExtraCatalogItem[];
  loading: boolean;
  createExtra: (extra: Omit<ExtraCatalogItem, "id">) => Promise<void>;
  updateExtra: (
    id: string,
    data: Partial<Omit<ExtraCatalogItem, "id">>,
  ) => Promise<void>;
  deleteExtra: (id: string) => Promise<void>;
  subscribe: () => () => void;
}

export const useAddExtraStore = create<AddExtraStore>((set) => ({
  extras: [],
  loading: true,

  subscribe: () => {
    const q = query(
      collection(clientDb, "addExtras"),
      orderBy("createdAt", "desc"),
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const extras: ExtraCatalogItem[] = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          ...raw,
          createdAt: asTimestamp(raw.createdAt),
        } as ExtraCatalogItem;
      });
      const sortedData = extras
        .slice()
        .sort((a, b) =>
          a.description.toLowerCase().localeCompare(b.description.toLowerCase()),
        );
      set({ extras: sortedData, loading: false });
    });
    return unsub;
  },

  createExtra: async (extra) => {
    await addDoc(collection(clientDb, "addExtras"), {
      ...extra,
      description: capitalizeDescription(extra.description),
    });
  },

  updateExtra: async (id, data) => {
    await updateDoc(doc(clientDb, "addExtras", id), {
      ...data,
      ...(data.description !== undefined
        ? { description: capitalizeDescription(data.description) }
        : {}),
    });
  },

  deleteExtra: async (id) => {
    await deleteDoc(doc(clientDb, "addExtras", id));
  },
}));
