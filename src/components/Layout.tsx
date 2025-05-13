
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  List, 
  FileSpreadsheet, 
  User,
  Home,
  BarChart2,
  Settings,
  ChevronRight
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <>{children}</>;
  }

  const isActive = (path: string) => {
    return window.location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Updated sidebar to match the purple color in the image */}
      <aside className="w-64 bg-[hsl(var(--primary))] text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">IMMS</h2>
        </div>
        <nav className="px-2 py-2">
          <div className="mb-4">
            <div className="text-sm font-medium text-white/70 px-4 mb-1">Main</div>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-md text-white hover:bg-white/10 ${
                    isActive("/") ? "bg-white/10 font-medium" : ""
                  }`}
                  onClick={() => navigate("/")}
                >
                  <List className="mr-2 h-4 w-4" />
                  Inventory List
                </Button>
              </li>
              {(user.role === "TP Admin" || user.role === "TP Operation" || user.role === "TP SITE") && (
                <li>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-md text-white hover:bg-white/10 ${
                      isActive("/register") ? "bg-white/10 font-medium" : ""
                    }`}
                    onClick={() => navigate("/register")}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Register Item
                  </Button>
                </li>
              )}
              <li>
                <Button
                  variant="ghost"
                  className={`w-full justify-start rounded-md text-white hover:bg-white/10 ${
                    isActive("/export") ? "bg-white/10 font-medium" : ""
                  }`}
                  onClick={() => navigate("/export")}
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {/* Add header with user info and logout button to match the image */}
        <header className="flex justify-end mb-6 items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-2 mr-3">
                <User size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;
