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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Syringe,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  VolumeIcon as Vial,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const vaccineTypes = [
  "BCG",
  "Hepatitis B",
  "DPT",
  "Polio",
  "MMR",
  "COVID-19",
  "Influenza",
  "Pneumococcal",
  "Rotavirus",
  "Varicella",
];

const healthcareProviders = [
  "Dr. Samantha Silva",
  "Dr. Rajesh Kumar",
  "Nurse Mary Fernando",
  "Dr. Priya Jayawardena",
  "Nurse John Perera",
];

const vaccinationLocations = [
  "Colombo General Hospital",
  "Teaching Hospital Kandy",
  "Base Hospital Galle",
  "District Hospital Anuradhapura",
  "Provincial Hospital Badulla",
  "Divisional Hospital Negombo",
  "Primary Medical Care Unit Jaffna",
];

export default function AddVaccination() {
  const [formData, setFormData] = useState({
    citizenId: "",
    vaccinationType: "",
    batchNumber: "",
    expiryDate: "",
    healthcareProvider: "",
    vaccinationLocation: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setShowSuccess(true);
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Vaccination Record
          </h1>
          <p className="text-gray-600">
            Record a new vaccination for a citizen
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Syringe className="w-5 h-5 text-purple-600" />
              Vaccination Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to add a new vaccination record
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citizenId">Citizen Account ID *</Label>
                <Input
                  id="citizenId"
                  placeholder="e.g., NB2024001 or HP2024001"
                  value={formData.citizenId}
                  onChange={(e) =>
                    handleInputChange("citizenId", e.target.value)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vaccinationType">Vaccination Type *</Label>
                  <Select
                    value={formData.vaccinationType}
                    onValueChange={(value) =>
                      handleInputChange("vaccinationType", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccineTypes.map((vaccine) => (
                        <SelectItem key={vaccine} value={vaccine.toLowerCase()}>
                          {vaccine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number *</Label>
                  <Input
                    id="batchNumber"
                    placeholder="e.g., VB2024-001"
                    value={formData.batchNumber}
                    onChange={(e) =>
                      handleInputChange("batchNumber", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="healthcareProvider">
                  Healthcare Provider Name *
                </Label>
                <Select
                  value={formData.healthcareProvider}
                  onValueChange={(value) =>
                    handleInputChange("healthcareProvider", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select healthcare provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {healthcareProviders.map((provider) => (
                      <SelectItem key={provider} value={provider.toLowerCase()}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vaccinationLocation">
                  Vaccination Location *
                </Label>
                <Select
                  value={formData.vaccinationLocation}
                  onValueChange={(value) =>
                    handleInputChange("vaccinationLocation", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccination location" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccinationLocations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information about the vaccination..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={3}
                />
              </div>

              <Alert>
                <AlertDescription>
                  Please verify all information before submitting. This
                  vaccination record will be permanently added to the
                  citizen&apos;s medical history.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Adding Record..." : "Add Vaccination Record"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-purple-600">
                <CheckCircle className="w-5 h-5" />
                Vaccination Record Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The vaccination record has been successfully added to the
                citizen&apos;s medical history.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Citizen ID:</span>
                  <Badge variant="outline">{formData.citizenId}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Vial className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Vaccine:</span>
                  <Badge>{formData.vaccinationType}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Location:</span>
                  <span className="text-xs">
                    {formData.vaccinationLocation}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Batch Number:</span>
                  <span className="ml-2">{formData.batchNumber}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Healthcare Provider:</span>
                  <span className="ml-2">{formData.healthcareProvider}</span>
                </div>
                {formData.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes:</span>
                    <p className="text-gray-600 mt-1">{formData.notes}</p>
                  </div>
                )}
              </div>
              <Alert>
                <AlertDescription className="text-xs">
                  The citizen will be notified about this vaccination record via
                  their registered contact information.
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => {
                  setShowSuccess(false);
                  setFormData({
                    citizenId: "",
                    vaccinationType: "",
                    batchNumber: "",
                    expiryDate: "",
                    healthcareProvider: "",
                    vaccinationLocation: "",
                    notes: "",
                  });
                }}
                className="w-full"
              >
                Add Another Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}
