import { db } from "../lib/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const usersCol = collection(db, "users");

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<User, "id">),
  }));
}

export async function addUser(user: User) {
  await addDoc(usersCol, user);
}

export async function updateUser(id: string, data: Partial<User>) {
  await updateDoc(doc(usersCol, id), data);
}

export async function deleteUser(id: string) {
  await deleteDoc(doc(usersCol, id));
}
