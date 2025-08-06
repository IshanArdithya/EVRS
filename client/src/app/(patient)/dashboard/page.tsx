"use client";

import DashboardLayout from "@/app/(patient)/components/dashboard-layout";
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
import { Syringe, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Record } from "@/types";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function DashboardPage() {
  const [vaccinations, setVaccinations] = useState<Record[]>([]);
  const router = useRouter();
  const { citizen, loading } = useUser();

  useEffect(() => {
    if (!citizen) return;

    api
      .get(`/citizen/vaccinations/${citizen.citizenId}`)
      .then((res) => setVaccinations(res.data.records))
      .catch(() => router.replace("/login"));
  }, [citizen, router]);

  const recent = useMemo(() => {
    return [...vaccinations]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [vaccinations]);

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading your profile…</p>
      </DashboardLayout>
    );
  }

  if (!citizen) {
    return (
      <DashboardLayout>
        <p>Please log in to view your dashboard.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* welcome section */}
        <div className="bg-gradient-to-r from-primary-DEFAULT to-primary-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {citizen.firstName}
          </h1>
          <p className="text-primary-100">
            Your vaccination records are up to date. Stay protected, stay
            healthy.
          </p>
        </div>

        {/* new vaccination req card */}
        <NewVaccinationCard />

        {/* quick stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div> */}

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
              {recent.map((vaccine, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Syringe className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{vaccine.vaccineName}</h4>
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
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* upcoming reminders */}
        {/* <Card>
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
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
