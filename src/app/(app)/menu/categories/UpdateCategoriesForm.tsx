"use client";

import { useState } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function UpdateCategoriesForm({
  category,
}: {
  category: FoodCategory;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const { updateCategory } = useCategoriesStore();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCategory(category.id!, { name: name.trim() });
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>Update the category name below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-blue-500 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
