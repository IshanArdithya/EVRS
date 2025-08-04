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
  DialogFooter,
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
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

// roles
const availableRoles = ["doctor", "nurse", "midwife"];

export default function ManageHealthcareProviders() {
  const [providers, setProviders] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedHcpId, setGeneratedHcpId] = useState("");
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

  // edit dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  // delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  const [selectedProviderForDelete, setSelectedProviderForDelete] =
    useState<any>(null);
  const [deleteTimer, setDeleteTimer] = useState(0);
  const [deleteIntervalId, setDeleteIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(providers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProviders = providers.slice(startIndex, endIndex);

  const fetchProviders = async (params: Record<string, string> = {}) => {
    setIsFilterLoading(true);
    try {
      const response = await api.get("/admin/hcps", { params });
      setProviders(response.data);
      setCurrentPage(1);
      setHasAppliedFilter(Object.keys(params).length > 0);
    } catch (error) {
      toast({
        title: "Fetch Error",
        description: "Failed to fetch HCPs. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.email || !formData.nic) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/admin/register-hcp", {
        fullName: formData.name,
        role: formData.role,
        email: formData.email,
        nic: formData.nic,
      });

      const { hcp, message } = response.data;

      setGeneratedHcpId(hcp.hcpId);
      setGeneratedPassword(hcp.password);

      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      fetchProviders();

      toast({
        title: "MOH Account Added Successfully",
        description: message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add MOH Account",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // apply filters
  const handleApplyFilter = async () => {
    if (!filterRole && !searchQuery.trim()) {
      toast({
        title: "Filter Required",
        description: "Please select a role or enter a search term",
        variant: "destructive",
      });
      return;
    }

    const params: Record<string, string> = {};
    if (filterRole) params.role = filterRole;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    fetchProviders(params);
  };

  // clear filters
  const handleClearFilter = () => {
    setFilterRole("");
    setSearchQuery("");
    setHasAppliedFilter(false);
    fetchProviders();
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

  const getActiveFilters = () => {
    const filters = [];
    if (filterRole) {
      filters.push(
        `Role: ${filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}`
      );
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

  const RoleLabels: Record<string, string> = {
    admin: "Admin",
    hcp: "Healthcare Provider",
    hospital: "Hospital",
    moh: "Ministry of Health",
  };

  const handleEditClick = (provider: any) => {
    setEditFormData({
      id: provider.hcpId,
      fullName: provider.fullName,
      email: provider.email,
      role: provider.role,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.fullName || !editFormData.email || !editFormData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/admin/hcp/${editFormData.id}`, {
        fullName: editFormData.fullName,
        email: editFormData.email,
        role: editFormData.role,
      });
      toast({
        title: "Healthcare Provider Updated",
        description: response.data.message,
      });
      setIsEditDialogOpen(false);
      fetchProviders();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (provider: any) => {
    setSelectedProviderForDelete(provider);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDeleteClick = () => {
    setIsDeleteDialogOpen(false);
    setIsConfirmDeleteDialogOpen(true);
    setDeleteTimer(5);

    const interval = setInterval(() => {
      setDeleteTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setDeleteIntervalId(interval);
  };

  const handleCancelDelete = () => {
    setIsConfirmDeleteDialogOpen(false);
    setDeleteTimer(0);
    if (deleteIntervalId) {
      clearInterval(deleteIntervalId);
      setDeleteIntervalId(null);
    }
  };

  const handleFinalDelete = async () => {
    if (deleteTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await api.delete(
        `/admin/hcp/${selectedProviderForDelete.hcpId}`
      );
      toast({
        title: "Healthcare Provider Deleted",
        description: response.data.message,
      });
      setIsConfirmDeleteDialogOpen(false);
      fetchProviders();
    } catch (error: any) {
      toast({
        title: "Deletion Failed",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteTimer(0);
      if (deleteIntervalId) {
        clearInterval(deleteIntervalId);
        setDeleteIntervalId(null);
      }
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Healthcare Providers
              </h1>
              <p className="text-gray-600">
                View and manage healthcare provider accounts in the system
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

        {/* filter section */}
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
                          {/* <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Status
                          </TableHead> */}
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentProviders.map((provider) => (
                          <TableRow key={provider.hcpId}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {provider.hcpId}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <div className="max-w-[120px] truncate">
                                {provider.fullName}
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
                                {provider.role.charAt(0).toUpperCase() +
                                  provider.role.slice(1)}
                              </Badge>
                            </TableCell>
                            {/* <TableCell className="hidden md:table-cell whitespace-nowrap">
                              <Badge variant="secondary">Active</Badge>
                            </TableCell> */}
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
                                  onClick={() => handleEditClick(provider)}
                                  className="p-1 md:p-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(provider)}
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
                      <p className="text-sm">{selectedProvider.hcpId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm">{selectedProvider.fullName}</p>
                    </div>
                    <Badge className={getRoleBadgeColor(selectedProvider.role)}>
                      {selectedProvider.role.charAt(0).toUpperCase() +
                        selectedProvider.role.slice(1)}
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
                        {selectedProvider.role.charAt(0).toUpperCase() +
                          selectedProvider.role.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Recorded By</Label>
                      <p className="text-sm">
                        {selectedProvider.recordedBy?.role &&
                        selectedProvider.recordedBy?.id
                          ? `${
                              RoleLabels[selectedProvider.recordedBy.role] ||
                              selectedProvider.recordedBy.role
                            } - ${selectedProvider.recordedBy.id}`
                          : selectedProvider.recordedBy?.id}
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

        {/* edit dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Healthcare Provider</DialogTitle>
              <DialogDescription>
                Update the details for the healthcare provider.
              </DialogDescription>
            </DialogHeader>
            {editFormData && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-id">Provider ID</Label>
                  <Input id="edit-id" value={editFormData.id} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    value={editFormData.fullName}
                    onChange={(e) =>
                      handleEditInputChange("fullName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      handleEditInputChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select
                    value={editFormData.role}
                    onValueChange={(value) =>
                      handleEditInputChange("role", value)
                    }
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
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the healthcare provider{" "}
                <strong>{selectedProviderForDelete?.fullName}</strong> (ID:{" "}
                {selectedProviderForDelete?.hcpId})? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmDeleteClick}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isConfirmDeleteDialogOpen}
          onOpenChange={setIsConfirmDeleteDialogOpen}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Final Confirmation
              </DialogTitle>
              <DialogDescription>
                To confirm deletion of{" "}
                <strong>{selectedProviderForDelete?.fullName}</strong> (ID:{" "}
                {selectedProviderForDelete?.hcpId}), click the button below.
                This action is irreversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleFinalDelete}
                disabled={isLoading || deleteTimer > 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : deleteTimer > 0 ? (
                  `Delete in ${deleteTimer}s`
                ) : (
                  "Delete Now"
                )}
              </Button>
            </DialogFooter>
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
                    <p className="text-sm font-medium">HCP ID</p>
                    <p className="text-sm text-gray-600">{generatedHcpId}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedHcpId, "HCP ID")}
                  >
                    {copiedField === "HCP ID" ? (
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
