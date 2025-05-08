
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, Package, List, FileSpreadsheet, User } from "lucide-react";

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

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-card shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Inventory MS</h2>
        </div>
        <nav className="px-4 py-2">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start"
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
                  className="w-full justify-start"
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
                className="w-full justify-start"
                onClick={() => navigate("/export")}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-border">
          <div className="flex items-center mb-4">
            <div className="bg-primary text-white rounded-full p-2 mr-3">
              <User size={20} />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
