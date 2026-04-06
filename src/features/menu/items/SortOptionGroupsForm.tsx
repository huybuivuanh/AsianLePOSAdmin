"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useItemStore } from "@/stores/useItemStore";
import { useOptionGroupStore } from "@/stores/useOptionGroupStore";
import {
  getOrderedOptionGroupRefs,
  reindexOptionGroupOrders,
} from "@/lib/menu-item-option-groups";

function SortableRow({ id, name }: { id: string; name: string }) {
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

export default function SortOptionGroupsForm({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const { updateItem } = useItemStore();
  const { optionGroups } = useOptionGroupStore();

  const refs = getOrderedOptionGroupRefs(item);
  const canSort = refs.length >= 2;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = orderedIds.indexOf(String(active.id));
      const newIndex = orderedIds.indexOf(String(over.id));
      const next = [...orderedIds];
      next.splice(oldIndex, 1);
      next.splice(newIndex, 0, String(active.id));
      setOrderedIds(next);
    }
  };

  const handleSave = async () => {
    try {
      const optionGroupIds = reindexOptionGroupOrders(
        orderedIds.map((optionGroupId) => ({ optionGroupId, order: 0 })),
      );
      await updateItem(item.id!, { optionGroupIds });
      setOpen(false);
    } catch (err) {
      console.error("Failed to save option group order:", err);
      alert("Failed to save");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setOrderedIds(
            getOrderedOptionGroupRefs(item).map((r) => r.optionGroupId),
          );
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={!canSort}>
          Sort Option Groups
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] !max-w-[90vw] h-[80vh] max-h-[90vh] mx-auto items-start">
        <DialogHeader>
          <DialogTitle>Sort option groups — {item.name}</DialogTitle>
          <DialogDescription>
            Drag to set the order shown on the POS and in order line details.
            New selections follow this order, not the tap order.
          </DialogDescription>
        </DialogHeader>

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
                  const group = optionGroups.find((g) => g.id === id);
                  if (!group) return null;
                  return (
                    <SortableRow key={id} id={id} name={group.name} />
                  );
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
