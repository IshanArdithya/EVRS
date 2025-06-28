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
import { Baby, Copy, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sriLankanDistricts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export default function CreateNewborn() {
  const [formData, setFormData] = useState({
    uniqueId: "",
    name: "",
    birthDate: "",
    district: "",
    division: "",
    serialNumber: "",
    guardianNic: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
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
            Create Newborn Account
          </h1>
          <p className="text-gray-600">
            Register a new citizen account for vaccination tracking
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-blue-600" />
              Newborn Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to create a new citizen account for a
              newborn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId">Unique ID *</Label>
                  <Input
                    id="uniqueId"
                    placeholder="e.g., NB2024001"
                    value={formData.uniqueId}
                    onChange={(e) =>
                      handleInputChange("uniqueId", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    placeholder="e.g., SN001234"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Gg Perera"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    handleInputChange("birthDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) =>
                      handleInputChange("district", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {sriLankanDistricts.map((district) => (
                        <SelectItem
                          key={district}
                          value={district.toLowerCase()}
                        >
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division *</Label>
                  <Input
                    id="division"
                    placeholder="e.g., Colombo Central"
                    value={formData.division}
                    onChange={(e) =>
                      handleInputChange("division", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianNic">Guardian NIC *</Label>
                <Input
                  id="guardianNic"
                  placeholder="e.g., 199012345678"
                  value={formData.guardianNic}
                  onChange={(e) =>
                    handleInputChange("guardianNic", e.target.value)
                  }
                  required
                />
              </div>

              <Alert>
                <AlertDescription>
                  A secure password will be automatically generated for this
                  account. The guardian will receive the login credentials.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Newborn Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600">
                <CheckCircle className="w-5 h-5" />
                Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                The newborn account has been created. Here are the account
                details:
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
                  <span className="text-sm font-medium">Birth Date:</span>
                  <span className="text-sm">{formData.birthDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">District:</span>
                  <Badge variant="secondary">{formData.district}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Division:</span>
                  <span className="text-sm">{formData.division}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Serial Number:</span>
                  <span className="text-sm">{formData.serialNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Guardian NIC:</span>
                  <span className="text-sm">{formData.guardianNic}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Generated Password:
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="bg-white px-2 py-1 rounded text-xs">
                      {showPassword ? generatedPassword : "••••••••••"}
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
                  Please securely share these credentials with the guardian.
                  They should change the password upon first login.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  setFormData({
                    uniqueId: "",
                    name: "",
                    birthDate: "",
                    district: "",
                    division: "",
                    serialNumber: "",
                    guardianNic: "",
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
