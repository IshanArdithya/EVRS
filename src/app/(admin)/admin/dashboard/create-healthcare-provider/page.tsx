"use client";

import type React from "react";

import { useState } from "react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Copy, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateHealthcareProvider() {
  const [formData, setFormData] = useState({
    uniqueId: "",
    name: "",
    email: "",
    nic: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = generatePassword();
    setGeneratedPassword(password);
    setShowSuccess(true);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Healthcare Provider Account
          </h1>
          <p className="text-gray-600">
            Add a new doctor, nurse, or medical professional to the system
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Healthcare Provider Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new healthcare provider
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId">Unique ID *</Label>
                  <Input
                    id="uniqueId"
                    placeholder="e.g., HP2024001"
                    value={formData.uniqueId}
                    onChange={(e) =>
                      handleInputChange("uniqueId", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="nurse">Nurse</SelectItem>
                      <SelectItem value="pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="medical-technician">
                        Medical Technician
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Dr. Samantha Silva"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., samantha.silva@hospital.lk"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nic">NIC Number *</Label>
                <Input
                  id="nic"
                  placeholder="e.g., 199012345678"
                  value={formData.nic}
                  onChange={(e) => handleInputChange("nic", e.target.value)}
                  required
                />
              </div>

              <Alert>
                <AlertDescription>
                  A secure password will be automatically generated for this
                  account. The healthcare provider will receive their login
                  credentials via email.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading
                  ? "Creating Account..."
                  : "Create Healthcare Provider Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                The healthcare provider account has been created. Here are the
                account details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Unique ID:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{formData.uniqueId}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(formData.uniqueId, "Unique ID")
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Name:</span>
                  <span className="text-sm">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Role:</span>
                  <Badge>{formData.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{formData.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Generated Password:
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded text-xs">
                      {showPassword ? generatedPassword : "••••••••••••"}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(generatedPassword, "Password")
                      }
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <Alert>
                <AlertDescription className="text-xs">
                  Please securely share these credentials with the healthcare
                  provider. They should change their password upon first login.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  setFormData({
                    uniqueId: "",
                    name: "",
                    email: "",
                    nic: "",
                    role: "",
                  });
                  setGeneratedPassword("");
                  setShowPassword(false);
                }}
                className="w-full"
              >
                Create Another Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}
