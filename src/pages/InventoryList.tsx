import React, { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Search,
  FileSpreadsheet,
  Edit,
  Trash,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InventoryItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';

const InventoryList = () => {
  const { 
    filteredItems, 
    filterOptions, 
    setFilterOptions, 
    categories,
    locations,
    sortOptions,
    setSortOptions,
    selectedItems,
    setSelectedItems,
    exportToExcel,
    deleteItem
  } = useInventory();
  
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };
  
  const handleSort = (field: keyof InventoryItem) => {
    setSortOptions({
      field,
      direction: sortOptions.field === field && sortOptions.direction === "asc" ? "desc" : "asc",
    });
  };
  
  const handleExport = () => {
    if (selectedItems.length > 0) {
      const itemsToExport = filteredItems.filter(item => selectedItems.includes(item.id));
      exportToExcel(itemsToExport);
    } else {
      exportToExcel();
    }
  };
  
  const canEdit = hasPermission("update", "registration");
  const canDelete = hasPermission("delete", "registration");
  const canExport = hasPermission("read", "export") || hasPermission("export", "export");
  
  const getSortIcon = (field: keyof InventoryItem) => {
    if (sortOptions.field !== field) return null;
    return sortOptions.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="status-badge-active">In Operation</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "Reserved":
        return <Badge className="status-badge-temporary">Temporarily Close</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage all inventory items</p>
        </div>
        <div className="flex gap-2">
          {canExport && (
            <Button variant="export">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export {selectedItems.length > 0 ? `(${selectedItems.length})` : "All"}
            </Button>
          )}
          {/* Add New Item button with new style */}
          {canEdit && (
            <Button variant="add" onClick={() => navigate('/register')}>
              <span className="text-lg font-bold">+</span>
              Add New Item
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  className="pl-10"
                  value={filterOptions.search}
                  onChange={(e) => setFilterOptions({ ...filterOptions, search: e.target.value })}
                />
              </div>
              
              <Button
                variant="filter"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {isFilterOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </Button>
            </div>
            
            {isFilterOpen && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={filterOptions.category}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, category: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value as any })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All Statuses</SelectItem>
                      <SelectItem value="Active">In Operation</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Reserved">Temporarily Close</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Select
                    value={filterOptions.location}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, location: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {isFilterOpen && (
              <div className="flex justify-end">
                <Button variant="reset" className="ml-auto">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("itemNo")}
                  >
                    <div className="flex items-center">
                      Item No
                      {getSortIcon("itemNo")}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Item Name
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("quantity")}
                  >
                    <div className="flex items-center">
                      Quantity
                      {getSortIcon("quantity")}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("lastUpdated")}
                  >
                    <div className="flex items-center">
                      Last Updated
                      {getSortIcon("lastUpdated")}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectItem(item.id, checked === true)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.itemNo}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(item.lastUpdated), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {canEdit && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => navigate(`/edit/${item.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => deleteItem(item.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredItems.length} items
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryList;
