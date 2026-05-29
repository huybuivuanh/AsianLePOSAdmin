import type { Timestamp } from "firebase/firestore";

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  createdAt: Timestamp;
}
