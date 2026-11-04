"use client";

import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { formatTimestamp } from "@/lib/formatters";
import { useMenuVersionStore } from "@/stores/useMenuVersionStore";
import { alertDialog, confirmDialog } from "@/stores/useModalStore";

/** Slim bar above every menu section: current version + Publish button. */
export function PublishMenuToolbar() {
  const { version, loading, publishMenu } = useMenuVersionStore();

  const handlePublish = async () => {
    if (
      !(await confirmDialog("Publish the menu to the POS now?", {
        confirmLabel: "Publish",
      }))
    )
      return;
    try {
      await publishMenu();
    } catch (err) {
      console.error("Error publishing menu:", err);
      await alertDialog("Couldn't publish the menu. Try again.");
    }
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] px-4 py-3">
        <p className="text-sm text-foreground/60">
          {!loading && version ? (
            <>
              <span className="font-medium text-foreground">v{version.version}</span>
              {" · Last published "}
              <span className="font-medium text-foreground">
                {version.lastUpdated ? formatTimestamp(version.lastUpdated) : "not yet"}
              </span>
            </>
          ) : (
            "Changes go live on the POS when you publish."
          )}
        </p>
        <Button type="button" size="sm" onClick={handlePublish} className="gap-2">
          <Rocket className="size-4" aria-hidden />
          Publish menu
        </Button>
      </div>
    </>
  );
}
