import type { Timestamp } from "firebase/firestore";
import type { DiscountType, KitchenType, OrderStatus, OrderType } from "./enum";

export interface OrderItemOption {
  name: string;
  price: number;
  quantity: number;
}

export interface ItemChange {
  from: string;
  to: string;
  price: number;
}

export interface AddExtra {
  description: string;
  price: number;
}

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  options?: OrderItemOption[];
  changes?: ItemChange[];
  extras?: AddExtra[];
  togo: boolean;
  appetizer: boolean;
  kitchenType: KitchenType;
  instructions?: string;
  paid: boolean;
  completed: boolean;
}

export interface Discount {
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  taxableSubtotal: number;
}

export interface TaxBreakDown {
  subTotal: number;
  discount?: Discount;
  pst: number;
  gst: number;
  total: number;
}

export type TakeOutFulfillment =
  | {
      kind: "immediate";
      readyTimeMinutes?: number;
    }
  | {
      kind: "scheduled";
      scheduledAt: Timestamp;
    };

export interface Order {
  id?: string;
  staff: string;
  orderType: OrderType;
  orderItems: OrderItem[];
  taxBreakDown: TaxBreakDown;
  status: OrderStatus;
  paid: boolean;
  printed: boolean;
  createdAt: Timestamp;
}

export interface TakeOutOrder extends Order {
  orderType: OrderType.TakeOut;
  customerName?: string;
  phoneNumber?: string;
  fulfillment: TakeOutFulfillment;
}

export interface DineInOrder extends Order {
  orderType: OrderType.DineIn;
  tableNumber: string;
  guests: number;
}

export type AnyOrder = TakeOutOrder | DineInOrder;
