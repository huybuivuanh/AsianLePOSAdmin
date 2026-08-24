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
import { sortByAlphabet } from "@/lib/list-utils";
import type { Customer } from "@/types";

type CustomerState = {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  subscribe: () => () => void;
  createCustomer: (
    data: Omit<Customer, "id" | "createdAt" | "isBlocked">,
  ) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
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
            isBlocked: Boolean(raw.isBlocked),
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

  createCustomer: async (data) => {
    const ref = collection(clientDb, "customers");
    await addDoc(ref, {
      ...data,
      createdAt: Timestamp.now(),
      isBlocked: false,
    });
  },

  deleteCustomer: async (id) => {
    const ref = doc(clientDb, "customers", id);
    await deleteDoc(ref);
  },

  updateCustomer: async (id, data) => {
    const ref = doc(clientDb, "customers", id);
    await updateDoc(ref, { ...data });
  },
}));
