// src/store/useUserStore.ts
import { create } from "zustand";
import {
  listenUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/app/services/userService";

type State = {
  users: User[];
  loading: boolean;
  error: string | null;
};

type Actions = {
  subscribe: () => () => void; // returns unsubscribe
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

export const useUserStore = create<State & Actions>((set) => ({
  users: [],
  loading: true,
  error: null,

  subscribe: () =>
    listenUsers(
      (users) => set({ users, loading: false, error: null }),
      (err) => set({ error: err.message, loading: false })
    ),

  createUser: (data) => createUser(data),
  updateUser: (uid, data) => updateUser(uid, data),
  deleteUser: (uid) => deleteUser(uid),
}));
