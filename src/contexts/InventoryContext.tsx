import React, { createContext, useContext, useState, useEffect } from "react";
import { InventoryItem, FilterOptions, SortOptions, Category, Location } from "../types";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

interface InventoryContextProps {
  items: InventoryItem[];
  categories: Category[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated" | "createdBy">) => void;
  updateItem: (item: InventoryItem) => void;
  deleteItem: (id: string) => void;
  filteredItems: InventoryItem[];
  filterOptions: FilterOptions;
  sortOptions: SortOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  setSortOptions: React.Dispatch<React.SetStateAction<SortOptions>>;
  exportToExcel: (items?: InventoryItem[]) => void;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const InventoryContext = createContext<InventoryContextProps | undefined>(undefined);

// Mock data
const mockCategories: Category[] = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Furniture" },
  { id: "3", name: "Office Supplies" },
  { id: "4", name: "Networking" },
  { id: "5", name: "Tools" },
];

const mockLocations: Location[] = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Office Building 1" },
  { id: "4", name: "Office Building 2" },
  { id: "5", name: "Remote Site" },
];

const mockItems: InventoryItem[] = [
  {
    id: "1",
    itemNo: "EL001",
    name: "Laptop Dell XPS 13",
    category: "Electronics",
    unit: "Piece",
    quantity: 15,
    location: "Warehouse A",
    unitPrice: 1200,
    totalPrice: 18000,
    status: "Active",
    lastUpdated: new Date(2023, 4, 15).toISOString(),
    createdBy: "TP Admin",
  },
  {
    id: "2",
    itemNo: "FU001",
    name: "Office Chair",
    category: "Furniture",
    unit: "Piece",
    quantity: 30,
    location: "Warehouse B",
    unitPrice: 150,
    totalPrice: 4500,
    status: "Active",
    lastUpdated: new Date(2023, 5, 20).toISOString(),
    createdBy: "TP Operation",
  },
  {
    id: "3",
    itemNo: "OS001",
    name: "Printer Paper",
    category: "Office Supplies",
    unit: "Box",
    quantity: 50,
    location: "Office Building 1",
    unitPrice: 25,
    totalPrice: 1250,
    status: "Active",
    lastUpdated: new Date(2023, 6, 10).toISOString(),
    createdBy: "TP SITE",
  },
  {
    id: "4",
    itemNo: "NW001",
    name: "Network Switch",
    category: "Networking",
    unit: "Piece",
    quantity: 5,
    location: "Office Building 2",
    unitPrice: 350,
    totalPrice: 1750,
    status: "Reserved",
    lastUpdated: new Date(2023, 7, 5).toISOString(),
    createdBy: "TP Admin",
  },
  {
    id: "5",
    itemNo: "TL001",
    name: "Power Drill",
    category: "Tools",
    unit: "Piece",
    quantity: 8,
    location: "Remote Site",
    unitPrice: 120,
    totalPrice: 960,
    status: "Inactive",
    lastUpdated: new Date(2023, 8, 12).toISOString(),
    createdBy: "TP Operation",
  },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [categories] = useState<Category[]>(mockCategories);
  const [locations] = useState<Location[]>(mockLocations);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: "",
    category: "",
    status: "",
    location: "",
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: "lastUpdated",
    direction: "desc",
  });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const addItem = (newItemData: Omit<InventoryItem, "id" | "lastUpdated" | "createdBy">) => {
    if (!user) return;
    
    const newItem: InventoryItem = {
      ...newItemData,
      id: uuidv4(),
      lastUpdated: new Date().toISOString(),
      createdBy: user.name,
      totalPrice: newItemData.unitPrice * newItemData.quantity,
    };
    
    setItems(prevItems => [...prevItems, newItem]);
  };

  const updateItem = (updatedItem: InventoryItem) => {
    const calculatedTotalPrice = updatedItem.unitPrice * updatedItem.quantity;
    
    const itemToUpdate = {
      ...updatedItem,
      lastUpdated: new Date().toISOString(),
      totalPrice: calculatedTotalPrice,
    };
    
    setItems(prevItems =>
      prevItems.map(item => 
        item.id === updatedItem.id ? itemToUpdate : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Filter and sort items
  const filteredItems = React.useMemo(() => {
    // Filtering
    let result = [...items];
    
    if (filterOptions.search) {
      const searchLower = filterOptions.search.toLowerCase();
      result = result.filter(
        item =>
          item.itemNo.toLowerCase().includes(searchLower) ||
          item.name.toLowerCase().includes(searchLower)
      );
    }
    
    if (filterOptions.category && filterOptions.category !== "all-categories") {
      result = result.filter(item => item.category === filterOptions.category);
    }
    
    if (filterOptions.status && filterOptions.status !== "all-statuses") {
      result = result.filter(item => item.status === filterOptions.status);
    }
    
    if (filterOptions.location && filterOptions.location !== "all-locations") {
      result = result.filter(item => item.location === filterOptions.location);
    }
    
    // Sorting
    if (sortOptions.field) {
      result = [...result].sort((a, b) => {
        const fieldA = a[sortOptions.field as keyof InventoryItem];
        const fieldB = b[sortOptions.field as keyof InventoryItem];
        
        if (fieldA < fieldB) {
          return sortOptions.direction === "asc" ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return sortOptions.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [items, filterOptions, sortOptions]);

  // Export to Excel functionality (mock)
  const exportToExcel = (itemsToExport?: InventoryItem[]) => {
    const dataToExport = itemsToExport || filteredItems;
    const timestamp = new Date().toLocaleString();
    
    console.log(`Exporting ${dataToExport.length} items at ${timestamp}`);
    console.log("Filter options:", filterOptions);
    console.log("Data:", dataToExport);
    
    // In a real implementation, this would create and download an Excel file
    alert(`Exported ${dataToExport.length} items successfully at ${timestamp}`);
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        categories,
        locations,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        filteredItems,
        filterOptions,
        setFilterOptions,
        sortOptions,
        setSortOptions,
        exportToExcel,
        selectedItems,
        setSelectedItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
