
import React, { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, FileText } from "lucide-react";

const ExportData = () => {
  const { 
    filteredItems, 
    categories, 
    locations,
    filterOptions,
    setFilterOptions,
    exportToExcel 
  } = useInventory();
  const { hasPermission, user } = useAuth();
  const { toast } = useToast();
  
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");
  const [includeColumns, setIncludeColumns] = useState({
    itemNo: true,
    name: true,
    category: true,
    unit: true,
    quantity: true,
    location: true,
    unitPrice: true,
    totalPrice: true,
    status: true,
    lastUpdated: true,
    createdBy: false,
  });
  
  // Check if user has permissions
  const canFullExport = hasPermission("read", "export");
  const canFilteredExport = hasPermission("export", "export");
  
  // Handle export
  const handleExport = () => {
    const timestamp = new Date().toLocaleString();
    
    // Log the export action
    console.log(`Export by ${user?.name} (${user?.role}) at ${timestamp}`);
    console.log("Filters applied:", filterOptions);
    console.log("Format:", exportFormat);
    console.log("Columns:", includeColumns);
    
    exportToExcel(filteredItems);
    
    toast({
      title: "Export Successful",
      description: `Exported ${filteredItems.length} items as ${exportFormat.toUpperCase()} at ${timestamp}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export Data</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
          <CardDescription>
            Configure your export preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label>Export Format</Label>
              <div className="flex mt-2 gap-4">
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                    exportFormat === "excel" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setExportFormat("excel")}
                >
                  <FileSpreadsheet className="h-8 w-8 mb-2" />
                  <span>Excel</span>
                </div>
                <div 
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                    exportFormat === "pdf" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setExportFormat("pdf")}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>PDF</span>
                </div>
              </div>
            </div>
            
            {(!canFullExport && canFilteredExport) && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md">
                <p className="text-yellow-800 text-sm">
                  Note: Based on your role ({user?.role}), you can only export filtered data.
                </p>
              </div>
            )}
            
            <div>
              <Label>Filter Data</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={filterOptions.category}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, category: value })}
                    disabled={canFullExport && !canFilteredExport}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={filterOptions.status}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value as any })}
                    disabled={canFullExport && !canFilteredExport}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-statuses">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={filterOptions.location}
                    onValueChange={(value) => setFilterOptions({ ...filterOptions, location: value })}
                    disabled={canFullExport && !canFilteredExport}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Include Columns</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(includeColumns).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`col-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => 
                        setIncludeColumns({
                          ...includeColumns,
                          [key]: checked === true,
                        })
                      }
                    />
                    <Label 
                      htmlFor={`col-${key}`}
                      className="capitalize cursor-pointer"
                    >
                      {key === "itemNo" ? "Item No" : key}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {filteredItems.length} items will be exported
            </span>
          </div>
          <Button onClick={handleExport} disabled={filteredItems.length === 0}>
            {exportFormat === "excel" ? (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Export as {exportFormat === "excel" ? "Excel" : "PDF"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExportData;
