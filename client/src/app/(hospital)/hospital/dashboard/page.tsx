"use client";

import Link from "next/link";
import { Shield, ArrowRight, Users, Syringe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HospitalLayout } from "@/components/hospital-layout";
import { hospitalkeyfeatures, support } from "@/constants/system-information";
import { hospitalQA } from "@/constants/quick-actions";
import { useState } from "react";
import { CreateNewbornDialog } from "../components/create-newborn-dialog";

const stats = [
  {
    title: "Total Citizens",
    value: "1,234,567",
    change: "+2.5%",
    icon: Users,
  },
  {
    title: "Vaccinations Today",
    value: "2,847",
    change: "+12.3%",
    icon: Syringe,
  },
  {
    title: "Active Vaccines",
    value: "24",
    change: "0%",
    icon: FileText,
  },
];

export default function HospitalPage() {
  const [createNewbornOpen, setCreateNewbornOpen] = useState(false);

  return (
    <HospitalLayout>
      <div className="space-y-8">
        {/* welcome section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to EVRS
            </h1>
            <p className="text-xl text-muted-foreground mt-2">Hospital Name</p>
          </div>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Hospital Dashboard
            </Badge>
          </div>
        </div>

        {/* stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* quick actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hospitalQA.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${action.color} text-white`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {action.title === "Create Newborn Account" ? (
                      <Button
                        className="w-full group"
                        onClick={() => setCreateNewbornOpen(true)}
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <Link href={action.href}>
                        <Button className="w-full group">
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* system information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Important information about the Electronic Vaccination Record
              System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Key Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {hospitalkeyfeatures.map((features, index) => {
                    return <li key={index}>• {features}</li>;
                  })}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {support.map((sup, index) => {
                    return (
                      <li key={index}>
                        • {sup.label}: {sup.value}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        <CreateNewbornDialog
          open={createNewbornOpen}
          onOpenChange={setCreateNewbornOpen}
        />
      </div>
    </HospitalLayout>
  );
}
