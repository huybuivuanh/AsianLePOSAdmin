import type { Timestamp } from "firebase/firestore";
import type { KitchenType } from "./enum";
import type { ItemChange } from "./order.types";

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

export interface MenuChange {
  id?: string;
  name: string;
  changes: ItemChange[];
  createdAt: Timestamp;
}
