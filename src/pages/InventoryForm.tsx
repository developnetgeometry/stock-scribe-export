
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInventory } from "../contexts/InventoryContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem } from "@/types";

const InventoryForm = () => {
  const { addItem, updateItem, items, categories, locations } = useInventory();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    itemNo: "",
    name: "",
    category: "",
    unit: "",
    quantity: 0,
    location: "",
    unitPrice: 0,
    status: "Active",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (id) {
      const item = items.find(item => item.id === id);
      if (item) {
        setFormData(item);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Item not found",
        });
        navigate("/");
      }
    }
  }, [id, items, navigate, toast]);
  
  useEffect(() => {
    // Check permissions
    if (!hasPermission("create", "registration") && !isEditing) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to register new inventory items.",
      });
      navigate("/");
    }
    
    if (!hasPermission("update", "registration") && isEditing) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to edit inventory items.",
      });
      navigate("/");
    }
  }, [hasPermission, isEditing, navigate, toast]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.itemNo) newErrors.itemNo = "Item No is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.location) newErrors.location = "Location is required";
    
    if (formData.quantity === undefined || formData.quantity < 0) {
      newErrors.quantity = "Quantity must be 0 or greater";
    }
    
    if (formData.unitPrice === undefined || formData.unitPrice < 0) {
      newErrors.unitPrice = "Unit price must be 0 or greater";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      if (isEditing && id) {
        updateItem(formData as InventoryItem);
        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        addItem(formData as Omit<InventoryItem, "id" | "lastUpdated" | "createdBy">);
        toast({
          title: "Success",
          description: "New inventory item added successfully",
        });
      }
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save inventory item",
      });
      console.error("Error saving item:", error);
    }
  };
  
  const calculateTotalPrice = () => {
    if (formData.quantity !== undefined && formData.unitPrice !== undefined) {
      return (formData.quantity * formData.unitPrice).toFixed(2);
    }
    return "0.00";
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Inventory Item" : "Register New Inventory Item"}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>
              Enter the details of the inventory item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="itemNo">Item No <span className="text-destructive">*</span></Label>
                <Input
                  id="itemNo"
                  name="itemNo"
                  placeholder="E.g., EL001"
                  value={formData.itemNo}
                  onChange={handleChange}
                  error={errors.itemNo}
                  className={errors.itemNo ? "border-destructive" : ""}
                />
                {errors.itemNo && (
                  <p className="text-sm text-destructive">{errors.itemNo}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="E.g., Laptop Dell XPS 13"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit <span className="text-destructive">*</span></Label>
                <Input
                  id="unit"
                  name="unit"
                  placeholder="E.g., Piece, Box, Kg"
                  value={formData.unit}
                  onChange={handleChange}
                  className={errors.unit ? "border-destructive" : ""}
                />
                {errors.unit && (
                  <p className="text-sm text-destructive">{errors.unit}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity <span className="text-destructive">*</span></Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? "border-destructive" : ""}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => handleSelectChange("location", value)}
                >
                  <SelectTrigger id="location" className={errors.location ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.name}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price <span className="text-destructive">*</span></Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  className={errors.unitPrice ? "border-destructive" : ""}
                />
                {errors.unitPrice && (
                  <p className="text-sm text-destructive">{errors.unitPrice}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalPrice">Total Price</Label>
                <Input
                  id="totalPrice"
                  value={calculateTotalPrice()}
                  readOnly
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value as ItemStatus)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update" : "Register"} Item
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default InventoryForm;
