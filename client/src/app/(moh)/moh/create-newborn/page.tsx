/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState } from "react";
import {
  Baby,
  User,
  Calendar,
  MapPin,
  BadgeIcon as IdCard,
  CheckCircle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MOHLayout } from "@/components/moh-layout";

const districts = [
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
  "Moneragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export default function CreateNewbornAccount() {
  const [formData, setFormData] = useState({
    uniqueId: "",
    fullName: "",
    birthDate: "",
    district: "",
    guardianNic: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    // validate required fields
    if (
      !formData.uniqueId ||
      !formData.fullName ||
      !formData.birthDate ||
      !formData.district ||
      !formData.guardianNic
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // validate NIC format
    const nicPattern = /^(\d{9}[vVxX]|\d{12})$/;
    if (!nicPattern.test(formData.guardianNic)) {
      toast({
        title: "Error",
        description: "Please enter a valid NIC number",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // simulate API call
    setTimeout(() => {
      const password = generatePassword();
      setGeneratedPassword(password);
      setShowSuccessDialog(true);
      setIsSubmitting(false);

      toast({
        title: "Success",
        description: "Newborn account created successfully",
      });
    }, 2000);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      uniqueId: "",
      fullName: "",
      birthDate: "",
      district: "",
      guardianNic: "",
    });
    setShowSuccessDialog(false);
    setGeneratedPassword("");
  };

  return (
    <MOHLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Baby className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create Newborn Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Register a new citizen account for newborn babies
          </p>
        </div>

        {/* form */}
        <Card>
          <CardHeader>
            <CardTitle>Newborn Registration Form</CardTitle>
            <CardDescription>
              Please fill in all required information to create a new citizen
              account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uniqueId" className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    Unique ID *
                  </Label>
                  <Input
                    id="uniqueId"
                    value={formData.uniqueId}
                    onChange={(e) =>
                      setFormData({ ...formData, uniqueId: e.target.value })
                    }
                    placeholder="Enter unique identifier (e.g., NB004)"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will become the citizen account ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="birthDate"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Birth Date *
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    District *
                  </Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) =>
                      setFormData({ ...formData, district: value })
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label
                    htmlFor="guardianNic"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Guardian NIC *
                  </Label>
                  <Input
                    id="guardianNic"
                    value={formData.guardianNic}
                    onChange={(e) =>
                      setFormData({ ...formData, guardianNic: e.target.value })
                    }
                    placeholder="Enter guardian's NIC number"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: 123456789V or 123456789012
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Account Created Successfully
              </DialogTitle>
              <DialogDescription>
                The newborn account has been created with the following details:
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* account details */}
              <div className="bg-green-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-green-800">Account Details</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account ID:</span>
                    <span className="font-medium">{formData.uniqueId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Full Name:</span>
                    <span className="font-medium">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birth Date:</span>
                    <span className="font-medium">
                      {new Date(formData.birthDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District:</span>
                    <span className="font-medium">{formData.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guardian NIC:</span>
                    <span className="font-medium">{formData.guardianNic}</span>
                  </div>
                </div>
              </div>

              {/* generated password */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-blue-800">
                  Generated Password
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white p-2 rounded border font-mono text-sm">
                    {showPassword ? generatedPassword : "••••••••••••"}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={copyPassword}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-blue-700">
                  Please save this password securely. It will be needed for
                  account access.
                </p>
              </div>

              {/* important notes */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">
                  Important Notes
                </h4>
                <ul className="text-xs text-amber-700 space-y-1">
                  <li>• The account is now active and ready for use</li>
                  <li>
                    • Share the login credentials securely with the guardian
                  </li>
                  <li>• The password can be changed after first login</li>
                  <li>
                    • Keep a record of the account ID for future reference
                  </li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
              <Button variant="outline" onClick={handleReset}>
                Create Another Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MOHLayout>
  );
}
