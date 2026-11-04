import type { Timestamp } from "firebase/firestore";
import type {
  DiscountType,
  KitchenType,
  OrderStatus,
  OrderType,
  TableStatus,
} from "@/types/enum";

declare global {
  // ---------- Users ----------
  interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt: Timestamp;
  }

  // ---------- Menu ----------
  interface FoodCategory {
    id?: string;
    name: string;
    itemIds?: string[];
    order: number;
    createdAt: Timestamp;
  }

  interface OptionGroupId {
    optionGroupId: string;
    order: number;
  }

  interface MenuItem {
    id?: string;
    name: string;
    price: number;
    optionGroupIds?: OptionGroupId[];
    categoryIds?: string[];
    kitchenType: KitchenType;
    createdAt: Timestamp;
  }

  interface OptionGroup {
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

  interface ItemOption {
    id?: string;
    name: string;
    price: number;
    groupIds?: string[];
    createdAt: Timestamp;
  }

  interface MenuChange {
    id?: string;
    name: string;
    changes: ItemChange[];
    createdAt: Timestamp;
  }

  // ---------- Orders ----------
  interface OrderItemOption {
    name: string;
    price: number;
    quantity: number;
  }

  interface ItemChange {
    from: string;
    to: string;
    price: number;
  }

  interface AddExtra {
    description: string;
    price: number;
  }

  interface ExtraCatalogItem extends AddExtra {
    id?: string;
    createdAt: Timestamp;
  }

  interface OrderItem {
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

  interface Discount {
    discountType: DiscountType;
    discountValue: number;
    discountAmount: number;
    taxableSubtotal: number;
  }

  interface TaxBreakDown {
    subTotal: number;
    discount?: Discount;
    pst: number;
    gst: number;
    total: number;
  }

  type TakeOutFulfillment =
    | {
        kind: "immediate";
        readyTimeMinutes?: number;
      }
    | {
        kind: "scheduled";
        scheduledAt: Timestamp;
      };

  interface Order {
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

  interface TakeOutOrder extends Order {
    orderType: OrderType.TakeOut;
    customerName?: string;
    phoneNumber?: string;
    fulfillment: TakeOutFulfillment;
  }

  interface DineInOrder extends Order {
    orderType: OrderType.DineIn;
    tableNumber: string;
    guests: number;
  }

  type AnyOrder = TakeOutOrder | DineInOrder;

  // ---------- Tables ----------
  interface Table {
    id?: string;
    tableNumber: string;
    status: TableStatus;
    guests: number;
    currentOrderId: string | null;
  }

  // ---------- Customers ----------
  interface Customer {
    id?: string;
    name: string;
    phone: string;
    createdAt: Timestamp;
    isBlocked: boolean;
    note?: string;
    numberOfOrders: number;
    totalSpent: number;
  }

  // ---------- Credits ----------
  interface Credit {
    id?: string;
    name?: string;
    phoneNumber?: string;
    description?: string;
    amount: number;
    completed: boolean;
    createdAt: Timestamp;
  }
}

export {};
