
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  hasPermission: (action: "create" | "read" | "update" | "delete" | "export", module: "registration" | "list" | "export") => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: "1", name: "Super Admin", email: "super@example.com", role: "Super Admin" },
  { id: "2", name: "TP Admin", email: "tpadmin@example.com", role: "TP Admin" },
  { id: "3", name: "TP Operation", email: "tpop@example.com", role: "TP Operation" },
  { id: "4", name: "TP SITE", email: "tpsite@example.com", role: "TP SITE" },
  { id: "5", name: "MCMC Admin", email: "mcmcadmin@example.com", role: "MCMC Admin" },
  { id: "6", name: "MCMC Operation", email: "mcmcop@example.com", role: "MCMC Operation" },
];

// Permission matrix based on the provided CRUD-E access matrix
const permissionMatrix: Record<UserRole, Record<string, string[]>> = {
  "Super Admin": {
    "registration": [],
    "list": ["read"],
    "export": ["read"],
  },
  "TP Admin": {
    "registration": ["create", "read", "update", "delete"],
    "list": ["read"],
    "export": ["read"],
  },
  "TP Operation": {
    "registration": ["create", "read", "update", "delete"],
    "list": ["read"],
    "export": ["read"],
  },
  "TP SITE": {
    "registration": ["create", "read", "update", "delete"],
    "list": ["read"],
    "export": ["export"],
  },
  "MCMC Admin": {
    "registration": [],
    "list": ["read"],
    "export": ["export"],
  },
  "MCMC Operation": {
    "registration": [],
    "list": ["read"],
    "export": ["export"],
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user session on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by email (mock authentication)
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === "password") { // Simple mock password
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasPermission = (action: "create" | "read" | "update" | "delete" | "export", module: "registration" | "list" | "export") => {
    if (!user) return false;
    
    const permissions = permissionMatrix[user.role][module];
    return permissions.includes(action);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
