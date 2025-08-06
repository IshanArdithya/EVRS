/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/context/UserContext";

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

interface CreateNewbornDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateNewbornDialog({
  open,
  onOpenChange,
}: CreateNewbornDialogProps) {
  const [formData, setFormData] = useState({
    serialNumber: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    district: "",
    division: "",
    guardianNic: "",
  });
  const { moh, loading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [generatedCitizenId, setGeneratedCitizenId] = useState("");

  if (loading) {
    return <Spinner />;
  }

  if (!moh) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.serialNumber ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate ||
      !formData.district ||
      !formData.division ||
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

    try {
      const response = await api.post("/shared/register-patient", {
        serialNumber: formData.serialNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        district: formData.district,
        division: formData.division,
        guardianNIC: formData.guardianNic,
        recordedBy: {
          id: moh.mohId,
          role: moh.mainRole,
        },
      });

      const { patient, message } = response.data;

      setGeneratedCitizenId(patient.citizenId);
      setGeneratedPassword(patient.password);

      setShowSuccessDialog(true);
      setIsSubmitting(false);

      toast({
        title: "Citizen Added Successfully",
        description: message,
      });

      // setFormData({
      //   serialNumber: "",
      //   firstName: "",
      //   lastName: "",
      //   birthDate: "",
      //   district: "",
      //   division: "",
      //   guardianNic: "",
      // });
    } catch (error: any) {
      toast({
        title: "Failed to Add Citizen",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFormData({
      serialNumber: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      district: "",
      division: "",
      guardianNic: "",
    });
    setShowSuccessDialog(false);
    setGeneratedPassword("");
    setShowPassword(false);
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  if (showSuccessDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <span className="text-muted-foreground">Citizen ID:</span>
                  <span className="font-medium">{generatedCitizenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Serial Number:</span>
                  <span className="font-medium">{formData.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Full Name:</span>
                  <span className="font-medium">{`${formData.firstName} ${formData.lastName}`}</span>
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
                  <span className="text-muted-foreground">Division:</span>
                  <span className="font-medium">{formData.division}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guardian NIC:</span>
                  <span className="font-medium">{formData.guardianNic}</span>
                </div>
              </div>
            </div>

            {/* generated password */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h4 className="font-medium text-blue-800">Generated Password</h4>
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
                  • Keep a record of the serial number for future reference
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
            <Button variant="outline" onClick={handleReset}>
              Create Another Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            Create Newborn Account
          </DialogTitle>
          <DialogDescription>
            Register a new citizen account for newborn babies
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Serial Number *
              </Label>
              <Input
                id="serialNumber"
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                placeholder="Enter serial number (e.g., SN001)"
                required
              />
              <p className="text-xs text-muted-foreground">
                This is in the birth certificate
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="division" className="flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  Division *
                </Label>
                <Input
                  id="division"
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({ ...formData, division: e.target.value })
                  }
                  placeholder="Enter division"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardianNic" className="flex items-center gap-2">
                <IdCard className="h-4 w-4" />
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

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
