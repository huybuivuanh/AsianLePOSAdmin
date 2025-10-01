export {};

declare global {
  type User = {
    id?: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
  };

  type FoodCategory = {
    id?: string;
    name: string;
    menuItems?: MenuItem[];
    createdAt: Date;
  };

  type MenuItem = {
    id?: string;
    name: string;
    price: number;
    itemOptionGroupIds?: string[];
    kitchenType: string;
    createdAt: Date;
  };

  type ItemOptionGroup = {
    id?: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    itemOptionIds?: string[];
    createdAt: Date;
  };

  type ItemOption = {
    id?: string;
    name: string;
    price: number;
    createdAt: Date;
  };
}
