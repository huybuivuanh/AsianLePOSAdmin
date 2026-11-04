"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

/** Renders the confirm/alert popups opened with confirmDialog / alertDialog. */
export function AppModal() {
  const { open, kind, title, message, confirmLabel, cancelLabel, danger, resolveModal } =
    useModalStore();

  return (
    <Dialog
      open={open}
      // Escape / clicking outside: "cancel" for a confirm, "OK" for an alert.
      onOpenChange={(next) => {
        if (!next) resolveModal(kind !== "confirm");
      }}
    >
      <DialogContent showCloseButton={false} className="max-w-sm gap-0 sm:max-w-sm">
        <DialogTitle className={cn("mb-2", !title && "sr-only")}>
          {title || (kind === "confirm" ? "Confirm" : "Notice")}
        </DialogTitle>
        <DialogDescription className="mb-6 text-sm whitespace-pre-line text-foreground/80">
          {message}
        </DialogDescription>
        <div className="flex justify-end gap-2">
          {kind === "confirm" && (
            <Button type="button" variant="outline" onClick={() => resolveModal(false)}>
              {cancelLabel}
            </Button>
          )}
          <Button
            type="button"
            autoFocus
            onClick={() => resolveModal(true)}
            className={cn(danger && "bg-red-600 text-white hover:bg-red-700 hover:opacity-100")}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
