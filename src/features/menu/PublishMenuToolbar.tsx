"use client";

import { useEffect, type ReactNode } from "react";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMenuVersionStore } from "@/stores/useMenuVersionStore";

type PublishMenuToolbarProps = {
  /** Controls shown before the Publish button (e.g. create / sort actions). */
  children?: ReactNode;
};

export function PublishMenuToolbar({ children }: PublishMenuToolbarProps) {
  const { version, loading, subscribe, publishMenu } = useMenuVersionStore();

  useEffect(() => {
    const unsub = subscribe();
    return () => unsub();
  }, [subscribe]);

  const handlePublish = async () => {
    if (!confirm("Publish Menu?")) return;
    try {
      await publishMenu();
    } catch (err) {
      console.error("Error publishing menu:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {children}
      </div>
      <Button
        type="button"
        onClick={handlePublish}
        className="w-full gap-2 sm:w-auto"
      >
        <Rocket className="size-4" aria-hidden />
        Publish menu
      </Button>
      {!loading && version ? (
        <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:text-sm">
          <span className="font-medium text-foreground">
            v{version.version}
          </span>
          <span className="hidden text-muted-foreground/50 sm:inline" aria-hidden>
            ·
          </span>
          <span className="break-words">
            Last published{" "}
            <span className="font-medium text-foreground">
              {version.lastUpdated
                ? version.lastUpdated.toDate().toLocaleString()
                : "— not yet —"}
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}
