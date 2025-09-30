// store/useCategoriesStore.ts
import { create } from "zustand";
import {
  listenCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/services/categoriesService";

type State = {
  categories: FoodCategory[];
  loading: boolean;
  error: string | null;
};

type Actions = {
  subscribe: () => () => void; // return unsubscribe
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
};

export const useCategoriesStore = create<State & Actions>((set) => ({
  categories: [],
  loading: true,
  error: null,

  subscribe: () => {
    return listenCategories(
      (categories: FoodCategory[]) =>
        set({ categories, loading: false, error: null }),
      (err: Error) => set({ error: err.message, loading: false })
    );
  },

  createCategory: (name) => createCategory(name),
  updateCategory: (id, name) => updateCategory(id, name),
  deleteCategory: (id) => deleteCategory(id),
}));
