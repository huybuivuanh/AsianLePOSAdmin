"use client";

import { cn } from "@/lib/utils";

type LoadingOverlayProps = {
  visible: boolean;
  className?: string;
};

export function LoadingOverlay({ visible, className }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center bg-background/60 backdrop-blur-sm",
        className,
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="size-8 animate-spin rounded-full border-2 border-muted-foreground/20 border-t-primary"
        aria-hidden
      />
    </div>
  );
}
