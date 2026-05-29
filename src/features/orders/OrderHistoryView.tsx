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
import { DiscountType, OrderStatus } from "@/types/enum";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchField } from "@/components/ui/search-field";
import type { OrderItem } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatDiscountAmount,
  formatDiscountLabel,
  formatOrderedAt,
  formatReadyIn,
} from "@/lib/formatters";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function matchesOrderSearch(order: OrderHistoryLoadedOrder, q: string): boolean {
  if (!q.trim()) return true;
  if (!isTakeOutLoadedOrder(order)) return false;

  const term = q.trim().toLowerCase();
  const phoneTerm = normalizePhone(q);
  const name = (order.customerName ?? "").toLowerCase();
  const phone = normalizePhone(order.phoneNumber ?? "");
  const phoneDisplay = (order.phoneNumber ?? "").toLowerCase();

  return (
    name.includes(term) ||
    phoneDisplay.includes(term) ||
    (phoneTerm.length > 0 && phone.includes(phoneTerm))
  );
}

function orderCardSurface(
  status: OrderStatus,
  takeOut: boolean,
): {
  card: string;
  expanded: string;
} {
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

function OrderItemBlock({ item }: { item: OrderItem }) {
  return (
    <li className="rounded-lg border border-white/80 bg-white px-3 py-2.5 text-sm shadow-sm">
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
              •{o.quantity > 1 ? ` ${o.quantity}×` : ""} {o.name}{" "}
              <span className="tabular-nums">
                {o.price > 0 ? ` $${o.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.changes != null && item.changes.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.changes.map((c, j) => (
            <li key={j}>
              <span className="tabular-nums">•</span> Change: {c.from} → {c.to}{" "}
              <span className="tabular-nums">
                {c.price > 0 ? ` $${c.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.extras != null && item.extras.length > 0 ? (
        <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
          {item.extras.map((ex, j) => (
            <li key={j}>
              <span className="tabular-nums">•</span>Add Extra: {ex.description}{" "}
              <span className="tabular-nums">
                {ex.price > 0 ? ` $${ex.price.toFixed(2)}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {item.instructions != null && item.instructions.trim() !== "" ? (
        <p className="mt-1.5 text-xs italic text-muted-foreground">
          <span className="tabular-nums">•</span> Note: {item.instructions}
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

          <Button
            type="button"
            className="h-11 w-full rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700"
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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setOrders([]);
    setLoadedFor(null);
    setExpanded({});
    setError(null);
    setSearchTerm("");
  }, [dateKey, channel]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => matchesOrderSearch(order, searchTerm)),
    [orders, searchTerm],
  );

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
        title="Order History"
        description="See order history within 30 days."
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

      {loadedFor && !loading && orders.length > 0 && channel === "takeOut" ? (
        <div className="mb-4">
          <SearchField
            placeholder="Search by name or phone number…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search orders"
          />
        </div>
      ) : null}

      {loadedFor &&
      !loading &&
      orders.length > 0 &&
      channel === "takeOut" &&
      filteredOrders.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No orders match your search.
        </p>
      ) : null}

      {filteredOrders.length > 0 ? (
        <ul className="space-y-3">
          {filteredOrders.map((order) => (
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
