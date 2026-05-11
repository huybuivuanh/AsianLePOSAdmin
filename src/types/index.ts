import type { Timestamp } from "firebase/firestore";
import {
  type DiscountType,
  type KitchenType,
  type OrderStatus,
  type OrderType,
  type TableStatus,
} from "./enum";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  createdAt: Timestamp;
}

export interface FoodCategory {
  id?: string;
  name: string;
  itemIds?: string[];
  order: number;
  createdAt: Timestamp;
}

export interface OptionGroupId {
  optionGroupId: string;
  order: number;
}

export interface MenuItem {
  id?: string;
  name: string;
  price: number;
  optionGroupIds?: OptionGroupId[];
  categoryIds?: string[];
  kitchenType: KitchenType;
  createdAt: Timestamp;
}

export interface OptionGroup {
  id?: string;
  name: string;
  minSelection: number;
  maxSelection: number;
  multipleOptionQuantity: boolean;
  optionIds?: string[];
  itemIds?: string[];
  defaultOptionId?: string;
  createdAt: Timestamp;
}

export interface ItemOption {
  id?: string;
  name: string;
  price: number;
  groupIds?: string[];
  createdAt: Timestamp;
}

export interface OrderItemOption {
  name: string;
  price: number;
  quantity: number;
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

export interface ItemChange {
  from: string;
  to: string;
  price: number;
}

export interface AddExtra {
  description: string;
  price: number;
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

export interface Table {
  id?: string;
  tableNumber: string;
  status: TableStatus;
  guests: number;
  currentOrderId: string | null;
}

export interface Customer {
  id?: string;
  name: string;
  phone: string;
  createdAt: Timestamp;
}

export interface MenuChange extends ItemChange {
  id?: string;
  createdAt: Timestamp;
}

export interface Credit {
  id?: string;
  name?: string;
  phoneNumber?: string;
  description?: string;
  amount: number;
  completed: boolean;
  createdAt: Timestamp;
}
