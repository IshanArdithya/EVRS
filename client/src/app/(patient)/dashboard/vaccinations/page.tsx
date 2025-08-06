"use client";

import DashboardLayout from "@/app/(patient)/components/dashboard-layout";
import VaccinationCard from "@/components/vaccination-card";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Record } from "@/types";
import api from "@/lib/api";
import { useUser } from "@/context/UserContext";

export default function VaccinationsPage() {
  const [vaccinations, setVaccinations] = useState<Record[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { citizen, loading } = useUser();

  useEffect(() => {
    if (!citizen?.citizenId) return;
    api
      .get(`/citizen/vaccinations/${citizen?.citizenId}`)
      .then((res) => setVaccinations(res.data.records))
      .catch(() => router.replace("/login"));
  }, [citizen?.citizenId, router]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return vaccinations;
    const q = searchQuery.toLowerCase();
    return vaccinations.filter((v) => v.vaccineName.toLowerCase().includes(q));
  }, [searchQuery, vaccinations]);

  const currentYear = new Date().getFullYear();
  const thisYearVaccinations = vaccinations.filter((v) => {
    const vaccinationDate = new Date(v.date);
    return vaccinationDate.getFullYear() === currentYear;
  });

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
          {/* <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div> */}
        </div>

        {/* search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vaccinations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button> */}
            </div>
          </CardContent>
        </Card>

        {/* summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {thisYearVaccinations.length}
                </div>
                <p className="text-sm text-muted-foreground">This Year</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* vaccination records */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Vaccination History</h2>
          {filtered.map((v) => (
            <VaccinationCard key={v.vaccinationId} vaccination={v} />
          ))}
          {filtered.length === 0 && (
            <p className="p-4 text-sm text-gray-600">
              No records match your search.
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
