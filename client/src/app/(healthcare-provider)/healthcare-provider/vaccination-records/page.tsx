"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { HealthcareProviderLayout } from "@/app/(healthcare-provider)/healthcare-provider/components/healthcare-provider-layout";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Plus,
  Loader2,
  User,
  Calendar,
  MapPin,
  Hash,
  FileIcon as FileUser,
  QrCode,
  X,
  Camera,
  CameraOff,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { format } from "date-fns";
import type { Vaccine } from "@/types";
import { useUser } from "@/context/UserContext";

interface VaccinationRecord {
  vaccinationType: string;
  vaccineName: string;
  createdAt: string;
  batchNumber: string;
  vaccinationLocation: string;
  division: string;
  additionalNotes: string;
}

interface CitizenData {
  name: string;
  birthDate: string;
  vaccinations: VaccinationRecord[];
}

export default function HealthcareProviderDashboard() {
  const [citizenId, setCitizenId] = useState("");
  const [citizenData, setCitizenData] = useState<CitizenData | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    citizenId: "",
    vaccinationType: "",
    batchNumber: "",
    expiryDate: "",
    vaccinationLocation: "",
    division: "",
    notes: "",
  });

  const { toast } = useToast();
  const { hcp, loading } = useUser();

  const [generatedVaccinationId, setGeneratedVaccinationId] = useState("");
  const [citizenError, setCitizenError] = useState("");

  const selectedVac = vaccines.find(
    (v) => v.vaccineId === formData.vaccinationType
  );
  const vacName = selectedVac?.name || formData.vaccinationType;

  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label?: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [scannerError, setScannerError] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<string>("prompt");
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAddDialogOpen) return;
    api
      .get<Vaccine[]>("/admin/vaccines")
      .then((res) => setVaccines(res.data))
      .catch((err) => console.error("Failed to load vaccines", err));
  }, [isAddDialogOpen]);

  useEffect(() => {
    if (!showScanner || !scannerRef.current) return;

    let html5Qr: Html5Qrcode;
    const initScanner = async () => {
      const cams = await Html5Qrcode.getCameras();
      const camId = cams[0].id;
      html5Qr = new Html5Qrcode(scannerRef.current!.id);
      setScanner(html5Qr);
      await html5Qr.start(
        camId,
        { fps: 10, qrbox: 250 },
        (decoded) => {
          setCitizenId(decoded);
          html5Qr.stop().then(() => html5Qr.clear());
          setShowScanner(false);
        },
        (err) => console.warn(err)
      );
    };

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        ro.disconnect();
        initScanner();
      }
    });
    ro.observe(scannerRef.current);

    return () => {
      ro.disconnect();
      scanner?.stop().catch(() => {});
    };
  }, [showScanner]);

  if (loading) {
    return (
      <HealthcareProviderLayout>
        <p>Loading your profile…</p>
      </HealthcareProviderLayout>
    );
  }

  if (!hcp) {
    return (
      <HealthcareProviderLayout>
        <p>Please log in to view your dashboard.</p>
      </HealthcareProviderLayout>
    );
  }

  const startQRScanner = () => {
    setShowScanner(true);
  };

  const stopQRScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => scanner.clear())
        .catch(console.error);
    }
    setShowScanner(false);
  };

  const searchCitizenById = async (id: string) => {
    setIsSearching(true);

    try {
      const response = await api.get(`/hcp/vaccinations/${id}`);
      const { patient, records } = response.data;

      setCitizenData({
        name: `${patient.firstName} ${patient.lastName}`,
        birthDate: patient.birthDate,
        vaccinations: records,
      });

      toast({
        title: "Citizen Found",
        description: `Loaded vaccination records for ${patient.firstName} ${patient.lastName}`,
      });
    } catch (error: any) {
      setCitizenData(null);
      toast({
        title: "Citizen Not Found",
        description: error.response?.data?.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchCitizen = async () => {
    if (!citizenId.trim()) {
      toast({
        title: "Citizen ID Required",
        description: "Please enter a citizen account ID",
        variant: "destructive",
      });
      return;
    }

    await searchCitizenById(citizenId);
  };

  const validateCitizen = async (citizenId: string): Promise<boolean> => {
    try {
      await api.get<unknown>(`/admin/patient/${citizenId}`);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddVaccination = () => {
    setFormData((prev) => ({ ...prev, citizenId: citizenId }));
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hcp.hcpId) {
      toast({
        title: "Missing Healthcare Provider ID",
        description: "Re-login required. Your session may have expired.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const citizenExists = await validateCitizen(formData.citizenId);
    if (!citizenExists) {
      setCitizenError("Citizen not found. Please enter a valid ID");
      setIsLoading(false);
      return;
    }
    setCitizenError("");

    try {
      const payload = {
        citizenId: formData.citizenId,
        vaccineId: formData.vaccinationType,
        batchNumber: formData.batchNumber,
        expiryDate: formData.expiryDate,
        recordedById: hcp.hcpId,
        recordedByRole: hcp.mainRole,
        vaccinationLocation: formData.vaccinationLocation,
        division: formData.division,
        additionalNotes: formData.notes || "",
      };

      const { data } = await api.post("/hcp/add-vaccination", payload);

      setGeneratedVaccinationId(data.record.vaccinationId);
      setIsAddDialogOpen(false);
      setIsSuccessDialogOpen(true);
      toast({
        title: "Vaccination Added",
        description: `Record ${data.record.vaccinationId} created!`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to add record.",
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
      citizenId: citizenId,
      vaccinationType: "",
      batchNumber: "",
      expiryDate: "",
      vaccinationLocation: "",
      division: "",
      notes: "",
    });
  };

  const getVaccineBadgeColor = (vaccine: string) => {
    const colors = {
      BCG: "bg-blue-100 text-blue-800",
      "Hepatitis B": "bg-green-100 text-green-800",
      DPT: "bg-purple-100 text-purple-800",
      Polio: "bg-orange-100 text-orange-800",
      MMR: "bg-red-100 text-red-800",
      "COVID-19": "bg-indigo-100 text-indigo-800",
    };
    return (
      colors[vaccine as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return format(date, "yyyy/MM/dd");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <HealthcareProviderLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileUser className="w-8 h-8 mr-3 text-primary" />
            Vaccination Records
          </h1>
          <p className="text-gray-600">
            View citizen vaccination records and add new vaccinations
          </p>
        </div>

        {/* search citizen section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Citizen
            </CardTitle>
            <CardDescription>
              Enter a citizen account ID or scan a QR code to view vaccination
              records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="citizenId">Citizen Account ID</Label>
                  <Input
                    id="citizenId"
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    placeholder="e.g., C6660830450"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={handleSearchCitizen}
                    disabled={isSearching || isScanning || isInitializingCamera}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={isScanning ? stopQRScanner : startQRScanner}
                    variant={isScanning ? "destructive" : "outline"}
                    disabled={isSearching}
                  >
                    {isScanning ? (
                      <>
                        <CameraOff className="mr-2 h-4 w-4" />
                        Stop Scan
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Scan QR
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* camera perm alert */}
              {cameraPermission === "denied" && (
                <Alert variant="destructive">
                  <CameraOff className="h-4 w-4" />
                  <AlertDescription>
                    Camera access is blocked. Please enable camera permissions
                    in your browser settings and refresh the page.
                  </AlertDescription>
                </Alert>
              )}

              {/* qr scanner */}
              {showScanner && (
                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {isScanning && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                          <Camera className="w-5 h-5 text-primary" />
                          <CardTitle className="text-primary">
                            {isInitializingCamera
                              ? "Initializing Camera..."
                              : isScanning
                              ? "Camera Active - QR Scanner"
                              : "QR Scanner"}
                          </CardTitle>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={stopQRScanner}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      Position the QR code within the camera frame to scan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* camera selection */}
                      {cameras.length > 1 && isScanning && (
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="camera-select"
                            className="text-sm font-medium"
                          >
                            Camera:
                          </Label>
                          <Select
                            value={selectedCamera}
                            onValueChange={setSelectedCamera}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select camera" />
                            </SelectTrigger>
                            <SelectContent>
                              {cameras.map((camera) => (
                                <SelectItem key={camera.id} value={camera.id}>
                                  {camera.label || `Camera ${camera.id}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      )}

                      {/* scanner container */}
                      <div className="relative">
                        <div
                          ref={scannerRef}
                          id="qr-reader"
                          className="mx-auto rounded-lg overflow-hidden"
                          style={{
                            width: "100%",
                            height: "320px",
                          }}
                        />

                        {scannerError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                            <div className="text-center space-y-3 p-4">
                              <CameraOff className="w-12 h-12 text-gray-400 mx-auto" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Camera Error
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {scannerError}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={restartScanner}
                                >
                                  <RotateCcw className="w-4 h-4 mr-2" />
                                  Retry
                                </Button>
                                {cameraPermission === "denied" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={requestCameraPermission}
                                  >
                                    <Camera className="w-4 h-4 mr-2" />
                                    Enable Camera
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {isInitializingCamera && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center space-y-3 p-4">
                              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Initializing Camera
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Please wait while we start the camera...
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* scanner instructs */}
                      {isScanning && (
                        <div className="text-center space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-gray-600 font-medium">
                              Scanner Active - Hold QR code steady within the
                              frame
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">
                            Make sure the QR code is well-lit and clearly
                            visible
                          </p>
                        </div>
                      )}

                      <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertDescription>
                          Only vaccination request QR codes will be accepted.
                          Other QR codes will be rejected for security reasons.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* citizen information and actions */}
        {citizenData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Citizen Information
                  </CardTitle>
                  <CardDescription>(ID: {citizenId})</CardDescription>
                </div>
                <Button
                  onClick={handleAddVaccination}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccination Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-sm text-gray-600">{citizenData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Birth Date</Label>
                  <p className="text-sm text-gray-600">
                    {formatDate(citizenData.birthDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* add vaccination record button */}
        {!citizenData && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button
                    disabled
                    className="bg-gray-300 text-gray-500 cursor-not-allowed"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vaccination Record
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Search for a citizen first to access vaccination services
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* vaccination records */}
        {citizenData && (
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Records</CardTitle>
              <CardDescription>Complete vaccination history</CardDescription>
            </CardHeader>
            <CardContent>
              {citizenData.vaccinations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No vaccination records found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vaccine Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Division</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {citizenData.vaccinations.map(
                        (vaccination: VaccinationRecord, i: number) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge
                                className={getVaccineBadgeColor(
                                  vaccination.vaccinationType
                                )}
                              >
                                {vaccination.vaccineName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {formatDate(vaccination.createdAt)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Hash className="w-4 h-4 mr-2 text-gray-400" />
                                {vaccination.batchNumber}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                <div className="max-w-[120px] truncate">
                                  {vaccination.vaccinationLocation}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{vaccination.division}</TableCell>
                            <TableCell>
                              <div className="max-w-[150px] truncate">
                                {vaccination.additionalNotes}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* add vaccination dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Vaccination Record</DialogTitle>
              <DialogDescription>
                Enter the vaccination details for {citizenData?.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="citizenId">Citizen Account ID</Label>
                <Input
                  id="citizenId"
                  value={formData.citizenId}
                  disabled
                  className="bg-gray-50"
                />
                {citizenError && (
                  <p className="text-sm text-red-600">{citizenError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccinationType">Vaccine Name *</Label>
                <Select
                  value={formData.vaccinationType}
                  onValueChange={(value) =>
                    handleInputChange("vaccinationType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vaccine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vaccines.map((v) => (
                      <SelectItem key={v.vaccineId} value={v.vaccineId}>
                        {v.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number *</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber}
                  onChange={(e) =>
                    handleInputChange("batchNumber", e.target.value)
                  }
                  placeholder="e.g., VB2024-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccinationLocation">
                  Vaccination Location *
                </Label>
                <Input
                  id="vaccinationLocation"
                  value={formData.vaccinationLocation}
                  onChange={(e) =>
                    handleInputChange("vaccinationLocation", e.target.value)
                  }
                  placeholder="e.g., Colombo General Hospital"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="division">Division *</Label>
                <Input
                  id="division"
                  value={formData.division}
                  onChange={(e) =>
                    handleInputChange("division", e.target.value)
                  }
                  placeholder="e.g., Colombo North"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Vaccination Record"
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

        {/* success dialog */}
        <Dialog
          open={isSuccessDialogOpen}
          onOpenChange={setIsSuccessDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Vaccination Record Added Successfully!
              </DialogTitle>
              <DialogDescription>
                The vaccination record has been added to the citizen&apos;s
                profile
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccination ID</p>
                  <p className="text-sm text-gray-600">
                    {generatedVaccinationId}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Citizen</p>
                  <p className="text-sm text-gray-600">
                    {citizenData?.name} ({formData.citizenId})
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Vaccine Name</p>
                  <Badge
                    className={getVaccineBadgeColor(formData.vaccinationType)}
                  >
                    {vacName}
                  </Badge>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Batch Number</p>
                  <p className="text-sm text-gray-600">
                    {formData.batchNumber}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">
                    {formData.vaccinationLocation}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Division</p>
                  <p className="text-sm text-gray-600">{formData.division}</p>
                </div>

                {formData.notes && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-gray-600">{formData.notes}</p>
                  </div>
                )}

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-800">Status</p>
                  <p className="text-sm text-green-600">
                    Successfully added to citizen&apos;s vaccination history
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsSuccessDialogOpen(false);
                    resetForm();
                    setIsAddDialogOpen(true);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Add Another Record
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
    </HealthcareProviderLayout>
  );
}
