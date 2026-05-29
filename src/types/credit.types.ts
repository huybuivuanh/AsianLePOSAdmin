import type { Timestamp } from "firebase/firestore";

export interface Credit {
  id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
  amount: number;
  completed: boolean;
  createdAt: Timestamp;
}
