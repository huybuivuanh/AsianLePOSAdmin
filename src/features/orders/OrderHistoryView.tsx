"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  dateToLocalKey,
  fetchOrdersForHistory,
  isTakeOutLoadedOrder,
  submitToPrintQueue,
  type OrderHistoryChannel,
  type OrderHistoryLoadedOrder,
} from "@/lib/order-history-firestore";
import { DiscountType } from "@/types/enum";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function discountTypeLabel(t: DiscountType): string {
  if (t === DiscountType.Amount) return "Amount off";
  if (t === DiscountType.Percent) return "Percent off";
  return "Discount";
}

function OrderItemBlock({ item }: { item: OrderItem }) {
  return (
    <li className="rounded-lg border border-border/60 bg-white px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="font-medium">{item.quantity}</span>
          {" × "}
          {item.name}
        </span>
        <span className="shrink-0 tabular-nums">${item.price.toFixed(2)}</span>
      </div>
      {item.options != null && item.options.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5 border-t border-border/40 pt-1.5 text-xs text-muted-foreground">
          {item.options.map((o, j) => (
            <li key={j}>
              {o.quantity}× {o.name}{" "}
              <span className="tabular-nums">(+${o.price.toFixed(2)})</span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.changes != null && item.changes.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.changes.map((c, j) => (
            <li key={j}>
              Change: {c.from} → {c.to}{" "}
              <span className="tabular-nums">(+${c.price.toFixed(2)})</span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.extras != null && item.extras.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.extras.map((ex, j) => (
            <li key={j}>
              {ex.description}{" "}
              <span className="tabular-nums">(+${ex.price.toFixed(2)})</span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.instructions != null && item.instructions.trim() !== "" ? (
        <p className="mt-1.5 text-xs italic text-muted-foreground">
          Note: {item.instructions}
        </p>
      ) : null}
    </li>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
}: {
  order: OrderHistoryLoadedOrder;
  expanded: boolean;
  onToggle: () => void;
}) {
  const takeOut = isTakeOutLoadedOrder(order);
  const timeLabel = order.createdAt.toDate().toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const tb = order.taxBreakDown;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border-2 shadow-sm transition-shadow",
        takeOut
          ? "border-sky-300/80 bg-sky-50/90"
          : "border-amber-200/90 bg-amber-50/95",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left transition hover:brightness-[0.98]"
      >
        <div className="min-w-0 space-y-0.5 text-sm text-foreground">
          <div className="flex items-start gap-2">
            {expanded ? (
              <ChevronDown className="mt-0.5 size-4 shrink-0 opacity-60" />
            ) : (
              <ChevronRight className="mt-0.5 size-4 shrink-0 opacity-60" />
            )}
            <div className="min-w-0 space-y-0.5">
              {takeOut ? (
                <>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {order.customerName ?? "—"}
                  </p>
                  {order.phoneNumber != null && order.phoneNumber !== "" ? (
                    <p>
                      <span className="font-medium">Phone #:</span>{" "}
                      {order.phoneNumber}
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
              <p>
                <span className="font-medium">Time:</span> {timeLabel}
              </p>
            </div>
          </div>
        </div>
      </button>

      {expanded ? (
        <div
          className={cn(
            "space-y-4 border-t px-4 pb-4 pt-3",
            takeOut
              ? "border-sky-200/80 bg-white/60"
              : "border-amber-200/80 bg-white/50",
          )}
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

          <div className="space-y-1 text-right text-sm">
            <p>
              <span className="text-muted-foreground">Subtotal:</span>{" "}
              <span className="tabular-nums font-medium">
                ${(tb.subTotal ?? 0).toFixed(2)}
              </span>
            </p>
            {tb.discount != null &&
            tb.discount.discountType !== DiscountType.None ? (
              <>
                <p>
                  <span className="text-muted-foreground">
                    {discountTypeLabel(tb.discount.discountType)}:
                  </span>{" "}
                  <span className="tabular-nums">
                    −${tb.discount.discountAmount.toFixed(2)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Taxable subtotal: ${tb.discount.taxableSubtotal.toFixed(2)}
                </p>
              </>
            ) : null}
            <p>
              <span className="text-muted-foreground">PST:</span>{" "}
              <span className="tabular-nums">${(tb.pst ?? 0).toFixed(2)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">GST:</span>{" "}
              <span className="tabular-nums">${(tb.gst ?? 0).toFixed(2)}</span>
            </p>
            <p className="pt-1 text-base font-bold">
              Total:{" "}
              <span className="tabular-nums">
                ${(tb.total ?? 0).toFixed(2)}
              </span>
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
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
        </div>
      ) : null}
    </div>
  );
}

export default function OrderHistoryView() {
  const todayKey = useMemo(() => dateToLocalKey(new Date()), []);
  const [dateKey, setDateKey] = useState(todayKey);
  const [channel, setChannel] = useState<OrderHistoryChannel>("takeOut");
  const [orders, setOrders] = useState<OrderHistoryLoadedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadedFor, setLoadedFor] = useState<{
    key: string;
    ch: OrderHistoryChannel;
  } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOrders([]);
    setLoadedFor(null);
    setExpanded({});
    setError(null);
  }, [dateKey, channel]);

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchOrdersForHistory(channel, dateKey);
      setOrders(rows);
      setLoadedFor({ key: dateKey, ch: channel });
      setExpanded({});
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error ? e.message : "Failed to load orders. Check rules.",
      );
      setOrders([]);
      setLoadedFor(null);
    } finally {
      setLoading(false);
    }
  }, [channel, dateKey]);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Order history"
        description="Load take-out or dine-in orders for a calendar day. Orders are matched by createdAt falling within that day in your local timezone (same as your POS timestamps)."
      />

      <div className="mb-6 rounded-xl border border-border/80 bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="space-y-2 sm:min-w-[11rem]">
            <Label htmlFor="order-history-date">Date</Label>
            <Input
              id="order-history-date"
              type="date"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:min-w-[12rem]">
            <Label htmlFor="order-history-channel">Order type</Label>
            <Select
              value={channel}
              onValueChange={(v) => setChannel(v as OrderHistoryChannel)}
            >
              <SelectTrigger id="order-history-channel" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="takeOut">Take Out</SelectItem>
                <SelectItem value="dineIn">Dine In</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={load}
            disabled={loading || !dateKey}
            className="sm:mb-0"
          >
            {loading ? "Loading…" : "Load"}
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {!loadedFor && !loading ? (
        <p className="text-center text-sm text-muted-foreground">
          Choose a date and type, then press <strong>Load</strong>.
        </p>
      ) : null}

      {loadedFor && !loading && orders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No orders for {loadedFor.key} (
          {loadedFor.ch === "takeOut" ? "Take Out" : "Dine In"}).
        </p>
      ) : null}

      {orders.length > 0 ? (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                expanded={Boolean(expanded[order.id])}
                onToggle={() => toggle(order.id)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
