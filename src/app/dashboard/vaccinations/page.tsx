import DashboardLayout from "@/components/dashboard-layout";
import VaccinationCard from "@/components/vaccination-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Calendar } from "lucide-react";

const vaccinations = [
  {
    id: 1,
    name: "COVID-19 Booster (Pfizer-BioNTech)",
    date: "2024-01-15",
    batchNumber: "PF001234",
    location: "City Health Centre",
    administrator: "Dr. xx",
    nextDue: null,
    status: "Complete",
    sideEffects: "Mild soreness at injection site",
    notes: "Third booster dose administered",
  },
  {
    id: 2,
    name: "Influenza Vaccine (Quadrivalent)",
    date: "2023-10-20",
    batchNumber: "FL567890",
    location: "Local Surgery",
    administrator: "Nurse xx",
    nextDue: "2024-10-20",
    status: "Complete",
    sideEffects: "None reported",
    notes: "Annual flu vaccination",
  },
  {
    id: 3,
    name: "Hepatitis B",
    date: "2023-08-10",
    batchNumber: "HB445566",
    location: "Travel Clinic",
    administrator: "Dr. xx",
    nextDue: null,
    status: "Complete",
    sideEffects: "Mild fatigue for 24 hours",
    notes: "Travel vaccination series complete",
  },
  {
    id: 4,
    name: "Tetanus, Diphtheria, Pertussis (Tdap)",
    date: "2023-03-15",
    batchNumber: "TD778899",
    location: "City Health Centre",
    administrator: "Nurse xx",
    nextDue: "2033-03-15",
    status: "Complete",
    sideEffects: "None reported",
    notes: "10-year booster",
  },
  {
    id: 5,
    name: "Measles, Mumps, Rubella (MMR)",
    date: "2022-11-08",
    batchNumber: "MMR334455",
    location: "Local GP Surgery",
    administrator: "Dr. xx",
    nextDue: null,
    status: "Complete",
    sideEffects: "Mild fever for 2 days",
    notes: "Adult booster dose",
  },
];

export default function VaccinationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary-DEFAULT">
              Vaccination Records
            </h1>
            <p className="text-muted-foreground">
              Complete history of your vaccinations
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        {/* search and filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search vaccinations..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-DEFAULT">
                  {vaccinations.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Vaccinations
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {vaccinations.filter((v) => v.status === "Complete").length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {
                    vaccinations.filter(
                      (v) => v.nextDue && new Date(v.nextDue) > new Date()
                    ).length
                  }
                </div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* vaccination records */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Vaccination History</h2>
          {vaccinations.map((vaccination) => (
            <VaccinationCard key={vaccination.id} vaccination={vaccination} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
