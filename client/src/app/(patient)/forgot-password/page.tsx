"use client";

import React, { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [citizenId, setCitizenId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!citizenId.trim()) {
      setError("Please enter your Citizen ID.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { id: citizenId.trim(), role: "citizen" };
      const res = await api.post("/auth/forgot-password", payload);

      setIsSubmitted(true);
      toast({
        title: "Reset Link Sent",
        description: res.data.message,
      });
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary-DEFAULT/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-primary-DEFAULT">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We've sent password reset instructions to the email associated
              with your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="link"
                className="text-primary-DEFAULT p-0 h-auto"
                onClick={() => setIsSubmitted(false)}
              >
                try again
              </Button>
            </div>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-primary-DEFAULT" />
            <h1 className="text-2xl font-bold text-primary-DEFAULT">EVRS</h1>
          </div>
          <p className="text-muted-foreground">Reset your password securely</p>
        </div>

        <Card className="border-primary-DEFAULT/20 shadow-lg bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl text-primary-DEFAULT">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Enter your Citizen ID and we'll send you reset instructions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="border-primary-DEFAULT/20 focus:border-primary-DEFAULT"
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary-DEFAULT hover:bg-primary-600"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                className="text-primary-DEFAULT"
                onClick={() => router.push("/login")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
