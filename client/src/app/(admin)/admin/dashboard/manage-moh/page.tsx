/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Copy,
  Check,
  ChevronsUpDown,
  Search,
  Filter,
  Building2,
} from "lucide-react";
import { AdminDashboardLayout } from "@/components/admin-dashboard-layout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const provincesData = {
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

const provinces = Object.keys(provincesData);

// mock data
const allMohAccounts = [
  {
    id: "MOH001",
    name: "MOH-Colombo",
    contactNo: "+94 77 123 4567",
    email: "colombo@moh.gov.lk",
    province: "Western",
    district: "Colombo",
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "MOH002",
    name: "MOH-Gampaha",
    contactNo: "+94 71 234 5678",
    email: "gampaha@moh.gov.lk",
    province: "Western",
    district: "Gampaha",
    status: "Active",
    createdDate: "2024-01-20",
  },
  {
    id: "MOH003",
    name: "MOH-Kalutara",
    contactNo: "+94 76 345 6789",
    email: "kalutara@moh.gov.lk",
    province: "Western",
    district: "Kalutara",
    status: "Inactive",
    createdDate: "2024-02-01",
  },
  {
    id: "MOH004",
    name: "MOH-Kandy",
    contactNo: "+94 78 456 7890",
    email: "kandy@moh.gov.lk",
    province: "Central",
    district: "Kandy",
    status: "Active",
    createdDate: "2024-02-10",
  },
  {
    id: "MOH005",
    name: "MOH-Matale",
    contactNo: "+94 75 567 8901",
    email: "matale@moh.gov.lk",
    province: "Central",
    district: "Matale",
    status: "Active",
    createdDate: "2024-02-15",
  },
  {
    id: "MOH006",
    name: "MOH-Nuwara Eliya",
    contactNo: "+94 77 678 9012",
    email: "nuwaraeliya@moh.gov.lk",
    province: "Central",
    district: "Nuwara Eliya",
    status: "Active",
    createdDate: "2024-02-20",
  },
  {
    id: "MOH007",
    name: "MOH-Galle",
    contactNo: "+94 71 789 0123",
    email: "galle@moh.gov.lk",
    province: "Southern",
    district: "Galle",
    status: "Inactive",
    createdDate: "2024-03-01",
  },
  {
    id: "MOH008",
    name: "MOH-Matara",
    contactNo: "+94 76 890 1234",
    email: "matara@moh.gov.lk",
    province: "Southern",
    district: "Matara",
    status: "Active",
    createdDate: "2024-03-05",
  },
  {
    id: "MOH009",
    name: "MOH-Jaffna",
    contactNo: "+94 78 901 2345",
    email: "jaffna@moh.gov.lk",
    province: "Northern",
    district: "Jaffna",
    status: "Active",
    createdDate: "2024-03-10",
  },
  {
    id: "MOH010",
    name: "MOH-Batticaloa",
    contactNo: "+94 75 012 3456",
    email: "batticaloa@moh.gov.lk",
    province: "Eastern",
    district: "Batticaloa",
    status: "Active",
    createdDate: "2024-03-15",
  },
];

