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
    itemOptionGroups?: ItemOptionGroups[];
    kitchenType: string;
    createdAt: Date;
  };

  type ItemOptionGroups = {
    id?: string;
    name: string;
    itemOptions: ItemOption[];
    createdAt: Date;
  };

  type ItemOption = {
    id?: string;
    name: string;
    price: number;
    createdAt: Date;
  };
}
