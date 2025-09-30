// src/services/userService.ts
import { clientDb } from "@/app/lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";

export function listenUsers(
  onUpdate: (users: User[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const usersRef = collection(clientDb, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const users: User[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      onUpdate(users);
    },
    (err) => onError(err)
  );
}

// ✅ Call API to create user
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch("/api/users/createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

// ✅ Update user
export async function updateUser(
  uid: string,
  data: Partial<User> & { password?: string }
) {
  const res = await fetch("/api/users/updateUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, ...data }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

// ✅ Delete user
export async function deleteUser(uid: string) {
  const res = await fetch("/api/users/deleteUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}
