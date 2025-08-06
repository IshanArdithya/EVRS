import DashboardLayout from "@/app/(patient)/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Syringe,
  Calendar,
  User,
  Beaker,
  Thermometer,
  Clock,
  FileText,
  Download,
  ArrowLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

// mock data
const vaccinationDetails = {
  id: 1,
  name: "COVID-19 Booster (Pfizer-BioNTech)",
  brandName: "Comirnaty",
  manufacturer: "Pfizer-BioNTech",
  date: "2024-01-15",
  time: "14:30",
  batchNumber: "PF001234",
  lotNumber: "EW0182",
  expiryDate: "2024-12-31",
  location: "City Health Centre",
  address: "123 colombo",
  administrator: "Dr. xx",
  administratorId: "GMC123456",
  vaccinationNumber: "VAC-2024-001234",
  dosage: "0.3 mL",
  route: "Intramuscular",
  site: "Left deltoid muscle",
  nextDue: null,
  status: "Complete",
  sideEffects: "Mild soreness at injection site for 24 hours",
  notes:
    "Third booster dose administered as part of ongoing COVID-19 vaccination program",
  contraindications: "None identified",
  consentGiven: true,
  temperature: "2-8°C (maintained)",
  dilution: "Not required",
  vaccinationType: "mRNA vaccine",
  antigen: "SARS-CoV-2 spike protein",
  adjuvant: "None",
  preservative: "None",
  clinicalTrialData: "Phase 3 trials completed with 95% efficacy",
  approvalDate: "2020-12-02",
  regulatoryBody: "MHRA",
  whoPrequalification: "Yes",
  storageConditions: "Store in refrigerator at 2-8°C. Do not freeze.",
  reconstitution: "Ready to use - no reconstitution required",
  immunizationSchedule:
    "Primary series: 2 doses, 21 days apart. Booster: 6 months after primary series",
};

export default function VaccinationDetailPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/vaccinations">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vaccinations
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary-DEFAULT">
                {vaccinationDetails.name}
              </h1>
              <p className="text-muted-foreground">
                Detailed vaccination record and information
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Certificate
          </Button>
        </div>

        {/* status banner */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Vaccination Completed Successfully
                  </h3>
                  <p className="text-sm text-green-700">
                    Administered on{" "}
                    {new Date(vaccinationDetails.date).toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}{" "}
                    at {vaccinationDetails.time}
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Shield className="w-3 h-3 mr-1" />
                Protected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* main vaccination details */}
          <div className="lg:col-span-2 space-y-6">
            {/* basic info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Syringe className="mr-2 h-5 w-5" />
                  Vaccination Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Vaccine Name
                      </label>
                      <p className="font-medium">{vaccinationDetails.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Brand Name
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.brandName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Manufacturer
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.manufacturer}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Vaccination Number
                      </label>
                      <p className="font-medium font-mono">
                        {vaccinationDetails.vaccinationNumber}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Dosage
                      </label>
                      <p className="font-medium">{vaccinationDetails.dosage}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Route of Administration
                      </label>
                      <p className="font-medium">{vaccinationDetails.route}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Injection Site
                      </label>
                      <p className="font-medium">{vaccinationDetails.site}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Vaccine Type
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.vaccinationType}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* batch and quality info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Beaker className="mr-2 h-5 w-5" />
                  Batch & Quality Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Batch Number
                      </label>
                      <p className="font-medium font-mono">
                        {vaccinationDetails.batchNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Lot Number
                      </label>
                      <p className="font-medium font-mono">
                        {vaccinationDetails.lotNumber}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Expiry Date
                      </label>
                      <p className="font-medium">
                        {new Date(
                          vaccinationDetails.expiryDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Storage Temperature
                      </label>
                      <p className="font-medium flex items-center">
                        <Thermometer className="w-4 h-4 mr-1" />
                        {vaccinationDetails.temperature}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Regulatory Approval
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.regulatoryBody}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Approval Date
                      </label>
                      <p className="font-medium">
                        {new Date(
                          vaccinationDetails.approvalDate
                        ).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        WHO Prequalification
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.whoPrequalification}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Dilution Required
                      </label>
                      <p className="font-medium">
                        {vaccinationDetails.dilution}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* clinical information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Clinical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Active Antigen
                    </label>
                    <p className="font-medium">{vaccinationDetails.antigen}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Adjuvant
                    </label>
                    <p className="font-medium">{vaccinationDetails.adjuvant}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Preservative
                    </label>
                    <p className="font-medium">
                      {vaccinationDetails.preservative}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Clinical Trial Data
                    </label>
                    <p className="font-medium">
                      {vaccinationDetails.clinicalTrialData}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Immunization Schedule
                    </label>
                    <p className="font-medium">
                      {vaccinationDetails.immunizationSchedule}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* sidebar information */}
          <div className="space-y-6">
            {/* administration details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Administration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Healthcare Provider
                  </label>
                  <p className="font-medium">
                    {vaccinationDetails.administrator}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ID: {vaccinationDetails.administratorId}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Location
                  </label>
                  <p className="font-medium">{vaccinationDetails.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {vaccinationDetails.address}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date & Time
                  </label>
                  <p className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(vaccinationDetails.date).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {vaccinationDetails.time}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* side effects & notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Side Effects
                  </label>
                  <p className="text-sm">{vaccinationDetails.sideEffects}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Clinical Notes
                  </label>
                  <p className="text-sm">{vaccinationDetails.notes}</p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Contraindications
                  </label>
                  <p className="text-sm">
                    {vaccinationDetails.contraindications}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Consent Given
                  </label>
                  <p className="text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    {vaccinationDetails.consentGiven ? "Yes" : "No"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* storage information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="mr-2 h-5 w-5" />
                  Storage & Handling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Storage Conditions
                  </label>
                  <p className="text-sm">
                    {vaccinationDetails.storageConditions}
                  </p>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Reconstitution
                  </label>
                  <p className="text-sm">{vaccinationDetails.reconstitution}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
