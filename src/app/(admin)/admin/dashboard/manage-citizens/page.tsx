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
  Baby,
  Plus,
  Copy,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

// mock data
const mockCitizens = [
  {
    id: "NB001",
    name: "Amal Perera",
    district: "Colombo",
    division: "Colombo 01",
  },
  {
    id: "NB002",
    name: "Sahan Silva",
    district: "Kandy",
    division: "Kandy Central",
  },
  {
    id: "NB003",
    name: "Nimal Fernando",
    district: "Galle",
    division: "Galle Fort",
  },
  {
    id: "NB004",
    name: "Kamala Jayawardena",
    district: "Anuradhapura",
    division: "Anuradhapura East",
  },
  {
    id: "NB005",
    name: "Priya Wickramasinghe",
    district: "Badulla",
    division: "Badulla Town",
  },
  {
    id: "NB006",
    name: "Rohan Dias",
    district: "Jaffna",
    division: "Jaffna Central",
  },
  {
    id: "NB007",
    name: "Sanduni Rajapaksa",
    district: "Matara",
    division: "Matara South",
  },
  {
    id: "NB008",
    name: "Thilina Gunasekara",
    district: "Ratnapura",
    division: "Ratnapura City",
  },
];

export default function ManageCitizens() {
  const [citizens, setCitizens] = useState(mockCitizens);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    serialNumber: "",
    name: "",
    birthDate: "",
    district: "",
    division: "",
    guardianNic: "",
  });
  const { toast } = useToast();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(citizens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCitizens = citizens.slice(startIndex, endIndex);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
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

    // add new citizen
    const newCitizen = {
      id: formData.id,
      name: formData.name,
      district: formData.district,
      division: formData.division,
    };
    setCitizens([...citizens, newCitizen]);

    setIsLoading(false);
    setIsAddDialogOpen(false);
    setIsSuccessDialogOpen(true);

    toast({
      title: "Citizen Account Created Successfully",
      description: "The newborn citizen account has been created",
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
    setFormData({
      id: "",
      serialNumber: "",
      name: "",
      birthDate: "",
      district: "",
      division: "",
      guardianNic: "",
    });
    setGeneratedPassword("");
    setCopiedField("");
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Baby className="w-8 h-8 mr-3 text-red-600" />
              Manage Citizens
            </h1>
            <p className="text-gray-600">
              View and manage citizen accounts in the system
            </p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Unique ID *</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                      placeholder="e.g., NB009"
                      required
                    />
                  </div>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Amal Perera"
                    required
                  />
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
                <div className="grid grid-cols-2 gap-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Citizens ({citizens.length})</CardTitle>
            <CardDescription>
              List of all registered citizens in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Division</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCitizens.map((citizen) => (
                  <TableRow key={citizen.id}>
                    <TableCell className="font-medium">{citizen.id}</TableCell>
                    <TableCell>{citizen.name}</TableCell>
                    <TableCell>{citizen.district}</TableCell>
                    <TableCell>{citizen.division}</TableCell>
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
