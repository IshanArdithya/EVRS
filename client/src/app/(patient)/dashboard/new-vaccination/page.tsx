"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  User,
  Phone,
  Mail,
  QrCode,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { CitizenUser } from "@/types";

export default function NewVaccinationPage() {
  const [patientData, setPatientData] = useState<CitizenUser>({
    citizenId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [qrData, setQrData] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedPatient = localStorage.getItem("citizen");
    if (storedPatient) {
      try {
        const parsedPatient: PatientData = JSON.parse(storedPatient);
        setPatientData(parsedPatient);
        generateQRCode(parsedPatient);
      } catch (err) {
        console.error("Failed to parse patient data:", err);
        generateQRCode(patientData);
      }
    } else {
      generateQRCode(patientData);
    }
  }, []);

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, expiryTime.getTime() - now.getTime());
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const generateQRCode = (patient: PatientData) => {
    const newSessionId = `VR${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const timestamp = Date.now();
    const expiry = new Date(timestamp + 5 * 60 * 1000);

    const qrContent = `VACC_REQ:${newSessionId}:${patient.citizenId}:${timestamp}`;

    setSessionId(newSessionId);
    setQrData(qrContent);
    setExpiryTime(expiry);
    setIsExpired(false);
  };

  const handleRefreshQR = () => {
    generateQRCode(patientData);
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <QrCode className="w-8 h-8 mr-3 text-primary" />
            New Vaccination Request
          </h1>
          <p className="text-gray-600">
            Show this QR code to your healthcare provider to request a new
            vaccination
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Patient Information
              </CardTitle>
              <CardDescription>Your registered details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-sm text-gray-900">{`${patientData.firstName} ${patientData.lastName}`}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Citizen ID
                  </label>
                  <p className="text-sm text-gray-900">
                    {patientData.citizenId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Birth Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(patientData.birthDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-400" />
                    {patientData.phone}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-gray-400" />
                    {patientData.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* qr code */}
          <Card
            className={`${
              isExpired
                ? "border-red-200 bg-red-50"
                : "border-green-200 bg-green-50"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Vaccination Request QR Code
                </span>
                <Badge
                  variant={isExpired ? "destructive" : "secondary"}
                  className="bg-green-100 text-green-800"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {isExpired ? "Expired" : formatTimeRemaining(timeRemaining)}
                </Badge>
              </CardTitle>
              <CardDescription>
                Show this code to your healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                {qrData && !isExpired ? (
                  <>
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
                      <QRCodeSVG
                        value={qrData}
                        size={200}
                        level="M"
                        marginSize={1}
                        fgColor="#000000"
                        bgColor="#ffffff"
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-sm text-green-700 font-medium">
                        QR Code Active
                      </p>
                      <p className="text-xs text-gray-500">
                        Session ID: {sessionId.substring(0, 12)}...
                      </p>
                    </div>

                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        QR code is active and ready to scan. Valid for 5
                        minutes.
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <p className="text-red-700 font-medium">
                        QR Code Expired
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Generate a new code to continue
                      </p>
                    </div>

                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This QR code has expired. Generate a new one to
                        continue.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                <Button
                  onClick={handleRefreshQR}
                  className="w-full bg-green-600 hover:bg-green-700"
                  variant={isExpired ? "default" : "outline"}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isExpired ? "Generate New QR Code" : "Refresh QR Code"}
                </Button>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-semibold">Generate QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Click "Generate New QR Code" to create a fresh vaccination
                    request code
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-semibold">Visit Healthcare Provider</h3>
                  <p className="text-sm text-gray-600">
                    Show the QR code to your healthcare provider or vaccination
                    center
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-semibold">Get Vaccinated</h3>
                  <p className="text-sm text-gray-600">
                    The provider will scan your code and add the vaccination
                    record to your profile
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Important Notes:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    QR codes expire after 5 minutes for security purposes
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Each QR code can only be used once
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Make sure your device screen is bright and clear for
                    scanning
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Bring a valid ID for verification at the vaccination center
                  </li>
                </ul>
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

        {/* recent qr activity */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Recent QR Code Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {qrtest.map((activity, index) => (
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
        </Card> */}
      </div>
    </DashboardLayout>
  );
}
