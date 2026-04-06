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
    <div className="flex flex-wrap items-center gap-4">
      {children}
      <Button type="button" onClick={handlePublish}>
        Publish Menu
      </Button>
      {!loading && version && (
        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700">
          <span className="font-medium text-gray-800">
            Version {version.version}
          </span>
          <span className="text-gray-400">•</span>
          <span>
            Last Published:{" "}
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
