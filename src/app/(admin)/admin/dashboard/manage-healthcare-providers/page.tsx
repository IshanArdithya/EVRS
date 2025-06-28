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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// mock data
const mockProviders = [
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
    name: "Pharmacist Jeae Dias",
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
];

export default function ManageHealthcareProviders() {
  const [providers, setProviders] = useState(mockProviders);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const password = generatePassword();
    setGeneratedPassword(password);

    // add new provider to the list
    const newProvider = {
      id: formData.id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };
    setProviders([...providers, newProvider]);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Healthcare Provider Added Successfully",
      description: "The healthcare provider account has been created",
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
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
                  <Label htmlFor="id">Unique ID *</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => handleInputChange("id", e.target.value)}
                    placeholder="e.g., HP009"
                    required
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
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                      <SelectItem value="Medical Technician">
                        Medical Technician
                      </SelectItem>
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

        <Card>
          <CardHeader>
            <CardTitle>Healthcare Providers ({providers.length})</CardTitle>
            <CardDescription>
              List of all registered healthcare providers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.id}</TableCell>
                    <TableCell>{provider.name}</TableCell>
                    <TableCell>{provider.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(provider.role)}>
                        {provider.role}
                      </Badge>
                    </TableCell>
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
                {Math.min(endIndex, providers.length)} of {providers.length}{" "}
                providers
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
                    <p className="text-sm text-gray-600">{formData.id}</p>
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
