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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AddVaccine() {
  const [formData, setFormData] = useState({
    vaccineName: "",
    sideEffects: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setShowSuccess(true);
    setIsLoading(false);

    toast({
      title: "Vaccine Added Successfully",
      description: "The new vaccine has been added to the system",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Plus className="w-8 h-8 mr-3 text-red-600" />
            Add Vaccine
          </h1>
          <p className="text-gray-600">Add a new vaccine type to the system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vaccine Information</CardTitle>
            <CardDescription>
              Enter the details for the new vaccine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="vaccineName">Vaccine Name *</Label>
                <Input
                  id="vaccineName"
                  value={formData.vaccineName}
                  onChange={(e) =>
                    handleInputChange("vaccineName", e.target.value)
                  }
                  placeholder="e.g., COVID-19 mRNA Vaccine, Hepatitis B Vaccine"
                  required
                  className="text-base"
                />
                <p className="text-sm text-gray-500">
                  Enter the official name of the vaccine
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sideEffects">Side Effects *</Label>
                <Textarea
                  id="sideEffects"
                  value={formData.sideEffects}
                  onChange={(e) =>
                    handleInputChange("sideEffects", e.target.value)
                  }
                  placeholder="List the common and rare side effects of this vaccine..."
                  rows={8}
                  required
                  className="text-base"
                />
                <p className="text-sm text-gray-500">
                  Provide a comprehensive list of potential side effects,
                  including both common and rare reactions
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-base py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding Vaccine...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Vaccine to System
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* success dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-green-600 flex items-center text-xl">
                <CheckCircle className="w-6 h-6 mr-2" />
                Vaccine Added Successfully!
              </DialogTitle>
              <DialogDescription className="text-base">
                The new vaccine has been successfully added to the EVRS system
                and is now available for vaccination records.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Vaccine Name
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    {formData.vaccineName}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Side Effects
                  </p>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {formData.sideEffects}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
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

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowSuccess(false);
                    setFormData({
                      vaccineName: "",
                      sideEffects: "",
                    });
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Add Another Vaccine
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSuccess(false)}
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
