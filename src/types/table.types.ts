import type { TableStatus } from "./enum";

export interface Table {
  id?: string;
  tableNumber: string;
  status: TableStatus;
  guests: number;
  currentOrderId: string | null;
}
