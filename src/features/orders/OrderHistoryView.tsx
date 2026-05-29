"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  dateToLocalKey,
  fetchOrdersForHistory,
  isTakeOutLoadedOrder,
  type OrderHistoryChannel,
  type OrderHistoryLoadedOrder,
} from "@/lib/order-history-firestore";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchField } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderCard } from "./OrderCard";

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