export default function ManageMOHPage() {
  const [mohAccounts, setMohAccounts] = useState<typeof allMohAccounts>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    contactNo: "",
    email: "",
    province: "",
    district: "",
  });
  const [createdAccount, setCreatedAccount] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const itemsPerPage = 5;
  const totalPages = Math.ceil(mohAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAccounts = mohAccounts.slice(startIndex, endIndex);

  // get districts for selected province (filter)
  const getFilterDistricts = () => {
    return filterProvince
      ? provincesData[filterProvince as keyof typeof provincesData] || []
      : [];
  };

  // get districts for selected province (form)
  const getFormDistricts = () => {
    return newAccount.province
      ? provincesData[newAccount.province as keyof typeof provincesData] || []
      : [];
  };

  // generate next MOH ID
  const generateMohId = () => {
    const allIds = [...allMohAccounts, ...mohAccounts].map((account) =>
      Number.parseInt(account.id.replace("MOH", ""))
    );
    const nextId = Math.max(...allIds) + 1;
    return `MOH${nextId.toString().padStart(3, "0")}`;
  };

  // generate random password
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
      toast.error("Please select a province or enter a search term");
      return;
    }

    setIsLoading(true);

    // simulate API call delay
    setTimeout(() => {
      let filteredAccounts = allMohAccounts;

      // filter by province and district
      if (filterProvince) {
        filteredAccounts = filteredAccounts.filter(
          (account) => account.province === filterProvince
        );

        if (filterDistrict) {
          filteredAccounts = filteredAccounts.filter(
            (account) => account.district === filterDistrict
          );
        }
      }

      // apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredAccounts = filteredAccounts.filter(
          (account) =>
            account.name.toLowerCase().includes(query) ||
            account.email.toLowerCase().includes(query) ||
            account.id.toLowerCase().includes(query) ||
            account.district.toLowerCase().includes(query)
        );
      }

      setMohAccounts(filteredAccounts);
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
    setMohAccounts([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
  };

  const handleAddAccount = () => {
    if (
      !newAccount.name ||
      !newAccount.contactNo ||
      !newAccount.email ||
      !newAccount.province ||
      !newAccount.district
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const mohId = generateMohId();
    const password = generatePassword();

    const accountToAdd = {
      id: mohId,
      name: newAccount.name,
      contactNo: newAccount.contactNo,
      email: newAccount.email,
      province: newAccount.province,
      district: newAccount.district,
      status: "Active",
      createdDate: new Date().toISOString().split("T")[0],
    };

    // add to both the current filtered results and the master list
    setMohAccounts((prev) => [...prev, accountToAdd]);
    allMohAccounts.push(accountToAdd);

    setCreatedAccount({ ...accountToAdd, password });
    setNewAccount({
      name: "",
      contactNo: "",
      email: "",
      province: "",
      district: "",
    });
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);
    toast.success("MOH account created successfully!");
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
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

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const handleViewDetails = (account: any) => {
    setSelectedAccount(account);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-red-600" />
              Manage MOH
            </h1>
            <p className="text-muted-foreground">
              Manage Ministry of Health accounts and permissions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Register MOH Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New MOH Account</DialogTitle>
                <DialogDescription>
                  Create a new Ministry of Health account. A secure password
                  will be generated automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">MOH Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={newAccount.name}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    placeholder="+94 XX XXX XXXX"
                    value={newAccount.contactNo}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        contactNo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@moh.gov.lk"
                    value={newAccount.email}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Province</Label>
                  <Popover
                    open={openFormProvince}
                    onOpenChange={setOpenFormProvince}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFormProvince}
                        className="justify-between bg-transparent"
                      >
                        {newAccount.province || "Select province..."}
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
                                    currentValue === newAccount.province
                                      ? ""
                                      : currentValue;
                                  setNewAccount({
                                    ...newAccount,
                                    province: selectedProvince,
                                    district: "",
                                  });
                                  setOpenFormProvince(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newAccount.province === province
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
                <div className="grid gap-2">
                  <Label>District</Label>
                  <Popover
                    open={openFormDistrict}
                    onOpenChange={setOpenFormDistrict}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFormDistrict}
                        className="justify-between bg-transparent"
                        disabled={!newAccount.province}
                      >
                        {newAccount.district || "Select district..."}
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
                                    currentValue === newAccount.district
                                      ? ""
                                      : currentValue;
                                  setNewAccount({
                                    ...newAccount,
                                    district: selectedDistrict,
                                  });
                                  setOpenFormDistrict(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    newAccount.district === district
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
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleAddAccount}
                >
                  Create Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* filter section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 mr-2 text-red-600" />
              Filter MOH Accounts
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter by province and district, search by name/email/ID, or use
              both together
            </p>
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
                                setFilterDistrict(""); // Reset district when province changes
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
                    to view MOH accounts.
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
                MOH Accounts
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {mohAccounts.length === 0
                  ? "No MOH accounts found matching your criteria"
                  : `Found ${mohAccounts.length} MOH account${
                      mohAccounts.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </p>
            </CardHeader>
            <CardContent>
              {mohAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No MOH accounts found. Try adjusting your filters.
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
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            MOH Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Contact No
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
                        {currentAccounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {account.id}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[120px] truncate">
                                {account.name}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {account.contactNo}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[150px] truncate">
                                {account.email}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {account.district}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge
                                variant={
                                  account.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {account.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {account.createdDate}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 md:space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(account)}
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
                      {Math.min(endIndex, mohAccounts.length)} of{" "}
                      {mohAccounts.length} MOH accounts
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
              <DialogTitle>MOH Account Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected MOH account
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">MOH ID</Label>
                      <p className="text-sm">{selectedAccount.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">MOH Name</Label>
                      <p className="text-sm">{selectedAccount.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Contact Number
                      </Label>
                      <p className="text-sm">{selectedAccount.contactNo}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Email Address
                      </Label>
                      <p className="text-sm">{selectedAccount.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Province</Label>
                      <p className="text-sm">{selectedAccount.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">District</Label>
                      <p className="text-sm">{selectedAccount.district}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge
                        variant={
                          selectedAccount.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedAccount.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Created Date
                      </Label>
                      <p className="text-sm">{selectedAccount.createdDate}</p>
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
                Account Created Successfully!
              </DialogTitle>
              <DialogDescription>
                The MOH account has been created. Please save these credentials
                securely.
              </DialogDescription>
            </DialogHeader>
            {createdAccount && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">MOH ID</Label>
                      <p className="text-sm">{createdAccount.id}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(createdAccount.id, "MOH ID")
                      }
                    >
                      {copiedField === "MOH ID" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">{createdAccount.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Province</Label>
                      <p className="text-sm">{createdAccount.province}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">District</Label>
                      <p className="text-sm">{createdAccount.district}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{createdAccount.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(createdAccount.email, "Email")
                      }
                    >
                      {copiedField === "Email" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-yellow-800">
                        Generated Password
                      </Label>
                      <p className="text-sm font-mono bg-yellow-100 px-2 py-1 rounded mt-1">
                        {createdAccount.password}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(createdAccount.password, "Password")
                      }
                    >
                      {copiedField === "Password" ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
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
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsSuccessDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminDashboardLayout>
  );
}
