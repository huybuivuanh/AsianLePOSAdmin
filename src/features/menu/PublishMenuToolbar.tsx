"use client";

import { useEffect, type ReactNode } from "react";
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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">{children}</div>
      <Button type="button" onClick={handlePublish} className="w-full sm:w-auto">
        Publish Menu
      </Button>
      {!loading && version && (
        <div className="flex flex-col gap-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-0 sm:text-sm">
          <span className="font-medium text-gray-800">
            Version {version.version}
          </span>
          <span className="hidden text-gray-400 sm:inline">•</span>
          <span className="break-words">
            Last published:{" "}
            <span className="font-medium text-gray-800">
              {version.lastUpdated
                ? version.lastUpdated.toDate().toLocaleString()
                : "— not published yet —"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
