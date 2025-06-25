"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  QrCode,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Shield,
  User,
  Calendar,
} from "lucide-react";

export default function NewVaccinationPage() {
  const [qrCode, setQrCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const generateQRCode = () => {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const patientId = "EVRS001234567";
    const timestamp = new Date().toISOString();
    const qrData = `VACC_REQ:${sessionId}:${patientId}:${timestamp}`;
    setQrCode(qrData);
    setTimeLeft(300);
    setIsExpired(false);
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isExpired) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const QRCodeDisplay = ({ data }: { data: string }) => (
    <div className="w-48 h-48 bg-white border-2 border-gray-300 flex items-center justify-center mx-auto">
      <div className="text-center">
        <QrCode className="h-32 w-32 mx-auto mb-2" />
        <div className="text-xs text-gray-500 break-all px-2">
          {data.substring(0, 20)}...
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-primary">
            New Vaccination Request
          </h1>
          <p className="text-muted-foreground">
            Generate a QR code for your healthcare provider to record your
            vaccination
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR code section */}
          <Card
            className={`${
              isExpired
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <QrCode className="mr-2 h-5 w-5" />
                  Vaccination QR Code
                </span>
                <Badge
                  variant={isExpired ? "destructive" : "secondary"}
                  className="bg-green-100 text-green-800"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {isExpired ? "Expired" : formatTime(timeLeft)}
                </Badge>
              </CardTitle>
              <CardDescription>
                Show this QR code to your healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {!isExpired ? (
                <>
                  <QRCodeDisplay data={qrCode} />
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 font-medium">
                      QR Code Active
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Session ID: {qrCode.split(":")[1]?.substring(0, 8)}...
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 font-medium">QR Code Expired</p>
                  <p className="text-sm text-muted-foreground">
                    Generate a new code to continue
                  </p>
                </div>
              )}

              <Button
                onClick={generateQRCode}
                className="w-full bg-green-600 hover:bg-green-700"
                variant={isExpired ? "default" : "outline"}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isExpired ? "Generate New QR Code" : "Refresh QR Code"}
              </Button>
            </CardContent>
          </Card>

          {/* patient info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Your Information
              </CardTitle>
              <CardDescription>
                Information that will be shared with your healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Patient Name:</span>
                  <span className="text-sm">User User</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">EVRS Number:</span>
                  <span className="text-sm">123123131</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Date of Birth:</span>
                  <span className="text-sm">15 June 2020</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Blood Type:</span>
                  <span className="text-sm">O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Known Allergies:</span>
                  <span className="text-sm">Penicillin</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              Instructions for Vaccination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Before your appointment:</strong> Generate a fresh QR
                  code within 5 minutes of your vaccination appointment.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">
                    Step-by-Step Process:
                  </h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Generate your QR code before arriving at the clinic</li>
                    <li>Show the QR code to your healthcare provider</li>
                    <li>
                      The doctor will scan the code to access your information
                    </li>
                    <li>Receive your vaccination as prescribed</li>
                    <li>
                      The vaccination details will be automatically added to
                      your record
                    </li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-primary">Important Notes:</h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>QR codes expire after 5 minutes for security</li>
                    <li>
                      Only generate codes when you&apos;re ready for vaccination
                    </li>
                    <li>Ensure your phone has sufficient battery</li>
                    <li>Have a backup form of ID available</li>
                    <li>Inform the doctor of any recent health changes</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security Notice:</strong> Never share your QR code
                  with unauthorized individuals. Only show it to qualified
                  healthcare professionals during your appointment.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* recent activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent QR Code Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  date: "2024-01-15 14:30",
                  status: "Completed",
                  vaccine: "COVID-19 Booster",
                },
                {
                  date: "2023-10-20 10:15",
                  status: "Completed",
                  vaccine: "Influenza Vaccine",
                },
                {
                  date: "2023-08-10 16:45",
                  status: "Completed",
                  vaccine: "Hepatitis B",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{activity.vaccine}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.date}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
