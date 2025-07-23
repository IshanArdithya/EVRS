/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { VaccinationRecord, Vaccine } from "@/types";
import { format } from "date-fns";

export default function ManageVaccinationRecords() {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    citizenId: "",
    vaccinationType: "",
    batchNumber: "",
    expiryDate: "",
    healthcareProviderId: "",
    vaccinationLocation: "",
    division: "",
    notes: "",
  });

  // add validation states
  const [healthcareProviderError, setHealthcareProviderError] = useState("");

  // filter states
  const [filterLocation, setFilterLocation] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = records.slice(startIndex, endIndex);

  const [citizenError, setCitizenError] = useState("");
  const [generatedVaccinationId, setGeneratedVaccinationId] = useState("");
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

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

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record);
    setIsViewDialogOpen(true);
  };

  // apply filters
  const handleApplyFilter = async () => {
    if (!filterLocation && !filterDate && !searchQuery.trim()) {
      toast({
        title: "Filter Required",
        description: "Please select a location, date, or enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsFilterLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filterLocation) params.location = filterLocation;
      if (filterDate) params.date = filterDate;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await api.get("/admin/vaccinations", { params });
      setRecords(response.data);
      setCurrentPage(1);
      setHasAppliedFilter(true);
    } catch (err) {
      toast({
        title: "Fetch Error",
        description: "Failed to fetch records. Please try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsFilterLoading(false);
    }
  };

  // clear filters
  const handleClearFilter = () => {
    setFilterLocation("");
    setFilterDate("");
    setSearchQuery("");
    setRecords([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
  };

  // get active filter description
  const getActiveFilters = () => {
    const filters = [];
    if (filterLocation) {
      filters.push(`Location: ${filterLocation}`);
    }
    if (filterDate) {
      filters.push(`Date: ${filterDate}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // citizen format check
    if (!/^C\d{10}$/.test(formData.citizenId)) {
      setCitizenError("Citizen ID must be “C” + 10 digits");
      setIsLoading(false);
      return;
    }
    setCitizenError("");

    // HCP format check
    if (!/^HCP\d{10}$/.test(formData.healthcareProviderId)) {
      setHealthcareProviderError("HCP ID must be “HCP” + 10 digits");
      setIsLoading(false);
      return;
    }

    // verify citizen exists
    const citizenExists = await validateCitizen(formData.citizenId);
    if (!citizenExists) {
      setCitizenError("Citizen not found. Please enter a valid ID");
      setIsLoading(false);
      return;
    }
    setCitizenError("");

    // verify HCP exists
    const hcpExists = await validateHCP(formData.healthcareProviderId);
    if (!hcpExists) {
      setHealthcareProviderError(
        "Healthcare Provider not found. Please enter a valid ID"
      );
      setIsLoading(false);
      return;
    }
    setHealthcareProviderError("");

    // checks passed - submit to add-vaccination
    try {
      const payload = {
        citizenId: formData.citizenId,
        vaccineId: formData.vaccinationType,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        healthcareProviderId: formData.healthcareProviderId,
        vaccinationLocation: formData.vaccinationLocation,
        division: formData.division,
        additionalNotes: formData.notes || "",
      };

      const { data } = await api.post("/admin/add-vaccination", payload);

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
      citizenId: "",
      vaccinationType: "",
      batchNumber: "",
      expiryDate: "",
      healthcareProviderId: "",
      vaccinationLocation: "",
      division: "",
      notes: "",
    });
    setHealthcareProviderError("");
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

  const validateCitizen = async (citizenId: string): Promise<boolean> => {
    try {
      await api.get<unknown>(`/admin/patient/${citizenId}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateHCP = async (hcpId: string) => {
    try {
      await api.get<unknown>(`/admin/hcp/${hcpId}`);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
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
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("citizenId", value);

                      // validate citizen ID format
                      if (value && !value.match(/^C\d{10}$/)) {
                        setCitizenError(
                          "Citizen ID must start with 'C' followed by 10 digits"
                        );
                      } else {
                        setCitizenError("");
                      }
                    }}
                    placeholder="e.g., C1234567890"
                    pattern="^C\d{10}$"
                    required
                  />
                  {citizenError && (
                    <p className="text-sm text-red-600">{citizenError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccinationType">Vaccination Type *</Label>
                  <Select
                    value={formData.vaccinationType}
                    onValueChange={(val) =>
                      handleInputChange("vaccinationType", val)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine type" />
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
                  <Label htmlFor="healthcareProviderId">
                    Healthcare Provider ID *
                  </Label>
                  <Input
                    id="healthcareProviderId"
                    value={formData.healthcareProviderId}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleInputChange("healthcareProviderId", value);

                      // validate HCP ID format
                      if (value && !value.match(/^HCP\d{10}$/)) {
                        setHealthcareProviderError(
                          "Healthcare Provider ID must start with 'HCP' followed by 10 digits"
                        );
                      } else {
                        setHealthcareProviderError("");
                      }
                    }}
                    placeholder="e.g., HCP1234567890"
                    pattern="^HCP\d{10}$"
                    required
                  />
                  {healthcareProviderError && (
                    <p className="text-sm text-red-600">
                      {healthcareProviderError}
                    </p>
                  )}
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

        {/* filter section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 mr-2 text-red-600" />
              Filter Vaccination Records
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter by location and date, search by name/ID/provider, or use
              both together
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label>Location (Optional)</Label>
                <Input
                  placeholder="e.g., Colombo General Hospital"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>

              {/* date filter */}
              <div className="space-y-2">
                <Label>Date (Optional)</Label>
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              {/* search filter */}
              <div className="space-y-2">
                <Label>Search (Optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID, provider..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* action buttons */}
              <div className="space-y-2">
                <Label className="invisible">Actions</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilter}
                    disabled={
                      !filterLocation && !filterDate && !searchQuery.trim()
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filter
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearFilter}
                    disabled={!hasAppliedFilter}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* active filters display */}
            {hasAppliedFilter && getActiveFilters().length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Active Filters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map((filter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* results section */}
        {!hasAppliedFilter ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No Filter Applied
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Please select a location, date, enter a search term, or use
                    multiple filters to view vaccination records.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isFilterLoading ? (
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Vaccination Records
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {records.length === 0
                  ? "No vaccination records found matching your criteria"
                  : `Found ${records.length} vaccination record${
                      records.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vaccination records found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Vaccination ID
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Citizen ID
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Vaccine ID
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Recorded By
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Location
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Division
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Date
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentRecords.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {record.vaccinationId}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {record.citizenId}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge
                                className={getVaccineBadgeColor(
                                  record.vaccineId
                                )}
                              >
                                {record.vaccineId}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="max-w-[120px] truncate">
                                {record.recordedBy?.id}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[120px] truncate">
                                {record.vaccinationLocation}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {record.division}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {format(
                                new Date(record.createdAt),
                                "dd MMM yyyy, h:mm a"
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(record)}
                                className="p-1 md:p-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* pagination */}
                  <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, records.length)} of {records.length}{" "}
                      records
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="sr-only md:not-sr-only">Previous</span>
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
                        <span className="sr-only md:not-sr-only">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* view details dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Vaccination Record Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected vaccination record
              </DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Vaccination ID
                      </Label>
                      <p className="text-sm">{selectedRecord.vaccinationId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Citizen ID</Label>
                      <p className="text-sm">{selectedRecord.citizenId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Vaccine ID</Label>
                      <Badge
                        className={getVaccineBadgeColor(
                          selectedRecord.vaccineId
                        )}
                      >
                        {selectedRecord.vaccineId}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Recorded By</Label>
                      <p className="text-sm">{selectedRecord.recordedBy?.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Vaccination Location
                      </Label>
                      <p className="text-sm">
                        {selectedRecord.vaccinationLocation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Division</Label>
                      <p className="text-sm">{selectedRecord.division}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Vaccination Date
                      </Label>
                      <p className="text-sm">
                        {format(
                          new Date(selectedRecord.createdAt),
                          "dd MMM yyyy, h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </div>
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
                The vaccination record has been added with the following
                details:
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
                  <p className="text-sm font-medium">Citizen ID</p>
                  <p className="text-sm text-gray-600">{formData.citizenId}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccination Type</p>
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
                  <p className="text-sm font-medium">Healthcare Provider ID</p>
                  <p className="text-sm text-gray-600">
                    {formData.healthcareProviderId}
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
