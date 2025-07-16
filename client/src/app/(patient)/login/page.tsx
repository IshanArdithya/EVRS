"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/get/citizen", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!citizenId || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login/citizen", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citizenId: citizenId,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed. Please try again.");
      } else {
        // can optionally store user info in state/context
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary-DEFAULT" />
            <h1 className="text-2xl font-bold text-primary-DEFAULT">EVRS</h1>
          </div>
          <p className="text-muted-foreground">
            Secure access to your vaccination records
          </p>
        </div>

        {/* login card */}
        <Card className="border-primary-DEFAULT/20 shadow-lg bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl text-primary-DEFAULT">
              Patient Login
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your health records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citizenId">Citizen ID</Label>
                <Input
                  id="citizenId"
                  type="text"
                  placeholder="C1234567890"
                  value={citizenId}
                  onChange={(e) => {
                    setCitizenId(e.target.value);
                    if (error) setError("");
                  }}
                  required
                  className="mt-2 border-primary-DEFAULT/20 focus:border-primary-DEFAULT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    className="mt-2 border-primary-DEFAULT/20 focus:border-primary-DEFAULT pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-DEFAULT hover:bg-primary-600"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center">
                <Button variant="link" className="text-primary-DEFAULT text-sm">
                  Forgot your password?
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Need help accessing your account?{" "}
                <Button
                  variant="link"
                  className="text-primary-DEFAULT p-0 h-auto"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* footer */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>This is a secure GOV-approved portal</p>
          <p>Your data is protected and encrypted</p>
        </div>
      </div>
    </div>
  );
}
