
export type UserRole = "Super Admin" | "TP Admin" | "TP Operation" | "TP SITE" | "MCMC Admin" | "MCMC Operation";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ItemStatus = "Active" | "Inactive" | "Reserved";

export interface InventoryItem {
  id: string;
  itemNo: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  location: string;
  unitPrice: number;
  totalPrice: number;
  status: ItemStatus;
  lastUpdated: string;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface FilterOptions {
  search: string;
  category: string;
  status: ItemStatus | "" | "all-statuses";
  location: string;
}

export interface SortOptions {
  field: keyof InventoryItem | null;
  direction: "asc" | "desc";
}
