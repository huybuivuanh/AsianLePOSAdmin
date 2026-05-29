import type { Discount, TakeOutFulfillment } from "@/types";
import { DiscountType } from "@/types/enum";

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatTimestamp(value: unknown): string {
  try {
    if (!value || typeof (value as { toDate?: unknown }).toDate !== "function")
      return "—";
    return (value as { toDate: () => Date }).toDate().toLocaleString();
  } catch {
    return "—";
  }
}

export function formatOrderedAt(date: Date): string {
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDiscountLabel(discount: Discount): string {
  if (discount.discountType === DiscountType.Percent) {
    return `Discount (${discount.discountValue.toFixed(0)}%)`;
  }
  if (discount.discountType === DiscountType.Amount) {
    return `Discount ($${discount.discountValue.toFixed(2)})`;
  }
  return "Discount";
}

export function formatDiscountAmount(discount: Discount): string {
  if (discount.discountType === DiscountType.Percent) {
    return `-$${discount.discountAmount.toFixed(2)}`;
  }
  if (discount.discountType === DiscountType.Amount) {
    return `$${discount.discountValue.toFixed(2)}`;
  }
  return `$${discount.discountAmount.toFixed(2)}`;
}

export function formatReadyIn(fulfillment: TakeOutFulfillment): string {
  if (fulfillment.kind === "scheduled") {
    return formatOrderedAt(fulfillment.scheduledAt.toDate());
  }
  if (
    fulfillment.readyTimeMinutes != null &&
    Number.isFinite(fulfillment.readyTimeMinutes)
  ) {
    return `${fulfillment.readyTimeMinutes} min`;
  }
  return "—";
}
