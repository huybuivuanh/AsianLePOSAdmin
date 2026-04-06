import type { Timestamp } from "firebase/firestore";

export {};

declare global {
  type User = {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt: Timestamp;
  };

  type FoodCategory = {
    id?: string;
    name: string;
    itemIds?: string[];
    order: number;
    createdAt: Timestamp;
  };

  type MenuItem = {
    id?: string;
    name: string;
    price: number;
    optionGroupIds?: string[];
    categoryIds?: string[];
    kitchenType: string;
    createdAt: Timestamp;
  };

  type OptionGroup = {
    id?: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    multipleOptionQuantity: boolean;
    optionIds?: string[];
    itemIds?: string[];
    createdAt: Timestamp;
  };

  type ItemOption = {
    id?: string;
    name: string;
    price: number;
    groupIds?: string[];
    createdAt: Timestamp;
  };
}
