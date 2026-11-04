"use client";

import { useId, useState } from "react";
import { useCategoriesStore } from "@/stores/useCategoriesStore";
import { alertDialog } from "@/stores/useModalStore";
import { EntityFormDialog } from "@/components/layout/EntityFormDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Add a category, or rename `category` when given. */
export function CategoryForm({ category }: { category?: FoodCategory }) {
  const isEdit = category != null;
  const id = useId();
  const { createCategory, updateCategory } = useCategoriesStore();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  const handleOpenChange = (next: boolean) => {
    if (next) setName(category?.name ?? "");
    setOpen(next);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit) await updateCategory(category.id!, { name: name.trim() });
      else await createCategory(name.trim());
      setOpen(false);
    } catch (err) {
      console.error(err);
      await alertDialog(`Couldn't ${isEdit ? "update" : "add"} category. Try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <EntityFormDialog
      isEdit={isEdit}
      addLabel="+ Add category"
      title={isEdit ? "Edit category" : "Add category"}
      open={open}
      onOpenChange={handleOpenChange}
      saving={saving}
      canSubmit={name.trim().length > 0}
      onSubmit={handleSubmit}
      contentClassName="sm:max-w-lg"
    >
      <div className="space-y-2">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input
          id={`${id}-name`}
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </EntityFormDialog>
  );
}
