/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  ChevronsUpDown,
  Search,
  Filter,
  Eye,
  FileUser,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

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

export default function ManageCitizens() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedCitizenId, setGeneratedCitizenId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    serialNumber: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    district: "",
    division: "",
    guardianNic: "",
  });

  // filter states
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // combobox states for filters
  const [openFilterDistrict, setOpenFilterDistrict] = useState(false);

  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(citizens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCitizens = citizens.slice(startIndex, endIndex);

  // apply filters
  const handleApplyFilter = async () => {
    if (!filterDistrict && !filterDivision.trim() && !searchQuery.trim()) {
      toast({
        title: "Filter Required",
        description:
          "Please select a district, enter a division, or enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsFilterLoading(true);

    try {
      const params: Record<string, string> = {};
      if (filterDistrict) params.district = filterDistrict;
      if (filterDivision.trim()) params.division = filterDivision.trim();
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const response = await api.get("/admin/patients", { params });

      setCitizens(response.data);
      setCurrentPage(1);
      setHasAppliedFilter(true);
    } catch (error) {
      toast({
        title: "Fetch Error",
        description: "Failed to fetch filtered citizens. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsFilterLoading(false);
    }
  };

  // clear filters
  const handleClearFilter = () => {
    setFilterDistrict("");
    setFilterDivision("");
    setSearchQuery("");
    setCitizens([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
  };

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
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/admin/register-patient", {
        serialNumber: formData.serialNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        district: formData.district,
        division: formData.division,
        guardianNIC: formData.guardianNic,
      });

      const { patient, message } = response.data;

      setGeneratedCitizenId(patient.citizenId);
      setGeneratedPassword(patient.password);

      // setCitizens((prev) => [
      //   ...prev,
      //   {
      //     ...formData,
      //     id: patient._id,
      //     citizenId: patient.citizenId,
      //     status: "Active",
      //     createdDate: new Date().toISOString().split("T")[0],
      //   },
      // ]);

      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);

      toast({
        title: "Citizen Added Successfully",
        description: message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add Citizen",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
    toast({
      title: "Copied to clipboard",
      description: `${field} has been copied`,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      serialNumber: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      district: "",
      division: "",
      guardianNic: "",
    });
    setGeneratedPassword("");
    setCopiedField("");
  };

  // get active filter description
  const getActiveFilters = () => {
    const filters = [];
    if (filterDistrict) {
      filters.push(`District: ${filterDistrict}`);
    }
    if (filterDivision) {
      filters.push(`Division: ${filterDivision}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<any>(null);

  const handleViewDetails = (citizen: any) => {
    setSelectedCitizen(citizen);
    setIsViewDialogOpen(true);
  };

  const RoleLabels: Record<string, string> = {
    admin: "Admin",
    hcp: "Healthcare Provider",
    hospital: "Hospital",
    moh: "Ministry of Health",
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileUser className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Citizens
              </h1>
              <p className="text-gray-600">
                View and manage citizen accounts in the system
              </p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Newborn Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Newborn Account</DialogTitle>
                <DialogDescription>
                  Enter the details for the new citizen account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      handleInputChange("serialNumber", e.target.value)
                    }
                    placeholder="e.g., SN001234"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="e.g., Amal"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="e.g., Perera"
                      required
                    />
                  </div>
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
                <div className="grid grid-cols-2 gap-2">
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
                          <SelectItem key={district} value={district}>
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
                      value={formData.division}
                      onChange={(e) =>
                        handleInputChange("division", e.target.value)
                      }
                      placeholder="e.g., Colombo 01"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guardianNic">Guardian NIC *</Label>
                  <Input
                    id="guardianNic"
                    value={formData.guardianNic}
                    onChange={(e) =>
                      handleInputChange("guardianNic", e.target.value)
                    }
                    placeholder="e.g., 199012345678"
                    required
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
                        Creating...
                      </>
                    ) : (
                      "Create Account"
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
              Filter Citizens
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter by district and division, search by name/email/ID, or use
              both together
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* district filter */}
              <div className="space-y-2">
                <Label>District (Optional)</Label>
                <Popover
                  open={openFilterDistrict}
                  onOpenChange={setOpenFilterDistrict}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFilterDistrict}
                      className="w-full justify-between bg-transparent"
                    >
                      {filterDistrict || "Select district..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search district..." />
                      <CommandList>
                        <CommandEmpty>No district found.</CommandEmpty>
                        <CommandGroup>
                          {sriLankanDistricts.map((district) => (
                            <CommandItem
                              key={district}
                              value={district}
                              onSelect={(currentValue) => {
                                const selectedDistrict =
                                  currentValue === filterDistrict
                                    ? ""
                                    : currentValue;
                                setFilterDistrict(selectedDistrict);
                                setOpenFilterDistrict(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filterDistrict === district
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {district}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* division filter */}
              <div className="space-y-2">
                <Label>Division (Optional)</Label>
                <Input
                  placeholder="Enter division..."
                  value={filterDivision}
                  onChange={(e) => setFilterDivision(e.target.value)}
                />
              </div>

              {/* search filter */}
              <div className="space-y-2">
                <Label>Search (Optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID..."
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
                      !filterDistrict &&
                      !filterDivision.trim() &&
                      !searchQuery.trim()
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
                    Please select a district, enter a division, or enter a
                    search term to view citizens.
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
                Citizens
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {citizens.length === 0
                  ? "No citizens found matching your criteria"
                  : `Found ${citizens.length} citizen${
                      citizens.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {citizens.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No citizens found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            ID
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            First Name
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Last Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            District
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Division
                          </TableHead>
                          {/* <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Status
                          </TableHead> */}
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentCitizens.map((citizen) => (
                          <TableRow key={citizen.citizenId}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {citizen.citizenId}
                            </TableCell>
                            <TableCell className="">
                              {citizen.firstName}
                            </TableCell>
                            <TableCell className="">
                              {citizen.lastName}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {citizen.district}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {citizen.division}
                            </TableCell>
                            {/* <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge variant="secondary">Active</Badge>
                            </TableCell> */}
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1 md:space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(citizen)}
                                  className="p-1 md:p-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 md:p-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </div>
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
                      {Math.min(endIndex, citizens.length)} of {citizens.length}{" "}
                      citizens
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
              <DialogTitle>Citizen Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected citizen
              </DialogDescription>
            </DialogHeader>
            {selectedCitizen && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Citizen ID</Label>
                      <p className="text-sm">{selectedCitizen.citizenId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">First Name</Label>
                      <p className="text-sm">{selectedCitizen.firstName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Last Name</Label>
                      <p className="text-sm">{selectedCitizen.lastName}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">District</Label>
                      <p className="text-sm">{selectedCitizen.district}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Division</Label>
                      <p className="text-sm">{selectedCitizen.division}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Recorded By</Label>
                      <p className="text-sm">
                        {selectedCitizen.recordedBy?.role &&
                        selectedCitizen.recordedBy?.id
                          ? `${
                              RoleLabels[selectedCitizen.recordedBy.role] ||
                              selectedCitizen.recordedBy.role
                            } - ${selectedCitizen.recordedBy.id}`
                          : selectedCitizen.recordedBy?.id}
                      </p>
                    </div>
                  </div>

                  {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div> */}
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
                Citizen Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                The newborn citizen account has been created with the following
                details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Citizen ID</p>
                    <p className="text-sm text-gray-600">
                      {generatedCitizenId}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(generatedCitizenId, "Citizen ID")
                    }
                  >
                    {copiedField === "Citizen ID" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">First Name</p>
                    <p className="text-sm text-gray-600">
                      {formData.firstName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Last Name</p>
                    <p className="text-sm text-gray-600">{formData.lastName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Birth Date</p>
                    <p className="text-sm text-gray-600">
                      {formData.birthDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">
                      {formData.division}, {formData.district}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Serial Number</p>
                    <p className="text-sm text-gray-600">
                      {formData.serialNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Guardian NIC</p>
                    <p className="text-sm text-gray-600">
                      {formData.guardianNic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Generated Password
                    </p>
                    <p className="text-sm font-mono text-green-600">
                      {generatedPassword}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(generatedPassword, "Password")
                    }
                  >
                    {copiedField === "Password" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
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
    </AdminDashboardLayout>
  );
}
