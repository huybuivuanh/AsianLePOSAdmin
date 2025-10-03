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
import { Button } from "@/components/ui/button";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect } from "react";

function SortableItem({ id, name }: { id: string; name: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-2 rounded bg-gray-100 cursor-move"
    >
      {name}
    </li>
  );
}

export default function SortCategories() {
  const [open, setOpen] = useState(false);
  const { categories, updateCategory } = useCategoriesStore();
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    if (categories.length > 0) {
      // sort by order field if exists, fallback to name
      const sortedCategories = [...categories].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      setOrderedIds(sortedCategories.map((c) => c.id!));
    }
  }, [categories]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedIds.indexOf(String(active.id));
      const newIndex = orderedIds.indexOf(String(over.id));
      const newOrder = [...orderedIds];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, String(active.id));
      setOrderedIds(newOrder);
    }
  };

  const handleSave = async () => {
    try {
      await Promise.all(
        orderedIds.map((id, index) => updateCategory(id, { order: index }))
      );
      setOpen(false);
    } catch (err) {
      console.error("Failed to save category order:", err);
      alert("Failed to save");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sort Categories</Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] !max-w-[90vw] h-[80vh] max-h-[90vh] mx-auto items-start">
        <DialogHeader>
          <DialogTitle>Sort Categories</DialogTitle>
          <DialogDescription>
            Drag and drop categories to reorder them.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable container */}
        <div className="w-full overflow-y-auto h-[calc(80vh-220px)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedIds}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-2">
                {orderedIds.map((id) => {
                  const cat = categories.find((c) => c.id === id);
                  if (!cat) return null;
                  return <SortableItem key={id} id={id} name={cat.name} />;
                })}
              </ul>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter>
          <Button onClick={handleSave} className="bg-blue-500 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
