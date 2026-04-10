"use client";

import { create } from "zustand";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase-config";
import { asTimestamp } from "@/lib/firestore-timestamp";
import { sortByAlphabet } from "@/lib/sort";

type CustomerState = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  subscribe: () => () => void;
  deleteCustomer: (id: string) => Promise<void>;
};

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: true,
  error: null,

  subscribe: () => {
    const ref = collection(clientDb, "customers");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const customers: Customer[] = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            id: d.id,
            name: String(raw.name ?? ""),
            phone: String(raw.phone ?? ""),
            createdAt: asTimestamp(raw.createdAt),
          };
        });
        const sortedCustomers = sortByAlphabet(customers);
        set({ customers: sortedCustomers, loading: false, error: null });
      },
      (err) => {
        set({ error: err.message, loading: false });
      },
    );
    return unsub;
  },

  deleteCustomer: async (id) => {
    const ref = doc(clientDb, "customers", id);
    await deleteDoc(ref);
  },
}));
