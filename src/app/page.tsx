"use client";

import type React from "react";

import { useState } from "react";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // test login
    if (email && password) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* left side - login form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            {/* header */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">EVRS</h1>
              </div>
              <p className="text-muted-foreground">
                Secure access to your vaccination records
              </p>
            </div>

            {/* login card */}
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-xl text-primary">
                  Patient Login
                </CardTitle>
                <CardDescription>
                  Enter your credentials to access your health records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="patient@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-primary/20 focus:border-primary"
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-primary/20 focus:border-primary pr-10"
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

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-600"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <Button variant="link" className="text-primary text-sm">
                      Forgot your password?
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Need help accessing your account?{" "}
                    <Button variant="link" className="text-primary p-0 h-auto">
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

        {/* right side - img/illustration */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 p-12">
          <div className="text-center space-y-6 max-w-lg">
            {/* medical illustration placeholder */}
            <div className="w-full h-96 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div className="text-center space-y-4">
                <Shield className="h-24 w-24 text-primary mx-auto" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-primary">
                    Secure Health Records
                  </h2>
                  <p className="text-primary-700">
                    Access your vaccination history anytime, anywhere
                  </p>
                </div>
              </div>
            </div>

            {/* features */}
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-center space-x-3 text-primary-700">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">
                  Instant access to vaccination records
                </span>
              </div>
              <div className="flex items-center space-x-3 text-primary-700">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">
                  Generate QR codes for healthcare providers
                </span>
              </div>
              <div className="flex items-center space-x-3 text-primary-700">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">GOV-approved security standards</span>
              </div>
              <div className="flex items-center space-x-3 text-primary-700">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm">24/7 support and assistance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
