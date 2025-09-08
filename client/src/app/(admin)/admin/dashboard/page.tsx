"use client";

import { AdminDashboardLayout } from "@/app/(admin)/admin/components/admin-dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  CircleUser as FileUser,
  Syringe,
  Activity,
  TrendingUp,
  AlertCircle,
  Building2,
  Hospital,
} from "lucide-react";
import Link from "next/link";
import { CitizenRegistrationsChart } from "@/components/charts/citizen-registrations-chart";
import { CitizenRegistrationsByProvinceChart } from "@/components/charts/citizen-registrations-by-province-chart";
import { VaccinationRecordsChart } from "@/components/charts/vaccination-records-chart";
import { YearlyRegistrationsChart } from "@/components/charts/yearly-registrations-chart";

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Hospitals",
      value: "45",
      change: "+3",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Healthcare Providers",
      value: "1,234",
      change: "+5%",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      title: "Citizens",
      value: "12,543",
      change: "+12%",
      icon: FileUser,
      color: "text-purple-600",
    },
    {
      title: "Vaccination Records",
      value: "45,678",
      change: "+18%",
      icon: Syringe,
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Manage Hospitals",
      description: "View and manage hospital accounts",
      href: "/admin/dashboard/manage-hospitals",
      icon: Hospital,
      color: "bg-blue-500",
    },
    {
      title: "Manage MOH",
      description: "View and manage MOH",
      href: "/admin/dashboard/manage-moh",
      icon: Building2,
      color: "bg-rose-500",
    },
    {
      title: "Manage Vaccines",
      description: "View and manage vaccines",
      href: "/admin/dashboard/manage-vaccines",
      icon: Syringe,
      color: "bg-orange-500",
    },
    {
      title: "Manage Healthcare Providers",
      description: "View and manage healthcare providers",
      href: "/admin/dashboard/manage-healthcare-providers",
      icon: UserPlus,
      color: "bg-green-500",
    },
    {
      title: "Manage Citizens",
      description: "View and manage citizen accounts",
      href: "/admin/dashboard/manage-citizens",
      icon: FileUser,
      color: "bg-purple-500",
    },
    {
      title: "Manage Vaccination Records",
      description: "View and manage vaccination records",
      href: "/admin/dashboard/manage-vaccination-records",
      icon: Syringe,
      color: "bg-gray-500",
    },
  ];

  const recentActivity = [
    {
      action: "New hospital registered",
      user: "Colombo General Hospital",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "Healthcare provider created",
      user: "Dr. Samantha Silva",
      time: "5 minutes ago",
      status: "success",
    },
    {
      action: "Vaccination record added",
      user: "Patient ID: NB2024001",
      time: "10 minutes ago",
      status: "success",
    },
    {
      action: "System backup completed",
      user: "System",
      time: "1 hour ago",
      status: "info",
    },
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to EVRS Administration Panel
            </p>
          </div>
        </div>

        {/* statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span
                    className={
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* data visualization charts section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Data Analytics
            </h2>
            <p className="text-gray-600">
              Comprehensive data visualizations and trends analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CitizenRegistrationsChart />
            </div>
            <div className="lg:col-span-1">
              <YearlyRegistrationsChart />
            </div>
          </div>

          {/* Charts grid for province and vaccination data */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CitizenRegistrationsByProvinceChart />
            <VaccinationRecordsChart />
          </div>
        </div>

        {/* quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Frequently used administrative functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${action.color} text-white`}
                        >
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">
                            {action.title}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {activity.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    System Maintenance
                  </p>
                  <p className="text-xs text-yellow-600">
                    Scheduled maintenance on Sunday 2:00 AM
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Backup Completed
                  </p>
                  <p className="text-xs text-green-600">
                    Daily backup completed successfully
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    New Update Available
                  </p>
                  <p className="text-xs text-blue-600">
                    EVRS v2.1.0 is ready for deployment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
