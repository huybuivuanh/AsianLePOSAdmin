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
    optionGroupIds?: string[];
    kitchenType: string;
    createdAt: Date;
  };

  type ItemOptionGroup = {
    id?: string;
    name: string;
    minSelection: number;
    maxSelection: number;
    optionIds?: string[];
    itemIds?: string[];
    createdAt: Date;
  };

  type ItemOption = {
    id?: string;
    name: string;
    price: number;
    groupIds?: string[];
    createdAt: Date;
  };
}
