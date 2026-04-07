import {
  Timestamp,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase-config";
import { asTimestamp } from "@/lib/firestore-timestamp";
import { OrderType } from "@/types/enum";

export const TAKE_OUT_ORDERS_COLLECTION = "takeOutOrders";
export const DINE_IN_ORDERS_COLLECTION = "dineInOrders";

export type OrderHistoryLoadedOrder =
  | (TakeOutOrder & { id: string })
  | (DineInOrder & { id: string });

export function dateToLocalKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Local calendar day [start, end] as Firestore timestamps (browser local timezone). */
export function localDayBoundsFromDateKey(
  dateKey: string,
): { start: Timestamp; end: Timestamp } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const y = Number(match[1]);
  const mo = Number(match[2]);
  const d = Number(match[3]);
  const start = new Date(y, mo - 1, d, 0, 0, 0, 0);
  const end = new Date(y, mo - 1, d, 23, 59, 59, 999);
  if (
    start.getFullYear() !== y ||
    start.getMonth() !== mo - 1 ||
    start.getDate() !== d
  ) {
    return null;
  }
  return {
    start: Timestamp.fromDate(start),
    end: Timestamp.fromDate(end),
  };
}

function normalizeFulfillment(
  raw: DocumentData["fulfillment"],
): TakeOutFulfillment {
  if (raw == null || typeof raw !== "object") {
    return { kind: "immediate" };
  }
  const k = (raw as { kind?: string }).kind;
  if (k === "scheduled") {
    const scheduledAt = (raw as { scheduledAt?: unknown }).scheduledAt;
    return {
      kind: "scheduled",
      scheduledAt: asTimestamp(scheduledAt),
    };
  }
  return {
    kind: "immediate",
    readyTimeMinutes: (raw as { readyTimeMinutes?: number }).readyTimeMinutes,
  };
}

function normalizeTakeOutOrderDoc(
  id: string,
  data: DocumentData,
): TakeOutOrder & { id: string } {
  return {
    ...(data as TakeOutOrder),
    id,
    createdAt: asTimestamp(data.createdAt),
    fulfillment: normalizeFulfillment(data.fulfillment),
  };
}

function normalizeDineInOrderDoc(
  id: string,
  data: DocumentData,
): DineInOrder & { id: string } {
  return {
    ...(data as DineInOrder),
    id,
    createdAt: asTimestamp(data.createdAt),
  };
}

export type OrderHistoryChannel = "takeOut" | "dineIn";

export async function fetchOrdersForHistory(
  channel: OrderHistoryChannel,
  dateKey: string,
): Promise<OrderHistoryLoadedOrder[]> {
  const colName =
    channel === "takeOut"
      ? TAKE_OUT_ORDERS_COLLECTION
      : DINE_IN_ORDERS_COLLECTION;
  const ref = collection(clientDb, colName);
  const bounds = localDayBoundsFromDateKey(dateKey);
  if (bounds == null) {
    return [];
  }
  const q = query(
    ref,
    where("createdAt", ">=", bounds.start),
    where("createdAt", "<=", bounds.end),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);

  if (channel === "takeOut") {
    return snap.docs.map((d) => normalizeTakeOutOrderDoc(d.id, d.data()));
  }
  return snap.docs.map((d) => normalizeDineInOrderDoc(d.id, d.data()));
}

export function isTakeOutLoadedOrder(
  o: OrderHistoryLoadedOrder,
): o is TakeOutOrder & { id: string } {
  return o.orderType === OrderType.TakeOut;
}

type OrderDraft = Partial<Order> & {
  customerName?: string;
  phoneNumber?: string;
  fulfillment?: TakeOutFulfillment;
  tableNumber?: string;
  guests?: number;
};

export const submitToPrintQueue = async (order: OrderDraft) => {
  if (!order.id) throw new Error("Order ID is required to print.");
  const printQueueRef = doc(collection(clientDb, "printQueue"));
  const forPrint: OrderDraft = {
    ...order,
    orderItems: order.orderItems ?? [],
  };
  await setDoc(printQueueRef, forPrint as Record<string, unknown>);
};
