// Same math as the POS app's domain/order/orderCalculations.ts.
import { DiscountType } from "@/types/enum";

export function orderItemsSubtotal(items: OrderItem[] | undefined): number {
  return (items ?? []).reduce((acc, i) => acc + i.price * i.quantity, 0);
}

function calculateDiscountAmount(
  itemsSubtotal: number,
  discountType: DiscountType,
  discountValue: number,
): number {
  if (itemsSubtotal <= 0) return 0;
  if (discountType === DiscountType.Amount) {
    return Math.min(itemsSubtotal, Math.max(0, discountValue));
  }
  if (discountType === DiscountType.Percent) {
    return (itemsSubtotal * Math.min(100, Math.max(0, discountValue))) / 100;
  }
  return 0;
}

export function calculateTaxBreakdown(
  itemsSubtotal: number,
  discountType: DiscountType = DiscountType.None,
  discountValue = 0,
): TaxBreakDown {
  if (itemsSubtotal <= 0) return { subTotal: 0, pst: 0, gst: 0, total: 0 };
  const discountAmount = calculateDiscountAmount(itemsSubtotal, discountType, discountValue);
  const taxableSubtotal = Math.max(0, itemsSubtotal - discountAmount);
  const pst = taxableSubtotal * 0.06;
  const gst = taxableSubtotal * 0.05;
  const base: TaxBreakDown = {
    subTotal: itemsSubtotal,
    pst,
    gst,
    total: taxableSubtotal + pst + gst,
  };
  if (discountType === DiscountType.None || discountAmount <= 0) return base;
  return {
    ...base,
    discount: { discountType, discountValue, discountAmount, taxableSubtotal },
  };
}
