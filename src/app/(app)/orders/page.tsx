"use client";

import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function OrderHistory() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Order history"
        description="Past orders will appear here when this section is connected to your order data."
      />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted">
          <ClipboardList
            className="size-7 text-muted-foreground"
            aria-hidden
          />
        </div>
        <p className="text-sm font-medium text-foreground">No orders to show</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          This page is ready for your order list or exports.
        </p>
      </div>
    </div>
  );
}
