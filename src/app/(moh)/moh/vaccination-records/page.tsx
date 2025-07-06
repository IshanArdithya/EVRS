/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState } from "react";
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
  Search,
  Plus,
  Loader2,
  User,
  Calendar,
  MapPin,
  Hash,
  FileUser,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOHLayout } from "@/components/moh-layout";

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

const vaccinationLocations = [
  "Colombo General Hospital",
  "Kandy Teaching Hospital",
  "Galle District Hospital",
  "Anuradhapura General Hospital",
  "Jaffna Teaching Hospital",
  "Batticaloa Hospital",
  "Matara District Hospital",
  "Kurunegala General Hospital",
  "Ratnapura Provincial Hospital",
];

// mmock citizen vaccination data
const mockCitizenData = {
  NB001: {
    name: "Amara Silva",
    nic: "199012345678",
    vaccinations: [
      {
        id: 1,
        vaccinationType: "BCG",
        date: "2024-01-15",
        batchNumber: "BCG001234",
        location: "Colombo General Hospital",
        provider: "Dr. Samantha Silva",
        division: "Colombo North",
        notes: "First dose administered successfully",
      },
      {
        id: 2,
        vaccinationType: "Hepatitis B",
        date: "2024-02-20",
        batchNumber: "HB567890",
        location: "Kandy Teaching Hospital",
        provider: "Nurse Mary Fernando",
        division: "Kandy Central",
        notes: "Second dose in series",
      },
    ],
  },
  NB002: {
    name: "Kamal Perera",
    nic: "198506789012",
    vaccinations: [
      {
        id: 3,
        vaccinationType: "COVID-19",
        date: "2024-01-10",
        batchNumber: "CV445566",
        location: "Galle District Hospital",
        provider: "Dr. Kamal Fernando",
        division: "Galle South",
        notes: "Booster dose administered",
      },
    ],
  },
  NB003: {
    name: "Nimal Fernando",
    nic: "199203456789",
    vaccinations: [
      {
        id: 4,
        vaccinationType: "DPT",
        date: "2024-03-05",
        batchNumber: "DPT778899",
        location: "Anuradhapura General Hospital",
        provider: "Dr. Mihan Jayawardena",
        division: "Anuradhapura East",
        notes: "Routine vaccination",
      },
      {
        id: 5,
        vaccinationType: "Polio",
        date: "2024-03-20",
        batchNumber: "PL334455",
        location: "Anuradhapura General Hospital",
        provider: "Nurse Nimal Perera",
        division: "Anuradhapura East",
        notes: "Follow-up dose",
      },
    ],
  },
};

export default function MOHDashboard() {
  const [citizenId, setCitizenId] = useState("");
  const [citizenData, setCitizenData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    citizenId: "",
    vaccinationType: "",
    batchNumber: "",
    expiryDate: "",
    vaccinationLocation: "",
    division: "",
    notes: "",
  });

  const { toast } = useToast();

  const handleSearchCitizen = async () => {
    if (!citizenId.trim()) {
      toast({
        title: "Citizen ID Required",
        description: "Please enter a citizen account ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const citizen = mockCitizenData[citizenId as keyof typeof mockCitizenData];
    if (citizen) {
      setCitizenData(citizen);
      toast({
        title: "Citizen Found",
        description: `Loaded vaccination records for ${citizen.name}`,
      });
    } else {
      setCitizenData(null);
      toast({
        title: "Citizen Not Found",
        description: "No citizen found with the provided ID",
        variant: "destructive",
      });
    }

    setIsSearching(false);
  };

  const handleAddVaccination = () => {
    setFormData((prev) => ({ ...prev, citizenId: citizenId }));
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Vaccination Record Added Successfully",
      description:
        "The vaccination record has been added to the citizen's profile",
    });

    // refresh citizen data
    handleSearchCitizen();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      citizenId: citizenId,
      vaccinationType: "",
      batchNumber: "",
      expiryDate: "",
      vaccinationLocation: "",
      division: "",
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
    <MOHLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileUser className="w-8 h-8 mr-3 text-primary" />
            Vaccination Records
          </h1>
          <p className="text-gray-600">
            View citizen vaccination records and add new vaccinations
          </p>
        </div>

        {/* search citizen section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Citizen
            </CardTitle>
            <CardDescription>
              Enter a citizen account ID to view their vaccination records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="citizenId">Citizen Account ID</Label>
                <Input
                  id="citizenId"
                  value={citizenId}
                  onChange={(e) => setCitizenId(e.target.value)}
                  placeholder="e.g., NB001"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearchCitizen}
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* citizen information and actions */}
        {citizenData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Citizen Information
                  </CardTitle>
                  <CardDescription>
                    {citizenData.name} (ID: {citizenId})
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddVaccination}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vaccination Record
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-gray-600">{citizenData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">NIC Number</Label>
                  <p className="text-sm text-gray-600">{citizenData.nic}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* action buttons */}
        {!citizenData && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button
                    disabled
                    className="bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vaccination Record
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Search for a citizen first to access vaccination services
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* vaccination records */}
        {citizenData && (
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
              <CardDescription>
                Complete vaccination history for {citizenData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {citizenData.vaccinations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No vaccination records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vaccination Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Division</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citizenData.vaccinations.map((vaccination: any) => (
                        <TableRow key={vaccination.id}>
                          <TableCell>
                            <Badge
                              className={getVaccineBadgeColor(
                                vaccination.vaccinationType
                              )}
                            >
                              {vaccination.vaccinationType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {vaccination.date}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Hash className="w-4 h-4 mr-2 text-gray-400" />
                              {vaccination.batchNumber}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <div className="max-w-[120px] truncate">
                                {vaccination.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{vaccination.provider}</TableCell>
                          <TableCell>{vaccination.division}</TableCell>
                          <TableCell>
                            <div className="max-w-[150px] truncate">
                              {vaccination.notes}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* add vaccination dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
              <DialogDescription>
                Enter the vaccination details for {citizenData?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citizenId">Citizen Account ID</Label>
                <Input
                  id="citizenId"
                  value={formData.citizenId}
                  disabled
                  className="bg-gray-50"
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
                <Label htmlFor="division">Division *</Label>
                <Input
                  id="division"
                  value={formData.division}
                  onChange={(e) =>
                    handleInputChange("division", e.target.value)
                  }
                  placeholder="e.g., Colombo North"
                  required
                />
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Vaccination Record"
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
                The vaccination record has been added to the citizen&apos;s
                profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Citizen</p>
                  <p className="text-sm text-gray-600">
                    {citizenData?.name} ({formData.citizenId})
                  </p>
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
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">
                    {formData.vaccinationLocation}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Division</p>
                  <p className="text-sm text-gray-600">{formData.division}</p>
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
                    resetForm();
                    setIsAddDialogOpen(true);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
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
    </MOHLayout>
  );
}
