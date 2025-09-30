import { create } from "zustand";
import { clientDb } from "@/app/lib/firebaseConfig";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

type UserStore = {
  users: User[];
  loading: boolean;
  error: string | null;
  createUser: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  updateUser: (
    uid: string,
    data: Partial<User> & { password?: string }
  ) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => {
  // Firestore snapshot listener (caches + live updates)
  const usersRef = collection(clientDb, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));

  onSnapshot(
    q,
    (snapshot) => {
      const users: User[] = snapshot.docs.map((doc) => {
        const data = doc.data() as User;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          role: data.role,
          createdAt: data.createdAt ?? new Date(),
        };
      });
      set({ users, loading: false, error: null });
    },
    (err) => {
      console.error("Snapshot error:", err);
      set({ error: err.message, loading: false });
    }
  );

  return {
    users: [],
    loading: true,
    error: null,

    // ✅ Call API route → Firestore listener updates local store automatically
    createUser: async (data) => {
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    },

    updateUser: async (uid, data) => {
      const res = await fetch("/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...data }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    },

    deleteUser: async (uid) => {
      const res = await fetch("/api/deleteUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    },
  };
});
