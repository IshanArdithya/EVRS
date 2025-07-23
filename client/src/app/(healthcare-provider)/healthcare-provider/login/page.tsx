/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function HealthcareProviderLogin() {
  const [credentials, setCredentials] = useState({
    hcpId: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/get/hcp");
        if (res.status === 200) {
          router.replace("/healthcare-provider/dashboard");
        }
      } catch (err: any) {
        if (err.response?.status !== 401) {
          console.error("Session check error:", err);
        }
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { hcpId, password } = credentials;
    if (!hcpId || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login/hcp", { hcpId, password });

      const userData = res.data.hcp;
      const userToStore = {
        ...userData,
        mainRole: "hcp",
      };

      localStorage.setItem("hcp", JSON.stringify(userToStore));

      router.replace("/healthcare-provider/dashboard");
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      console.error("HCP login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-teal-800">
            Healthcare Provider Portal
          </CardTitle>
          <CardDescription>Sign in to access the EVRS system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hcpId">HCP ID</Label>
              <Input
                id="hcpId"
                type="text"
                value={credentials.hcpId}
                onChange={(e) =>
                  setCredentials({ ...credentials, hcpId: e.target.value })
                }
                placeholder="Enter your HCP ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
