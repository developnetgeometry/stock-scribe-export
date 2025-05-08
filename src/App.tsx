
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { InventoryProvider } from "@/contexts/InventoryContext";

// Pages
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import InventoryList from "@/pages/InventoryList";
import InventoryForm from "@/pages/InventoryForm";
import ExportData from "@/pages/ExportData";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <InventoryProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={<PrivateRoute><Layout><InventoryList /></Layout></PrivateRoute>} />
              <Route path="/register" element={<PrivateRoute><Layout><InventoryForm /></Layout></PrivateRoute>} />
              <Route path="/edit/:id" element={<PrivateRoute><Layout><InventoryForm /></Layout></PrivateRoute>} />
              <Route path="/export" element={<PrivateRoute><Layout><ExportData /></Layout></PrivateRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </InventoryProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
