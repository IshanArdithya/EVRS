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
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function MOHForgotPassword() {
  const [mohId, setMohId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!mohId) {
      setError("Please enter your MOH ID.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { id: mohId.trim(), role: "moh" };
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">
              Check Your Email
            </CardTitle>
            <CardDescription>
              We've sent password reset instructions to the email associated
              with your MOH account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="link"
                className="text-green-600 p-0 h-auto"
                onClick={() => setIsSubmitted(false)}
              >
                try again
              </Button>
            </div>
            <Button
              onClick={() => router.push("/moh/login")}
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Forgot Password
          </CardTitle>
          <CardDescription>
            Enter your MOH ID and we'll send you reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mohId">MOH ID</Label>
              <Input
                id="mohId"
                type="text"
                placeholder="Enter your MOH ID"
                value={mohId}
                onChange={(e) => {
                  setMohId(e.target.value);
                  if (error) setError("");
                }}
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
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="text-green-600"
              onClick={() => router.push("/moh/login")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
