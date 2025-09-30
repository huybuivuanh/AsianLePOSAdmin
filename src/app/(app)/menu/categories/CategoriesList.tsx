"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";

export default function CategoriesList() {
  const { categories, loading, subscribe } = useCategoriesStore();

  useEffect(() => {
    const unsub = subscribe();
    return () => unsub();
  }, [subscribe]);

  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {categories.map((cat) => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
