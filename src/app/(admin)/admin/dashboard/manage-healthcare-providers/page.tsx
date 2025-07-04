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
  UserPlus,
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// roles
const availableRoles = ["Doctor", "Nurse", "Midwife"];

// mock data
const allProviders = [
  {
    id: "HP001",
    name: "Dr. Samantha Silva",
    email: "samantha.silva@cgh.lk",
    role: "Doctor",
  },
  {
    id: "HP002",
    name: "Nurse Mary Fernando",
    email: "mary.fernando@thk.lk",
    role: "Nurse",
  },
  {
    id: "HP003",
    name: "Dr. Kamal Perera",
    email: "kamal.perera@bhg.lk",
    role: "Doctor",
  },
  {
    id: "HP004",
    name: "Pharmacist John Dias",
    email: "john.dias@dha.lk",
    role: "Doctor",
  },
  {
    id: "HP005",
    name: "Dr. Mihan Jayawardena",
    email: "mihan.j@phb.lk",
    role: "Doctor",
  },
  {
    id: "HP006",
    name: "Nurse Lisa WW",
    email: "lisa.ww@dhn.lk",
    role: "Nurse",
  },
  {
    id: "HP007",
    name: "Medical Tech David Kumar",
    email: "david.kumar@pmcuj.lk",
    role: "Nurse",
  },
  {
    id: "HP008",
    name: "Dr. Anjali Wickramasinghe",
    email: "anjali.w@rhr.lk",
    role: "Doctor",
  },
  {
    id: "HP009",
    name: "Midwife Sarah Perera",
    email: "sarah.perera@hospital.lk",
    role: "Midwife",
  },
  {
    id: "HP010",
    name: "Midwife Kamala Silva",
    email: "kamala.silva@clinic.lk",
    role: "Midwife",
  },
  {
    id: "HP011",
    name: "Dr. Nimal Fernando",
    email: "nimal.fernando@hospital.lk",
    role: "Doctor",
  },
  {
    id: "HP012",
    name: "Nurse Priya Jayasinghe",
    email: "priya.j@medical.lk",
    role: "Nurse",
  },
];

export default function ManageHealthcareProviders() {
  const [providers, setProviders] = useState<typeof allProviders>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    nic: "",
    role: "",
  });

  // filter states
  const [filterRole, setFilterRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = providers.slice(startIndex, endIndex);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // generate next provider ID
  const generateProviderId = () => {
    const allIds = [...allProviders, ...providers].map((provider) =>
      Number.parseInt(provider.id.replace("HP", ""))
    );
    const nextId = Math.max(...allIds) + 1;
    return `HP${nextId.toString().padStart(3, "0")}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = generatePassword();
    setGeneratedPassword(password);

    // add new provider to the list
    const newProvider = {
      id: formData.id || generateProviderId(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    // add to both the current filtered results and the master list
    setProviders([...providers, newProvider]);
    allProviders.push(newProvider);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Healthcare Provider Added Successfully",
      description: "The healthcare provider account has been created",
    });
  };

  // apply filters
  const handleApplyFilter = () => {
    if (!filterRole && !searchQuery.trim()) {
      toast({
        title: "Filter Required",
        description: "Please select a role or enter a search term",
        variant: "destructive",
      });
      return;
    }

    setIsFilterLoading(true);

    // simulate API call delay
    setTimeout(() => {
      let filteredProviders = allProviders;

      // filter by role
      if (filterRole) {
        filteredProviders = filteredProviders.filter(
          (provider) => provider.role === filterRole
        );
      }

      // apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredProviders = filteredProviders.filter(
          (provider) =>
            provider.name.toLowerCase().includes(query) ||
            provider.email.toLowerCase().includes(query) ||
            provider.id.toLowerCase().includes(query) ||
            provider.role.toLowerCase().includes(query)
        );
      }

      setProviders(filteredProviders);
      setCurrentPage(1);
      setHasAppliedFilter(true);
      setIsFilterLoading(false);
    }, 1000);
  };

  // clear filters
  const handleClearFilter = () => {
    setFilterRole("");
    setSearchQuery("");
    setProviders([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
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
    setFormData({ id: "", name: "", email: "", nic: "", role: "" });
    setGeneratedPassword("");
    setCopiedField("");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "nurse":
        return "bg-green-100 text-green-800";
      case "midwife":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // get active filter description
  const getActiveFilters = () => {
    const filters = [];
    if (filterRole) {
      filters.push(`Role: ${filterRole}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  const handleViewDetails = (provider: any) => {
    setSelectedProvider(provider);
    setIsViewDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserPlus className="w-8 h-8 mr-3 text-red-600" />
              Manage Healthcare Providers
            </h1>
            <p className="text-gray-600">
              View and manage healthcare provider accounts in the system
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Healthcare Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Healthcare Provider</DialogTitle>
                <DialogDescription>
                  Enter the details for the new healthcare provider account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Unique ID (Optional)</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="e.g., HP013 (auto-generated if empty)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange("role", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Dr. Samantha Silva"
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
                    placeholder="e.g., samantha.silva@hospital.lk"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nic">NIC Number *</Label>
                  <Input
                    id="nic"
                    value={formData.nic}
                    onChange={(e) => handleInputChange("nic", e.target.value)}
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
                        Adding...
                      </>
                    ) : (
                      "Add Healthcare Provider"
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

        {/* filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 mr-2 text-red-600" />
              Filter Healthcare Providers
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Filter by role, search by name/email/ID, or use both together
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* role filter */}
              <div className="space-y-2">
                <Label>Role (Optional)</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="bg-transparent">
                    <SelectValue placeholder="Select role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    disabled={!filterRole && !searchQuery.trim()}
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
                    Please select a role, enter a search term, or use both to
                    view healthcare providers.
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
                Healthcare Providers
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {providers.length === 0
                  ? "No healthcare providers found matching your criteria"
                  : `Found ${providers.length} healthcare provider${
                      providers.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {providers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No healthcare providers found. Try adjusting your filters.
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
                            Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Email Address
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Role
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProviders.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {provider.id}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[120px] truncate">
                                {provider.name}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[150px] truncate">
                                {provider.email}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge
                                className={getRoleBadgeColor(provider.role)}
                              >
                                {provider.role}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge variant="secondary">Active</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1 md:space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(provider)}
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
                      {Math.min(endIndex, providers.length)} of{" "}
                      {providers.length} providers
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
              <DialogTitle>Healthcare Provider Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected healthcare provider
              </DialogDescription>
            </DialogHeader>
            {selectedProvider && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Provider ID</Label>
                      <p className="text-sm">{selectedProvider.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm">{selectedProvider.name}</p>
                    </div>
                    <Badge className={getRoleBadgeColor(selectedProvider.role)}>
                      {selectedProvider.role}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Email Address
                      </Label>
                      <p className="text-sm">{selectedProvider.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Role</Label>
                      <Badge
                        className={getRoleBadgeColor(selectedProvider.role)}
                      >
                        {selectedProvider.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="secondary">Active</Badge>
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
                Healthcare Provider Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The healthcare provider account has been created with the
                following details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Unique ID</p>
                    <p className="text-sm text-gray-600">
                      {formData.id || "Auto-generated"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(formData.id, "Unique ID")}
                  >
                    {copiedField === "Unique ID" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-gray-600">{formData.name}</p>
                  </div>
                  <Badge className={getRoleBadgeColor(formData.role)}>
                    {formData.role}
                  </Badge>
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
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">NIC Number</p>
                    <p className="text-sm text-gray-600">{formData.nic}</p>
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
                  Add Another Provider
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
