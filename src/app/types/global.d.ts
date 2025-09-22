export {};

import { serverTimestamp } from "firebase/firestore";

declare global {
  type User = {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt: serverTimestamp;
  };
}
