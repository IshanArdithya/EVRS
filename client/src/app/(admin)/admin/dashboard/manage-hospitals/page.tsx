/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Building2,
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ChevronsUpDown,
  Hospital,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Province and District data
const provinceDistrictData = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
  Northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  Eastern: ["Ampara", "Batticaloa", "Trincomalee"],
  "North Western": ["Kurunegala", "Puttalam"],
  "North Central": ["Anuradhapura", "Polonnaruwa"],
  Uva: ["Badulla", "Monaragala"],
  Sabaragamuwa: ["Ratnapura", "Kegalle"],
};

const provinces = Object.keys(provinceDistrictData);

// mock data
const allHospitalsData = [
  {
    id: "H001",
    name: "Colombo General Hospital",
    email: "admin@cgh.lk",
    province: "Western",
    district: "Colombo",
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "H002",
    name: "Lady Ridgeway Hospital",
    email: "admin@lrh.lk",
    province: "Western",
    district: "Colombo",
    status: "Active",
    createdDate: "2024-01-20",
  },
  {
    id: "H003",
    name: "National Hospital of Sri Lanka",
    email: "admin@nhsl.lk",
    province: "Western",
    district: "Colombo",
    status: "Active",
    createdDate: "2024-01-25",
  },
  {
    id: "H004",
    name: "District General Hospital Gampaha",
    email: "admin@dghg.lk",
    province: "Western",
    district: "Gampaha",
    status: "Active",
    createdDate: "2024-02-01",
  },
  {
    id: "H005",
    name: "Base Hospital Negombo",
    email: "admin@bhn.lk",
    province: "Western",
    district: "Gampaha",
    status: "Inactive",
    createdDate: "2024-02-05",
  },
  {
    id: "H006",
    name: "Base Hospital Kalutara",
    email: "admin@bhk.lk",
    province: "Western",
    district: "Kalutara",
    status: "Active",
    createdDate: "2024-02-10",
  },
  {
    id: "H007",
    name: "District General Hospital Kalutara",
    email: "admin@dghk.lk",
    province: "Western",
    district: "Kalutara",
    status: "Active",
    createdDate: "2024-02-15",
  },
  {
    id: "H008",
    name: "Teaching Hospital Kandy",
    email: "admin@thk.lk",
    province: "Central",
    district: "Kandy",
    status: "Active",
    createdDate: "2024-02-20",
  },
  {
    id: "H009",
    name: "Peradeniya Teaching Hospital",
    email: "admin@pth.lk",
    province: "Central",
    district: "Kandy",
    status: "Active",
    createdDate: "2024-02-25",
  },
  {
    id: "H010",
    name: "Sirimavo Bandaranaike Specialized Children's Hospital",
    email: "admin@sbsch.lk",
    province: "Central",
    district: "Kandy",
    status: "Active",
    createdDate: "2024-03-01",
  },
  {
    id: "H011",
    name: "District General Hospital Matale",
    email: "admin@dghm.lk",
    province: "Central",
    district: "Matale",
    status: "Active",
    createdDate: "2024-03-05",
  },
  {
    id: "H012",
    name: "Base Hospital Nuwara Eliya",
    email: "admin@bhne.lk",
    province: "Central",
    district: "Nuwara Eliya",
    status: "Inactive",
    createdDate: "2024-03-10",
  },
  {
    id: "H013",
    name: "Teaching Hospital Karapitiya",
    email: "admin@thkar.lk",
    province: "Southern",
    district: "Galle",
    status: "Active",
    createdDate: "2024-03-15",
  },
  {
    id: "H014",
    name: "Base Hospital Galle",
    email: "admin@bhg.lk",
    province: "Southern",
    district: "Galle",
    status: "Active",
    createdDate: "2024-03-20",
  },
  {
    id: "H015",
    name: "Base Hospital Matara",
    email: "admin@bhm.lk",
    province: "Southern",
    district: "Matara",
    status: "Active",
    createdDate: "2024-03-25",
  },
  {
    id: "H016",
    name: "District General Hospital Hambantota",
    email: "admin@dghh.lk",
    province: "Southern",
    district: "Hambantota",
    status: "Active",
    createdDate: "2024-04-01",
  },
  {
    id: "H017",
    name: "Teaching Hospital Jaffna",
    email: "admin@thj.lk",
    province: "Northern",
    district: "Jaffna",
    status: "Active",
    createdDate: "2024-04-05",
  },
  {
    id: "H018",
    name: "Base Hospital Batticaloa",
    email: "admin@bhb.lk",
    province: "Eastern",
    district: "Batticaloa",
    status: "Active",
    createdDate: "2024-04-10",
  },
];

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  // filter states
  const [filterProvince, setFilterProvince] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);

  // combobox states for filters
  const [openFilterProvince, setOpenFilterProvince] = useState(false);
  const [openFilterDistrict, setOpenFilterDistrict] = useState(false);

  // combobox states for form
  const [openFormProvince, setOpenFormProvince] = useState(false);
  const [openFormDistrict, setOpenFormDistrict] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    province: "",
    district: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = hospitals.slice(startIndex, endIndex);

  // get districts for selected province (filter)
  const getFilterDistricts = () => {
    return filterProvince
      ? provinceDistrictData[
          filterProvince as keyof typeof provinceDistrictData
        ] || []
      : [];
  };

  // get districts for selected province (form)
  const getFormDistricts = () => {
    return formData.province
      ? provinceDistrictData[
          formData.province as keyof typeof provinceDistrictData
        ] || []
      : [];
  };

  // generate next Hospital ID
  const generateHospitalId = () => {
    const allIds = [...allHospitalsData, ...hospitals].map((hospital) =>
      Number.parseInt(hospital.id.replace("H", ""))
    );
    const nextId = Math.max(...allIds) + 1;
    return `H${nextId.toString().padStart(3, "0")}`;
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // apply filters
  const handleApplyFilter = () => {
    if (!filterProvince && !searchQuery.trim()) {
      toast({
        title: "Filter Required",
        description:
          "Please select a province or enter a search term to filter hospitals",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // simulate API call delay
    setTimeout(() => {
      let filteredHospitals = allHospitalsData;

      // filter by province and district
      if (filterProvince) {
        filteredHospitals = filteredHospitals.filter(
          (hospital) => hospital.province === filterProvince
        );

        if (filterDistrict) {
          filteredHospitals = filteredHospitals.filter(
            (hospital) => hospital.district === filterDistrict
          );
        }
      }

      // apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredHospitals = filteredHospitals.filter(
          (hospital) =>
            hospital.name.toLowerCase().includes(query) ||
            hospital.email.toLowerCase().includes(query) ||
            hospital.id.toLowerCase().includes(query) ||
            hospital.district.toLowerCase().includes(query)
        );
      }

      setHospitals(filteredHospitals);
      setCurrentPage(1);
      setHasAppliedFilter(true);
      setIsLoading(false);
    }, 1000);
  };

  // clear filters
  const handleClearFilter = () => {
    setFilterProvince("");
    setFilterDistrict("");
    setSearchQuery("");
    setHospitals([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.province ||
      !formData.district
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hospitalId = formData.id || generateHospitalId();
    const password = generatePassword();
    setGeneratedPassword(password);

    // add new hospital to the current filtered list if it matches the current filter
    const newHospital = {
      ...formData,
      id: hospitalId,
      status: "Active",
      createdDate: new Date().toISOString().split("T")[0],
    };

    // add to both the current filtered results and the master list
    if (hasAppliedFilter) {
      let shouldAddToResults = false;

      // check if new hospital matches current filters
      if (filterProvince && !searchQuery.trim()) {
        // province/district filter only
        shouldAddToResults =
          newHospital.province === filterProvince &&
          (!filterDistrict || newHospital.district === filterDistrict);
      } else if (!filterProvince && searchQuery.trim()) {
        // search filter only
        const query = searchQuery.toLowerCase();
        shouldAddToResults =
          newHospital.name.toLowerCase().includes(query) ||
          newHospital.email.toLowerCase().includes(query) ||
          newHospital.id.toLowerCase().includes(query) ||
          newHospital.district.toLowerCase().includes(query);
      } else if (filterProvince && searchQuery.trim()) {
        // both province/district and search filters
        const matchesLocation =
          newHospital.province === filterProvince &&
          (!filterDistrict || newHospital.district === filterDistrict);
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          newHospital.name.toLowerCase().includes(query) ||
          newHospital.email.toLowerCase().includes(query) ||
          newHospital.id.toLowerCase().includes(query) ||
          newHospital.district.toLowerCase().includes(query);
        shouldAddToResults = matchesLocation && matchesSearch;
      }

      if (shouldAddToResults) {
        setHospitals([...hospitals, newHospital]);
      }
    }

    // add to master list
    allHospitalsData.push(newHospital);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Hospital Added Successfully",
      description: "The hospital account has been created",
    });
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast({
        title: "Copied to clipboard",
        description: `${field} has been copied`,
      });
      setTimeout(() => setCopiedField(""), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", province: "", district: "" });
    setGeneratedPassword("");
    setCopiedField("");
  };

  // get active filter description
  const getActiveFilters = () => {
    const filters = [];
    if (filterProvince) {
      filters.push(`Province: ${filterProvince}`);
    }
    if (filterDistrict) {
      filters.push(`District: ${filterDistrict}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  };

  useEffect(() => {
    // fetch all hospitals initially
    // const allHospitals = getAllHospitals();
    // setHospitals(allHospitals);
  }, []);

  const handleViewDetails = (hospital: any) => {
    setSelectedHospital(hospital);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Hospital className="w-8 h-8 mr-3 text-red-600" />
              Manage Hospitals
            </h1>
            <p className="text-gray-600">
              View and manage hospital accounts in the system
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Register Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Hospital</DialogTitle>
                <DialogDescription>
                  Enter the details for the new hospital account. A secure
                  password will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Hospital ID (Optional)</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="Leave empty to auto-generate"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Hospital Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., General Hospital Colombo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g., admin@hospital.lk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Province *</Label>
                  <Popover
                    open={openFormProvince}
                    onOpenChange={setOpenFormProvince}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFormProvince}
                        className="w-full justify-between bg-transparent"
                      >
                        {formData.province || "Select province..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search province..." />
                        <CommandList>
                          <CommandEmpty>No province found.</CommandEmpty>
                          <CommandGroup>
                            {provinces.map((province) => (
                              <CommandItem
                                key={province}
                                value={province}
                                onSelect={(currentValue) => {
                                  const selectedProvince =
                                    currentValue === formData.province
                                      ? ""
                                      : currentValue;
                                  setFormData({
                                    ...formData,
                                    province: selectedProvince,
                                    district: "",
                                  });
                                  setOpenFormProvince(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.province === province
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {province}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>District *</Label>
                  <Popover
                    open={openFormDistrict}
                    onOpenChange={setOpenFormDistrict}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFormDistrict}
                        className="w-full justify-between bg-transparent"
                        disabled={!formData.province}
                      >
                        {formData.district || "Select district..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            {getFormDistricts().map((district) => (
                              <CommandItem
                                key={district}
                                value={district}
                                onSelect={(currentValue) => {
                                  const selectedDistrict =
                                    currentValue === formData.district
                                      ? ""
                                      : currentValue;
                                  setFormData({
                                    ...formData,
                                    district: selectedDistrict,
                                  });
                                  setOpenFormDistrict(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.district === district
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
                      "Register Hospital"
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
              Filter Hospitals
            </CardTitle>
            <CardDescription>
              Filter by province and district, search by name/email/ID, or use
              both together
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* province filter */}
              <div className="space-y-2">
                <Label>Province (Optional)</Label>
                <Popover
                  open={openFilterProvince}
                  onOpenChange={setOpenFilterProvince}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openFilterProvince}
                      className="w-full justify-between bg-transparent"
                    >
                      {filterProvince || "Select province..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search province..." />
                      <CommandList>
                        <CommandEmpty>No province found.</CommandEmpty>
                        <CommandGroup>
                          {provinces.map((province) => (
                            <CommandItem
                              key={province}
                              value={province}
                              onSelect={(currentValue) => {
                                const selectedProvince =
                                  currentValue === filterProvince
                                    ? ""
                                    : currentValue;
                                setFilterProvince(selectedProvince);
                                setFilterDistrict("");
                                setOpenFilterProvince(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filterProvince === province
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {province}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

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
                      disabled={!filterProvince}
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
                          {getFilterDistricts().map((district) => (
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

              {/* search filter */}
              <div className="space-y-2">
                <Label>Search (Optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, email, ID..."
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
                    disabled={!filterProvince && !searchQuery.trim()}
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
                    Please select a province, enter a search term, or use both
                    to view hospitals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
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
                Hospitals
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {hospitals.length === 0
                  ? "No hospitals found matching your criteria"
                  : `Found ${hospitals.length} hospital${
                      hospitals.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hospitals.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Hospitals Found
                  </h3>
                  <p className="text-gray-600">
                    No hospitals found matching your filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilter}
                    className="mt-4 bg-transparent"
                  >
                    Clear Filters
                  </Button>
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
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Hospital Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Email
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            District
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Created Date
                          </TableHead>
                          <TableHead className="whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentHospitals.map((hospital) => (
                          <TableRow key={hospital.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {hospital.id}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[150px] truncate">
                                {hospital.name}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[150px] truncate">
                                {hospital.email}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {hospital.district}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge
                                variant={
                                  hospital.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {hospital.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {hospital.createdDate}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 md:space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(hospital)}
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 p-1 md:p-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="sr-only">Delete</span>
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
                      {Math.min(endIndex, hospitals.length)} of{" "}
                      {hospitals.length} hospitals
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
              <DialogTitle>Hospital Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected hospital
              </DialogDescription>
            </DialogHeader>
            {selectedHospital && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Hospital ID</Label>
                      <p className="text-sm">{selectedHospital.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Hospital Name
                      </Label>
                      <p className="text-sm">{selectedHospital.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Email Address
                      </Label>
                      <p className="text-sm">{selectedHospital.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Province</Label>
                      <p className="text-sm">{selectedHospital.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">District</Label>
                      <p className="text-sm">{selectedHospital.district}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge
                        variant={
                          selectedHospital.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedHospital.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Created Date
                      </Label>
                      <p className="text-sm">{selectedHospital.createdDate}</p>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Hospital Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The hospital account has been created. Please save these
                credentials securely.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Hospital ID</p>
                    <p className="text-sm text-gray-600">{formData.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formData.id, "Hospital ID")}
                  >
                    {copiedField === "Hospital ID" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Hospital Name</p>
                    <p className="text-sm text-gray-600">{formData.name}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{formData.email}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formData.email, "Email")}
                  >
                    {copiedField === "Email" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Province</p>
                    <p className="text-sm text-gray-600">{formData.province}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">District</p>
                    <p className="text-sm text-gray-600">{formData.district}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Generated Password
                    </p>
                    <p className="text-sm font-mono bg-yellow-100 px-2 py-1 rounded mt-1">
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
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> Please save these credentials
                  securely. The password will not be shown again for security
                  reasons.
                </p>
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
                  Register Another Hospital
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
