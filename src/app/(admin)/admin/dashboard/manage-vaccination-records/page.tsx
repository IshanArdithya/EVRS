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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Syringe,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const vaccineTypes = [
  "BCG",
  "Hepatitis B",
  "DPT",
  "Polio",
  "MMR",
  "Pneumococcal",
  "Rotavirus",
  "Influenza",
  "COVID-19",
  "Varicella",
  "HPV",
  "Meningococcal",
];

const healthcareProviders = [
  "Dr. Samantha Silva",
  "Dr. Kamal Fernando",
  "Dr. Mihan Jayawardena",
  "Nurse Nimal Perera",
  "Dr. Anjali Wickramasinghe",
  "Nurse Mary Fernando",
];

const vaccinationLocations = [
  "Colombo General Hospital",
  "Kandy Teaching Hospital",
  "Galle District Hospital",
  "Anuradhapura General Hospital",
  "Jaffna Teaching Hospital",
  "Batticaloa Hospital",
];

// mock data
const mockRecords = [
  {
    citizenId: "NB001",
    vaccinationType: "BCG",
    provider: "Dr. Samantha Silva",
    location: "Colombo General Hospital",
    date: "2024-01-15",
  },
  {
    citizenId: "NB002",
    vaccinationType: "Hepatitis B",
    provider: "Nurse Mary Fernando",
    location: "Kandy Teaching Hospital",
    date: "2024-01-16",
  },
  {
    citizenId: "NB003",
    vaccinationType: "DPT",
    provider: "Dr. Kamal Fernando",
    location: "Galle District Hospital",
    date: "2024-01-17",
  },
  {
    citizenId: "NB004",
    vaccinationType: "Polio",
    provider: "Dr. Mihan Jayawardena",
    location: "Anuradhapura General Hospital",
    date: "2024-01-18",
  },
  {
    citizenId: "NB005",
    vaccinationType: "MMR",
    provider: "Nurse Nimal Perera",
    location: "Jaffna Teaching Hospital",
    date: "2024-01-19",
  },
  {
    citizenId: "NB006",
    vaccinationType: "COVID-19",
    provider: "Dr. Anjali Wickramasinghe",
    location: "Batticaloa Hospital",
    date: "2024-01-20",
  },
  {
    citizenId: "NB007",
    vaccinationType: "Influenza",
    provider: "Dr. Samantha Silva",
    location: "Colombo General Hospital",
    date: "2024-01-21",
  },
  {
    citizenId: "NB008",
    vaccinationType: "Pneumococcal",
    provider: "Nurse Mary Fernando",
    location: "Kandy Teaching Hospital",
    date: "2024-01-22",
  },
];

export default function ManageVaccinationRecords() {
  const [records, setRecords] = useState(mockRecords);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    citizenId: "",
    vaccinationType: "",
    batchNumber: "",
    expiryDate: "",
    healthcareProvider: "",
    vaccinationLocation: "",
    notes: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // add new record
    const newRecord = {
      citizenId: formData.citizenId,
      vaccinationType: formData.vaccinationType,
      provider: formData.healthcareProvider,
      location: formData.vaccinationLocation,
      date: new Date().toISOString().split("T")[0],
    };
    setRecords([...records, newRecord]);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Vaccination Record Added Successfully",
      description: "The vaccination record has been added to the system",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      citizenId: "",
      vaccinationType: "",
      batchNumber: "",
      expiryDate: "",
      healthcareProvider: "",
      vaccinationLocation: "",
      notes: "",
    });
  };

  const getVaccineBadgeColor = (vaccine: string) => {
    const colors = {
      BCG: "bg-blue-100 text-blue-800",
      "Hepatitis B": "bg-green-100 text-green-800",
      DPT: "bg-purple-100 text-purple-800",
      Polio: "bg-orange-100 text-orange-800",
      MMR: "bg-red-100 text-red-800",
      "COVID-19": "bg-indigo-100 text-indigo-800",
    };
    return (
      colors[vaccine as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Syringe className="w-8 h-8 mr-3 text-red-600" />
              Manage Vaccination Records
            </h1>
            <p className="text-gray-600">
              View and manage vaccination records in the system
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vaccination Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Vaccination Record</DialogTitle>
                <DialogDescription>
                  Enter the details for the new vaccination record
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="citizenId">Citizen Account ID *</Label>
                  <Input
                    id="citizenId"
                    value={formData.citizenId}
                    onChange={(e) =>
                      handleInputChange("citizenId", e.target.value)
                    }
                    placeholder="e.g., NB009"
                    required
                  />
                </div>
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
                        <SelectItem key={vaccine} value={vaccine}>
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
                    value={formData.batchNumber}
                    onChange={(e) =>
                      handleInputChange("batchNumber", e.target.value)
                    }
                    placeholder="e.g., VB2024-001"
                    required
                  />
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
                        <SelectItem key={provider} value={provider}>
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
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {vaccinationLocations.map((location) => (
                        <SelectItem key={location} value={location}>
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
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any additional notes..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Record"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vaccination Records ({records.length})</CardTitle>
            <CardDescription>
              List of all vaccination records in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Citizen ID</TableHead>
                  <TableHead>Vaccination Type</TableHead>
                  <TableHead>Healthcare Provider</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {record.citizenId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getVaccineBadgeColor(record.vaccinationType)}
                      >
                        {record.vaccinationType}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.provider}</TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell>{record.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, records.length)}{" "}
                of {records.length} records
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog
          open={isSuccessDialogOpen}
          onOpenChange={setIsSuccessDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Vaccination Record Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The vaccination record has been added with the following
                details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Citizen ID</p>
                  <p className="text-sm text-gray-600">{formData.citizenId}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccination Type</p>
                  <Badge
                    className={getVaccineBadgeColor(formData.vaccinationType)}
                  >
                    {formData.vaccinationType}
                  </Badge>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Batch Number</p>
                  <p className="text-sm text-gray-600">
                    {formData.batchNumber}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Healthcare Provider</p>
                  <p className="text-sm text-gray-600">
                    {formData.healthcareProvider}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">
                    {formData.vaccinationLocation}
                  </p>
                </div>

                {formData.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-gray-600">{formData.notes}</p>
                  </div>
                )}

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Status</p>
                  <p className="text-sm text-green-600">
                    Successfully added to citizen&apos;s vaccination history
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsSuccessDialogOpen(false);
                    setIsAddDialogOpen(true);
                    resetForm();
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Add Another Record
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
    </AdminDashboardLayout>
  );
}
