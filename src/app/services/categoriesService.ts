// src/services/categoryService.ts
import { clientDb } from "@/app/lib/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";

// 🔹 Listen to all categories in Firestore
export function listenCategories(
  onUpdate: (categories: FoodCategory[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const categoriesRef = collection(clientDb, "categories");
  const q = query(categoriesRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const cats: FoodCategory[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          name: data.name,
          createdAt: data.createdAt?.toDate() ?? new Date(),
        };
      });
      onUpdate(cats);
    },
    (err) => {
      onError(err);
    }
  );
}

// 🔹 Create new category (via API for security)
export async function createCategory(name: string) {
  const res = await fetch("/api/categories/createCategory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

// 🔹 Update category
export async function updateCategory(id: string, name: string) {
  const res = await fetch("/api/categories/updateCategory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

// 🔹 Delete category
export async function deleteCategory(id: string) {
  const res = await fetch("/api/categories/deleteCategory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}
