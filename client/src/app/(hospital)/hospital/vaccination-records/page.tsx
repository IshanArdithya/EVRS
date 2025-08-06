/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { HospitalLayout } from "@/app/(hospital)/hospital/components/hospital-layout";
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
import { Vaccine } from "@/types";
import api from "@/lib/api";
import { format } from "date-fns";
import { useUser } from "@/context/UserContext";

export default function HospitalDashboard() {
  const [citizenId, setCitizenId] = useState("");
  const [citizenData, setCitizenData] = useState<any>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
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
  const { hospital, loading } = useUser();

  const [generatedVaccinationId, setGeneratedVaccinationId] = useState("");
  const [citizenError, setCitizenError] = useState("");

  const selectedVac = vaccines.find(
    (v) => v.vaccineId === formData.vaccinationType
  );
  const vacName = selectedVac?.name || formData.vaccinationType;

  useEffect(() => {
    if (!isAddDialogOpen) return;
    api
      .get<Vaccine[]>("/admin/vaccines")
      .then((res) => setVaccines(res.data))
      .catch((err) => console.error("Failed to load vaccines", err));
  }, [isAddDialogOpen]);

  if (loading) {
    return (
      <HospitalLayout>
        <p>Loading your profile…</p>
      </HospitalLayout>
    );
  }

  if (!hospital) {
    return (
      <HospitalLayout>
        <p>Please log in to view your dashboard.</p>
      </HospitalLayout>
    );
  }

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

    try {
      const response = await api.get(`/shared/vaccinations/${citizenId}`);

      const { patient, records } = response.data;

      setCitizenData({
        name: `${patient.firstName} ${patient.lastName}`,
        id: patient.citizenId,
        birthDate: patient.birthDate,
        vaccinations: records,
      });

      toast({
        title: "Citizen Found",
        description: `Loaded vaccination records for ${patient.firstName} ${patient.lastName}`,
      });
    } catch (error: any) {
      setCitizenData(null);
      toast({
        title: "Citizen Not Found",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const validateCitizen = async (citizenId: string): Promise<boolean> => {
    try {
      await api.get<unknown>(`/admin/patient/${citizenId}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddVaccination = () => {
    setFormData((prev) => ({ ...prev, citizenId: citizenId }));
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hospital.hospitalId) {
      toast({
        title: "Missing Hospital ID",
        description: "Re-login required. Your session may have expired.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const citizenExists = await validateCitizen(formData.citizenId);
    if (!citizenExists) {
      setCitizenError("Citizen not found. Please enter a valid ID");
      setIsLoading(false);
      return;
    }
    setCitizenError("");

    try {
      const payload = {
        citizenId: formData.citizenId,
        vaccineId: formData.vaccinationType,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        recordedById: hospital.hospitalId,
        recordedByRole: hospital.mainRole,
        vaccinationLocation: formData.vaccinationLocation,
        division: formData.division,
        additionalNotes: formData.notes || "",
      };

      const { data } = await api.post("/shared/add-vaccination", payload);

      setGeneratedVaccinationId(data.record.vaccinationId);
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      toast({
        title: "Vaccination Added",
        description: `Record ${data.record.vaccinationId} created!`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add record.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    <HospitalLayout>
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
                  placeholder="e.g., C6660830450"
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
                  <CardDescription>(ID: {citizenData.id})</CardDescription>
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
                  <Label className="text-sm font-medium">Birth Date</Label>
                  <p className="text-sm text-gray-600">
                    {format(new Date(citizenData.birthDate), "yyyy/MM/dd")}
                  </p>
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
              <CardDescription>Complete vaccination history</CardDescription>
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
                        <TableHead>Vaccine Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Division</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citizenData.vaccinations.map(
                        (vaccination: any, i: any) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge
                                className={getVaccineBadgeColor(
                                  vaccination.vaccinationType
                                )}
                              >
                                {vaccination.vaccineName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {format(
                                  new Date(vaccination.createdAt),
                                  "yyyy/MM/dd"
                                )}
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
                                  {vaccination.vaccinationLocation}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{vaccination.division}</TableCell>
                            <TableCell>
                              <div className="max-w-[150px] truncate">
                                {vaccination.additionalNotes}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
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
                {citizenError && (
                  <p className="text-sm text-red-600">{citizenError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccinationType">Vaccine Name *</Label>
                <Select
                  value={formData.vaccinationType}
                  onValueChange={(value) =>
                    handleInputChange("vaccinationType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccines.map((v) => (
                      <SelectItem key={v.vaccineId} value={v.vaccineId}>
                        {v.name}
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
                <Input
                  id="vaccinationLocation"
                  value={formData.vaccinationLocation}
                  onChange={(e) =>
                    handleInputChange("vaccinationLocation", e.target.value)
                  }
                  placeholder="e.g., Colombo General Hospital"
                  required
                />
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
                  <p className="text-sm font-medium">Vaccination ID</p>
                  <p className="text-sm text-gray-600">
                    {generatedVaccinationId}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Citizen</p>
                  <p className="text-sm text-gray-600">
                    {citizenData?.name} ({formData.citizenId})
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccine Name</p>
                  <Badge
                    className={getVaccineBadgeColor(formData.vaccinationType)}
                  >
                    {vacName}
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
    </HospitalLayout>
  );
}
