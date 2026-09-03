"use client";

import { useState } from "react";
import { StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CustomerNoteButton({
  name,
  note,
}: {
  name: string;
  note?: string;
}) {
  const [open, setOpen] = useState(false);

  const trimmed = note?.trim();
  if (!trimmed) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-foreground"
          aria-label={`View note for ${name}`}
          title="View note"
        >
          <StickyNote className="size-4" aria-hidden />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Note — {name}</DialogTitle>
        </DialogHeader>
        <p className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm text-foreground">
          {trimmed}
        </p>
      </DialogContent>
    </Dialog>
  );
}
