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
import { clientDb } from "@/lib/firebase-config";
import { TableStatus } from "@/types/enum";

function parseTableStatus(value: unknown): TableStatus {
  if (value === TableStatus.Occupied) return TableStatus.Occupied;
  return TableStatus.Open;
}

type TableState = {
  tables: Table[];
  loading: boolean;
  subscribe: () => () => void;
  createTable: (table: Omit<Table, "id">) => Promise<void>;
  updateTable: (id: string, table: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
};

function sortTablesByNumber(a: Table, b: Table): number {
  return a.tableNumber.localeCompare(b.tableNumber, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export const useTableStore = create<TableState>((set) => ({
  tables: [],
  loading: true,

  subscribe: () => {
    const ref = collection(clientDb, "tables");
    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const raw = d.data();
        return {
          id: d.id,
          tableNumber: String(raw.tableNumber ?? ""),
          status: parseTableStatus(raw.status),
          guests: typeof raw.guests === "number" ? raw.guests : 0,
          currentOrderId:
            raw.currentOrderId === undefined || raw.currentOrderId === null
              ? null
              : String(raw.currentOrderId),
        } as Table;
      });
      data.sort(sortTablesByNumber);
      set({ tables: data, loading: false });
    });
    return unsub;
  },

  createTable: async (table) => {
    const ref = collection(clientDb, "tables");
    await addDoc(ref, {
      tableNumber: table.tableNumber,
      status: table.status,
      guests: table.guests,
      currentOrderId: table.currentOrderId,
    });
  },

  updateTable: async (id, table) => {
    const ref = doc(clientDb, "tables", id);
    await updateDoc(ref, table);
  },

  deleteTable: async (id) => {
    const ref = doc(clientDb, "tables", id);
    await deleteDoc(ref);
  },
}));
