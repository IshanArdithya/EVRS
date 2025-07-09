"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Syringe, QrCode, Clock, Shield, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export default function NewVaccinationCard() {
  return (
    <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-full">
              <Syringe className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-green-800">
                Request New Vaccination
              </CardTitle>
              <CardDescription className="text-green-700">
                Generate a secure QR code for your healthcare provider
              </CardDescription>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <Zap className="w-3 h-3 mr-1" />
            Quick Access
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-green-100">
            <QrCode className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800 text-sm">
                Generate QR Code
              </h4>
              <p className="text-xs text-green-600">Instant secure code</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-green-100">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800 text-sm">
                5-Minute Validity
              </h4>
              <p className="text-xs text-green-600">Secure expiration</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-green-100">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <h4 className="font-medium text-green-800 text-sm">
                GOV Approved
              </h4>
              <p className="text-xs text-green-600">Secure & trusted</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg p-4 border border-green-100">
          <h4 className="font-medium text-green-800 mb-2">How it works:</h4>
          <ol className="text-sm text-green-700 space-y-1">
            <li className="flex items-center">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2 font-medium">
                1
              </span>
              Generate your secure QR code
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2 font-medium">
                2
              </span>
              Show it to your healthcare provider
            </li>
            <li className="flex items-center">
              <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2 font-medium">
                3
              </span>
              Receive vaccination and automatic record update
            </li>
          </ol>
        </div>

        <Button
          asChild
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg h-12 text-lg"
        >
          <Link
            href="/dashboard/new-vaccination"
            className="flex items-center justify-center"
          >
            <QrCode className="mr-3 h-5 w-5" />
            Generate QR Code Now
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
