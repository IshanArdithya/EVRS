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
import { Plus, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// mock data
const mockVaccines = [
  { id: "V001", name: "BCG Vaccine", description: "Tuberculosis prevention" },
  {
    id: "V002",
    name: "Hepatitis B Vaccine",
    description: "Hepatitis B prevention",
  },
  {
    id: "V003",
    name: "DPT Vaccine",
    description: "Diphtheria, Pertussis, Tetanus prevention",
  },
  {
    id: "V004",
    name: "Polio Vaccine",
    description: "Poliomyelitis prevention",
  },
  {
    id: "V005",
    name: "MMR Vaccine",
    description: "Measles, Mumps, Rubella prevention",
  },
  { id: "V006", name: "COVID-19 Vaccine", description: "COVID-19 prevention" },
  {
    id: "V007",
    name: "Influenza Vaccine",
    description: "Seasonal flu prevention",
  },
  {
    id: "V008",
    name: "Pneumococcal Vaccine",
    description: "Pneumococcal disease prevention",
  },
];

export default function ManageVaccines() {
  const [vaccines, setVaccines] = useState(mockVaccines);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    sideEffects: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vaccines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVaccines = vaccines.slice(startIndex, endIndex);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add new vaccine to the list
    const newVaccine = {
      id: formData.id,
      name: formData.name,
      description: "Custom vaccine",
    };
    setVaccines([...vaccines, newVaccine]);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Vaccine Added Successfully",
      description: "The new vaccine has been added to the system",
    });
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

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Plus className="w-8 h-8 mr-3 text-red-600" />
              Manage Vaccines
            </h1>
            <p className="text-gray-600">
              View and manage vaccine types in the system
            </p>
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
                  <Label htmlFor="id">Vaccine ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="e.g., V009"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Vaccine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., HPV Vaccine"
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

        <Card>
          <CardHeader>
            <CardTitle>Vaccines ({vaccines.length})</CardTitle>
            <CardDescription>
              List of all vaccine types in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaccine ID</TableHead>
                  <TableHead>Vaccine Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentVaccines.map((vaccine) => (
                  <TableRow key={vaccine.id}>
                    <TableCell className="font-medium">{vaccine.id}</TableCell>
                    <TableCell>{vaccine.name}</TableCell>
                    <TableCell>{vaccine.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="flex items-center justify-between mt-4">
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
                  <p className="text-sm text-gray-600">{formData.id}</p>
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

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
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
