/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import { HospitalLayout } from "@/components/hospital-layout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Loader2,
  Baby,
  Calendar,
  MapPin,
  User,
  Key,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Moneragala",
  "Ratnapura",
  "Kegalle",
];

export default function CreateNewbornAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [formData, setFormData] = useState({
    uniqueId: "",
    fullName: "",
    birthDate: "",
    district: "",
    guardianNic: "",
  });

  const { toast } = useToast();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = generatePassword();
    setGeneratedPassword(password);
    setIsLoading(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Newborn Account Created Successfully",
      description:
        "The newborn account has been created with a secure password",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      uniqueId: "",
      fullName: "",
      birthDate: "",
      district: "",
      guardianNic: "",
    });
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopiedPassword(true);
      toast({
        title: "Password Copied",
        description: "The password has been copied to your clipboard",
      });
      setTimeout(() => setCopiedPassword(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserPlus className="w-8 h-8 mr-3 text-primary" />
            Create Newborn Account
          </h1>
          <p className="text-gray-600">
            Create a new vaccination account for a newborn citizen
          </p>
        </div>

        {/* create account form */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="w-5 h-5 text-primary" />
              Newborn Information
            </CardTitle>
            <CardDescription>
              Enter the details for the new newborn account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId">Unique ID *</Label>
                  <Input
                    id="uniqueId"
                    value={formData.uniqueId}
                    onChange={(e) =>
                      handleInputChange("uniqueId", e.target.value)
                    }
                    placeholder="e.g., NB2024001"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This will be the citizen&apos;s account ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    placeholder="e.g., Saman Kumara Silva"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) =>
                        handleInputChange("birthDate", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Select
                      value={formData.district}
                      onValueChange={(value) =>
                        handleInputChange("district", value)
                      }
                      required
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianNic">Guardian NIC *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="guardianNic"
                    value={formData.guardianNic}
                    onChange={(e) =>
                      handleInputChange("guardianNic", e.target.value)
                    }
                    placeholder="e.g., 199012345678"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  NIC number of the parent or guardian
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Newborn Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog
          open={isSuccessDialogOpen}
          onOpenChange={setIsSuccessDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-600 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                The newborn account has been created with the following details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">
                    Account Details
                  </p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">
                        Account ID:
                      </span>
                      <span className="text-sm font-medium text-green-800">
                        {formData.uniqueId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Full Name:</span>
                      <span className="text-sm font-medium text-green-800">
                        {formData.fullName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Birth Date</p>
                  <p className="text-sm text-gray-600">{formData.birthDate}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">District</p>
                  <p className="text-sm text-gray-600">{formData.district}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Guardian NIC</p>
                  <p className="text-sm text-gray-600">
                    {formData.guardianNic}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Generated Password
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyPassword}
                      className="h-6 px-2 text-xs bg-transparent"
                      disabled={copiedPassword}
                    >
                      {copiedPassword ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-white p-2 rounded border font-mono text-sm break-all">
                    {generatedPassword}
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Please save this password securely. It will be needed for
                    account access.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800">
                    Important Notes
                  </p>
                  <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                    <li>
                      • The account is now active and ready for vaccination
                      records
                    </li>
                    <li>
                      • Share the Account ID and password with the guardian
                    </li>
                    <li>• The password can be changed after first login</li>
                    <li>• Keep a secure record of these credentials</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsSuccessDialogOpen(false);
                    resetForm();
                    setGeneratedPassword("");
                    setCopiedPassword(false);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Create Another Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSuccessDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </HospitalLayout>
  );
}
