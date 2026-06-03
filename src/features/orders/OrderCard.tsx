"use client";

import { DiscountType, OrderStatus } from "@/types/enum";
import {
  isTakeOutLoadedOrder,
  submitToPrintQueue,
  completeOrder,
  type OrderHistoryLoadedOrder,
} from "@/lib/order-history-firestore";
import {
  formatDiscountAmount,
  formatDiscountLabel,
  formatOrderedAt,
  formatReadyIn,
} from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderItemBlock } from "./OrderItemBlock";

function orderCardSurface(
  status: OrderStatus,
  takeOut: boolean,
): { card: string; expanded: string } {
  switch (status) {
    case OrderStatus.Completed:
      return {
        card: "border-emerald-300/80 bg-emerald-50/95",
        expanded: "border-emerald-200/70 bg-white/70",
      };
    case OrderStatus.InProgress:
      return takeOut
        ? {
            card: "border-sky-300/80 bg-sky-50/90",
            expanded: "border-sky-200/70 bg-white/70",
          }
        : {
            card: "border-amber-200/90 bg-amber-50/95",
            expanded: "border-amber-200/80 bg-white/50",
          };
    case OrderStatus.Cancelled:
      return {
        card: "border-rose-300/80 bg-rose-50/95",
        expanded: "border-rose-200/70 bg-white/75",
      };
    default:
      return {
        card: "border-border/80 bg-muted/30",
        expanded: "border-border/60 bg-white/70",
      };
  }
}

export function OrderCard({
  order,
  expanded,
  onToggle,
  onStatusChange,
}: {
  order: OrderHistoryLoadedOrder;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}) {
  const takeOut = isTakeOutLoadedOrder(order);
  const orderedAtLabel = formatOrderedAt(order.createdAt.toDate());
  const tb = order.taxBreakDown;
  const surface = orderCardSurface(order.status, takeOut);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border-2 shadow-sm transition-shadow",
        surface.card,
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:brightness-[0.98]"
      >
        <div className="min-w-0 flex-1 space-y-0.5 text-sm text-foreground">
          <div className="flex items-start gap-2">
            {expanded ? (
              <ChevronDown className="mt-0.5 size-4 shrink-0 opacity-60" />
            ) : (
              <ChevronRight className="mt-0.5 size-4 shrink-0 opacity-60" />
            )}
            <div className="min-w-0 space-y-0.5">
              {takeOut ? (
                <>
                  {order.customerName?.trim() ? (
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {order.customerName.trim()}
                    </p>
                  ) : null}
                  {order.phoneNumber?.trim() ? (
                    <p>
                      <span className="font-medium">Phone #:</span>{" "}
                      {order.phoneNumber.trim()}
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p>
                    <span className="font-medium">Table:</span>{" "}
                    {order.tableNumber}
                  </p>
                  <p>
                    <span className="font-medium">Guests:</span> {order.guests}
                  </p>
                </>
              )}
              <p>
                <span className="font-medium">Staff:</span> {order.staff}
              </p>
              {takeOut ? (
                <p>
                  <span className="font-medium">Ready In:</span>{" "}
                  {formatReadyIn(order.fulfillment)}
                </p>
              ) : null}
              <p>
                <span className="font-medium">Ordered At:</span>{" "}
                {orderedAtLabel}
              </p>
            </div>
          </div>
        </div>
      </button>

      {expanded ? (
        <div
          className={cn("space-y-4 border-t px-4 pb-4 pt-3", surface.expanded)}
        >
          {order.orderItems.length > 0 ? (
            <ul className="space-y-2">
              {order.orderItems.map((item, i) => (
                <OrderItemBlock key={item.id ?? i} item={item} />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No line items.</p>
          )}

          <div className="space-y-1 text-sm">
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="tabular-nums font-medium">
                ${(tb.subTotal ?? 0).toFixed(2)}
              </span>
            </div>
            {tb.discount != null &&
            tb.discount.discountType !== DiscountType.None ? (
              <>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-muted-foreground">
                    {formatDiscountLabel(tb.discount)}
                  </span>
                  <span className="tabular-nums">
                    {formatDiscountAmount(tb.discount)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-muted-foreground">
                    Taxable Subtotal:
                  </span>
                  <span className="tabular-nums">
                    ${tb.discount.taxableSubtotal.toFixed(2)}
                  </span>
                </div>
              </>
            ) : null}
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground">PST:</span>
              <span className="tabular-nums">${(tb.pst ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-muted-foreground">GST:</span>
              <span className="tabular-nums">${(tb.gst ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-1 text-base font-bold">
              <span>Total:</span>
              <span className="tabular-nums">
                ${(tb.total ?? 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            <Button
              type="button"
              className="h-11 w-full flex-1 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
              variant="default"
              onClick={async (e) => {
                try {
                  e.stopPropagation();
                  await submitToPrintQueue(order);
                  alert("Order added to print queue successfully.");
                } catch (error) {
                  console.error(error);
                  alert("Failed to print order.");
                }
              }}
            >
              Print
            </Button>
            <Button
              type="button"
              className="h-11 w-full flex-1 rounded-lg bg-green-600 text-base font-semibold text-white hover:bg-green-700"
              variant="default"
              onClick={async (e) => {
                try {
                  e.stopPropagation();
                  const status = await completeOrder(order);
                  onStatusChange?.(order.id, status);
                  alert("Order completed successfully.");
                } catch (error) {
                  console.error(error);
                  alert("Failed to complete order.");
                }
              }}
            >
              Complete
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
