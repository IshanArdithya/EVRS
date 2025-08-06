"use client";

import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import DashboardLayout from "@/app/(patient)/components/dashboard-layout";
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
  CheckCircle,
  AlertCircle,
  RefreshCw,
  AlertTriangle,
  Calendar,
  Info,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function NewVaccinationPage() {
  const { citizen, loading } = useUser();

  const [qrData, setQrData] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  const generateQRCode = useCallback(() => {
    if (!citizen?.citizenId) return;

    const newSessionId = `VRQR${Date.now()}${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const timestamp = Date.now();
    const expiry = new Date(timestamp + 5 * 60 * 1000);

    setSessionId(newSessionId);
    setQrData(`VACC_REQ:${newSessionId}:${citizen.citizenId}:${timestamp}`);
    setExpiryTime(expiry);
    setTimeRemaining(expiry.getTime() - timestamp);
    setIsExpired(false);
  }, [citizen]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  useEffect(() => {
    if (!expiryTime) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, expiryTime.getTime() - Date.now());
      setTimeRemaining(remaining);
      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  const handleRefreshQR = () => {
    generateQRCode();
  };

  const formatTimeRemaining = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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
        <div>
          <h1 className="text-2xl font-bold text-primary-DEFAULT">
            New Vaccination Request
          </h1>
          <p className="text-muted-foreground">
            Generate a secure QR code to request vaccination from your
            healthcare provider
          </p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Session expires in 5 minutes for security
          </div>
        </div>

        {/* patient info */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Your registered details that will be verified during vaccination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Full Name</h4>
                  <p className="text-sm text-muted-foreground">{`${citizen.firstName} ${citizen.lastName}`}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Citizen ID</h4>
                  <p className="text-sm text-muted-foreground font-mono">
                    {citizen.citizenId}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Birth Date</h4>
                  <p className="text-sm text-muted-foreground">
                    {citizen.birthDate}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR code */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>QR Code Display</CardTitle>
                  <CardDescription>
                    Present this code to your healthcare provider
                  </CardDescription>
                </div>
                <Badge
                  variant={isExpired ? "destructive" : "secondary"}
                  className={
                    isExpired
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {isExpired ? "Expired" : formatTimeRemaining(timeRemaining)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  {qrData && !isExpired ? (
                    <>
                      <div className="p-6 bg-white rounded-lg border-2 border-gray-200 shadow-sm">
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
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <p className="text-lg font-semibold text-green-700">
                            QR Code Active
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono bg-gray-100 px-3 py-1 rounded">
                          Session: {sessionId.substring(0, 12)}...
                        </p>
                      </div>

                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Ready to scan!</strong> Your QR code is active
                          and ready for healthcare provider verification.
                        </AlertDescription>
                      </Alert>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="p-8 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <p className="text-xl font-semibold text-red-700 mb-2">
                          QR Code Expired
                        </p>
                        <p className="text-muted-foreground">
                          Generate a new code to continue with vaccination
                          request
                        </p>
                      </div>

                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Security timeout:</strong> This QR code has
                          expired for your protection. Generate a fresh code
                          when ready.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <Button
                    onClick={handleRefreshQR}
                    className="w-full bg-primary-DEFAULT hover:bg-primary-600"
                    variant={isExpired ? "default" : "outline"}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {isExpired ? "Generate New QR Code" : "Refresh QR Code"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* how to use */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use Your QR Code</CardTitle>
              <CardDescription>
                Step-by-step guide for a smooth vaccination experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary-DEFAULT/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-DEFAULT font-bold text-sm">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Generate Fresh Code</h4>
                      <p className="text-sm text-muted-foreground">
                        Create a new QR code within 5 minutes of your
                        appointment for maximum security.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary-DEFAULT/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-DEFAULT font-bold text-sm">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">
                        Visit Healthcare Provider
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Show the QR code to your healthcare provider along with
                        valid identification.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary-DEFAULT/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-DEFAULT font-bold text-sm">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Get Vaccinated</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive your vaccination and get an instant digital
                        record in your profile.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Quick Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Bring a valid government-issued ID
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Ensure your screen is bright and clean
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Only show to authorized healthcare professionals
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Never share screenshots of your QR code
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* important info */}
        <Card>
          <CardHeader>
            <CardTitle>Important Information</CardTitle>
            <CardDescription>
              Security features and requirements for vaccination requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Security Features
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">QR Code Expiry</span>
                      <Badge variant="secondary">5 minutes</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Session Encryption</span>
                      <Badge variant="secondary">AES-256</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Single Use</span>
                      <Badge variant="secondary">One-time only</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    Requirements
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium">Valid Identification</h5>
                      <p className="text-sm text-muted-foreground">
                        Bring government-issued ID for verification
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium">Clear Screen Display</h5>
                      <p className="text-sm text-muted-foreground">
                        Ensure your device screen is bright and clean
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium">Authorized Provider</h5>
                      <p className="text-sm text-muted-foreground">
                        Only show to qualified healthcare professionals
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <strong>Privacy Notice:</strong> Your QR code contains
                    encrypted session data and should only be shown to qualified
                    healthcare professionals during your vaccination
                    appointment. Never share screenshots or photos of your QR
                    code with unauthorized individuals.
                  </AlertDescription>
                </Alert>

                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Technical Support:</strong> If you experience any
                    issues with QR code generation or scanning, please contact
                    our support team through the Help & Support section in your
                    dashboard.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
