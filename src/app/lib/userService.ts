// src/app/lib/userService.ts
import { db } from "../lib/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const usersCol = collection(db, "users");

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, "id">),
  }));
}

export async function updateUser(id: string, data: Partial<User>) {
  await updateDoc(doc(usersCol, id), data);
}

export async function deleteUser(uid: string) {
  const res = await fetch("/api/deleteUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to delete user");
}

export async function submitUser(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const res = await fetch("/api/createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return await res.json(); // return UID etc
}
