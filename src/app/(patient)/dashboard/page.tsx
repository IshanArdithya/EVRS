import DashboardLayout from "@/components/dashboard-layout";
import NewVaccinationCard from "@/components/new-vaccination-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Syringe,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* welcome section */}
        <div className="bg-gradient-to-r from-primary-DEFAULT to-primary-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, John</h1>
          <p className="text-primary-100">
            Your vaccination records are up to date. Stay protected, stay
            healthy.
          </p>
        </div>

        {/* new vaccination req card */}
        <NewVaccinationCard />

        {/* quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vaccinations
              </CardTitle>
              <Syringe className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">All time record</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Year</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground">
                Vaccinations received
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Protection Status
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">All up to date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Due</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">6 months</div>
              <p className="text-xs text-muted-foreground">
                Annual flu vaccine
              </p>
            </CardContent>
          </Card>
        </div>

        {/* recent vaccinations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Vaccinations</CardTitle>
                <CardDescription>
                  Your latest vaccination records
                </CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/dashboard/vaccinations">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "COVID-19 Booster",
                  date: "2024-01-15",
                  status: "Complete",
                  batch: "PF001234",
                  location: "City Health Centre",
                },
                {
                  name: "Influenza Vaccine",
                  date: "2023-10-20",
                  status: "Complete",
                  batch: "FL567890",
                  location: "Local GP Surgery",
                },
                {
                  name: "Hepatitis B",
                  date: "2023-08-10",
                  status: "Complete",
                  batch: "HB445566",
                  location: "Travel Clinic",
                },
              ].map((vaccine, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Syringe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{vaccine.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(vaccine.date).toLocaleDateString()} •{" "}
                        {vaccine.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {vaccine.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* upcoming reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-orange-600" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription>
              Don&apos;t miss your scheduled vaccinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-orange-900">
                    Annual Flu Vaccine
                  </h4>
                  <p className="text-sm text-orange-700">
                    Due in approximately 6 months
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
