import type { Timestamp } from "firebase/firestore";

export {};

declare global {
  interface User {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt: Timestamp;
  }

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

  interface Table {
    id?: string;
    tableNumber: string;
    status: TableStatus;
    guests: number;
    currentOrderId: string | null;
  }
}
