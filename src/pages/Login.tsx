
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Inventory Management System</CardTitle>
          <CardDescription>
            Sign in to access your inventory dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Demo accounts: (all use "password")
                </p>
                <div className="text-xs text-muted-foreground mt-1 grid grid-cols-2 gap-1">
                  {[
                    "super@example.com (Super Admin)",
                    "tpadmin@example.com (TP Admin)",
                    "tpop@example.com (TP Operation)",
                    "tpsite@example.com (TP SITE)",
                    "mcmcadmin@example.com (MCMC Admin)",
                    "mcmcop@example.com (MCMC Operation)"
                  ].map((account, index) => (
                    <div key={index} className="cursor-pointer hover:text-primary" onClick={() => setEmail(account.split(" ")[0])}>
                      {account}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
