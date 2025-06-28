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
  Building2,
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// mock data
const mockHospitals = [
  {
    id: "H001",
    name: "Colombo General Hospital",
    email: "admin@cgh.lk",
    location: "Colombo",
  },
  {
    id: "H002",
    name: "Teaching Hospital Kandy",
    email: "admin@thk.lk",
    location: "Kandy",
  },
  {
    id: "H003",
    name: "Base Hospital Galle",
    email: "admin@bhg.lk",
    location: "Galle",
  },
  {
    id: "H004",
    name: "District Hospital Anuradhapura",
    email: "admin@dha.lk",
    location: "Anuradhapura",
  },
  {
    id: "H005",
    name: "Provincial Hospital Badulla",
    email: "admin@phb.lk",
    location: "Badulla",
  },
  {
    id: "H006",
    name: "Divisional Hospital Negombo",
    email: "admin@dhn.lk",
    location: "Negombo",
  },
  {
    id: "H007",
    name: "Primary Medical Care Unit Jaffna",
    email: "admin@pmcuj.lk",
    location: "Jaffna",
  },
  {
    id: "H008",
    name: "Regional Hospital Ratnapura",
    email: "admin@rhr.lk",
    location: "Ratnapura",
  },
  {
    id: "H009",
    name: "Base Hospital Matara",
    email: "admin@bhm.lk",
    location: "Matara",
  },
  {
    id: "H010",
    name: "Teaching Hospital Batticaloa",
    email: "admin@thb.lk",
    location: "Batticaloa",
  },
];

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState(mockHospitals);
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
    location: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = hospitals.slice(startIndex, endIndex);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = generatePassword();
    setGeneratedPassword(password);

    // add new hospital
    const newHospital = { ...formData };
    setHospitals([...hospitals, newHospital]);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Hospital Added Successfully",
      description: "The hospital account has been created",
    });
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
    setFormData({ id: "", name: "", email: "", location: "" });
    setGeneratedPassword("");
    setCopiedField("");
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-red-600" />
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
                Add Hospital
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Hospital</DialogTitle>
                <DialogDescription>
                  Enter the details for the new hospital account
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Hospital ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="e.g., H011"
                    required
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
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="e.g., Colombo"
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
                      "Add Hospital"
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
            <CardTitle>Hospitals ({hospitals.length})</CardTitle>
            <CardDescription>
              List of all registered hospitals in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hospital Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentHospitals.map((hospital) => (
                  <TableRow key={hospital.id}>
                    <TableCell className="font-medium">{hospital.id}</TableCell>
                    <TableCell>{hospital.name}</TableCell>
                    <TableCell>{hospital.email}</TableCell>
                    <TableCell>{hospital.location}</TableCell>
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
                {Math.min(endIndex, hospitals.length)} of {hospitals.length}{" "}
                hospitals
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Hospital Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The hospital account has been created with the following
                details:
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
                      <Check className="h-4 w-4" />
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
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{formData.location}</p>
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
                  Add Another Hospital
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
