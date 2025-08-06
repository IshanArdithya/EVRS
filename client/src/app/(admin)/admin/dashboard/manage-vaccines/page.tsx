/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import type React from "react";

import { useState } from "react";
import { AdminDashboardLayout } from "@/app/(admin)/admin/components/admin-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Plus,
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
import type { allVaccines } from "@/types";

export default function ManageVaccines() {
  const [vaccines, setVaccines] = useState<allVaccines[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedVaccineId, setGeneratedVaccineId] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sideEffects: "",
  });

  // filter states
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
  const [selectedVaccineForDelete, setSelectedVaccineForDelete] =
    useState<any>(null);
  const [deleteTimer, setDeleteTimer] = useState(0);
  const [deleteIntervalId, setDeleteIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vaccines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVaccines = vaccines.slice(startIndex, endIndex);

  const fetchVaccines = async (params: Record<string, string> = {}) => {
    setIsFilterLoading(true);
    try {
      const response = await api.get("/admin/vaccines", { params });
      setVaccines(response.data);
      setCurrentPage(1);
      setHasAppliedFilter(true);
    } catch (err) {
      toast({
        title: "Fetch Error",
        description: "Could not load vaccines. Try again.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsFilterLoading(false);
    }
  };

  // apply filters
  const handleApplyFilter = async () => {
    const params: Record<string, string> = {};
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    fetchVaccines(params);
  };

  // clear filters
  const handleClearFilter = () => {
    setSearchQuery("");
    setHasAppliedFilter(false);
    fetchVaccines();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.sideEffects) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/admin/register-vaccine", {
        name: formData.name,
        sideEffects: formData.sideEffects,
      });

      const { vaccine, message } = response.data;

      setGeneratedVaccineId(vaccine.vaccineId);

      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      fetchVaccines();

      toast({
        title: "Vaccine Added Successfully",
        description: message,
      });
    } catch (error: any) {
      toast({
        title: "Failed to Add Vaccine",
        description: error.response?.data?.message || "Something went wrong.",
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
      id: "",
      name: "",
      sideEffects: "",
    });
  };

  // get active filte
  const getActiveFilters = () => {
    const filters = [];
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    } else {
      filters.push("All Vaccines");
    }
    return filters;
  };

  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  const handleViewDetails = (vaccine: any) => {
    setSelectedVaccine(vaccine);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (vaccine: any) => {
    setEditFormData({
      id: vaccine.vaccineId,
      name: vaccine.name,
      sideEffects: vaccine.sideEffects,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.sideEffects) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/admin/vaccine/${editFormData.id}`, {
        name: editFormData.name,
        sideEffects: editFormData.sideEffects,
      });
      toast({
        title: "Vaccine Updated",
        description: response.data.message,
      });
      setIsEditDialogOpen(false);
      fetchVaccines();
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

  const handleDeleteClick = (vaccine: any) => {
    setSelectedVaccineForDelete(vaccine);
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
        `/admin/vaccine/${selectedVaccineForDelete.vaccineId}`
      );
      toast({
        title: "Vaccine Deleted",
        description: response.data.message,
      });
      setIsConfirmDeleteDialogOpen(false);
      fetchVaccines();
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
              <Plus className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Vaccines
              </h1>
              <p className="text-gray-600">
                View and manage vaccine types in the system
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
                Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Vaccine</DialogTitle>
                <DialogDescription>
                  Enter the details for the new vaccine type
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vaccine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Hepatitis A Vaccine"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sideEffects">Side Effects *</Label>
                  <Textarea
                    id="sideEffects"
                    value={formData.sideEffects}
                    onChange={(e) =>
                      handleInputChange("sideEffects", e.target.value)
                    }
                    placeholder="List the common and rare side effects..."
                    rows={6}
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
                      "Add Vaccine"
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
              Filter Vaccines
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Search by vaccine name, or ID, or view all vaccines
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* search filter */}
              <div className="space-y-2 md:col-span-2">
                <Label>Search (Optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, or ID..."
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
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isFilterLoading}
                  >
                    {isFilterLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filter
                      </>
                    )}
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
                    Click &quot;Apply Filter&quot; to view all vaccines or
                    search for specific vaccines.
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
                Vaccines
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {vaccines.length === 0
                  ? "No vaccines found matching your criteria"
                  : `Found ${vaccines.length} vaccine${
                      vaccines.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </p>
            </CardHeader>
            <CardContent>
              {vaccines.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vaccines found. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Vaccine ID
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Vaccine Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Description
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
                        {currentVaccines.map((vaccine) => (
                          <TableRow key={vaccine.vaccineId}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {vaccine.vaccineId}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {vaccine.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="max-w-[200px] truncate">
                                {vaccine.sideEffects}
                              </div>
                            </TableCell>
                            {/* <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary">Active</Badge>
                            </TableCell> */}
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(vaccine)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(vaccine)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(vaccine)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
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
                      {Math.min(endIndex, vaccines.length)} of {vaccines.length}{" "}
                      vaccines
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
              <DialogTitle>Vaccine Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected vaccine
              </DialogDescription>
            </DialogHeader>
            {selectedVaccine && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Vaccine ID</Label>
                      <p className="text-sm">{selectedVaccine.vaccineId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Vaccine Name
                      </Label>
                      <p className="text-sm">{selectedVaccine.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Side Effects
                      </Label>
                      <p className="text-sm">{selectedVaccine.sideEffects}</p>
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
              <DialogTitle>Edit Vaccine Details</DialogTitle>
              <DialogDescription>
                Update the information for the selected vaccine.
              </DialogDescription>
            </DialogHeader>
            {editFormData && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-vaccine-id">Vaccine ID</Label>
                  <Input
                    id="edit-vaccine-id"
                    value={editFormData.id}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vaccine-name">Vaccine Name *</Label>
                  <Input
                    id="edit-vaccine-name"
                    value={editFormData.name}
                    onChange={(e) =>
                      handleEditInputChange("name", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-side-effects">Side Effects *</Label>
                  <Textarea
                    id="edit-side-effects"
                    value={editFormData.sideEffects}
                    onChange={(e) =>
                      handleEditInputChange("sideEffects", e.target.value)
                    }
                    rows={6}
                    required
                  />
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
                Are you sure you want to delete the vaccine{" "}
                <strong>{selectedVaccineForDelete?.name}</strong> (ID:{" "}
                {selectedVaccineForDelete?.vaccineId})? This action cannot be
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
                <strong>{selectedVaccineForDelete?.name}</strong> (ID:{" "}
                {selectedVaccineForDelete?.vaccineId}), click the button below.
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
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Vaccine Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The new vaccine has been added to the system with the following
                details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccine ID</p>
                  <p className="text-sm text-gray-600">{generatedVaccineId}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccine Name</p>
                  <p className="text-sm text-gray-600">{formData.name}</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Side Effects</p>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {formData.sideEffects}
                  </div>
                </div>

                {/* <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        System Status
                      </p>
                      <p className="text-sm text-green-600">
                        Vaccine is now active and available for use
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  </div>
                </div> */}
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
                  Add Another Vaccine
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
