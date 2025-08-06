import DashboardLayout from "@/app/(patient)/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-primary-DEFAULT">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            How we protect and use your personal health information
          </p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            Last updated: xx xx, 202x
          </div>
        </div>

        {/* privacy overview */}
        <Card className="border-primary-DEFAULT/20">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary-DEFAULT" />
              Your Privacy is Protected
            </CardTitle>
            <CardDescription>
              We are committed to protecting your personal health information in
              accordance with GOV standards and GDPR regulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Lock className="h-8 w-8 text-primary-DEFAULT mx-auto mb-2" />
                <h3 className="font-medium">Encrypted Storage</h3>
                <p className="text-sm text-muted-foreground">
                  All data encrypted at rest and in transit
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <UserCheck className="h-8 w-8 text-primary-DEFAULT mx-auto mb-2" />
                <h3 className="font-medium">Access Control</h3>
                <p className="text-sm text-muted-foreground">
                  Strict authentication and authorization
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Eye className="h-8 w-8 text-primary-DEFAULT mx-auto mb-2" />
                <h3 className="font-medium">Audit Logging</h3>
                <p className="text-sm text-muted-foreground">
                  All access is monitored and logged
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* data collection */}
        <Card>
          <CardHeader>
            <CardTitle>What Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Personal Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Name, date of birth, EVRS number, contact details, and
                    address for identification and communication purposes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Medical Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Vaccination records, medical history, allergies, and other
                    health-related information necessary for healthcare
                    delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Database className="h-5 w-5 text-primary-DEFAULT mt-0.5" />
                <div>
                  <h4 className="font-medium">Technical Information</h4>
                  <p className="text-sm text-muted-foreground">
                    Login times, IP addresses, and system usage data for
                    security and system improvement purposes.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* how we use data */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Healthcare Delivery</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Providing vaccination records</li>
                    <li>• Scheduling appointments</li>
                    <li>• Sending health reminders</li>
                    <li>• Supporting clinical decisions</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Legal Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Public health monitoring</li>
                    <li>• Regulatory compliance</li>
                    <li>• Audit and inspection</li>
                    <li>• Emergency response</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* data sharing */}
        <Card>
          <CardHeader>
            <CardTitle>When We Share Your Information</CardTitle>
            <CardDescription>
              We only share your information when necessary and with appropriate
              safeguards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-primary-DEFAULT bg-primary-DEFAULT/5">
                <h4 className="font-medium">Authorized Healthcare Providers</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your GP, specialists, and other healthcare professionals
                  involved in your care may access relevant information.
                </p>
              </div>

              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <h4 className="font-medium">Public Health Authorities</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Anonymized data may be shared for disease surveillance,
                  outbreak investigation, and public health research.
                </p>
              </div>

              <div className="p-4 border-l-4 border-red-500 bg-red-50">
                <h4 className="font-medium flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Situations
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  In medical emergencies, relevant information may be shared
                  with emergency services and healthcare providers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* your rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
            <CardDescription>
              Under GDPR and GOV guidelines, you have the following rights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Access Your Data",
                  description:
                    "Request a copy of all personal data we hold about you",
                },
                {
                  title: "Correct Inaccuracies",
                  description:
                    "Request correction of any incorrect or incomplete information",
                },
                {
                  title: "Data Portability",
                  description:
                    "Request your data in a structured, machine-readable format",
                },
                {
                  title: "Restrict Processing",
                  description:
                    "Request limitation of how we process your data in certain circumstances",
                },
                {
                  title: "Object to Processing",
                  description:
                    "Object to processing based on legitimate interests or direct marketing",
                },
                {
                  title: "Withdraw Consent",
                  description:
                    "Withdraw consent for processing where consent is the legal basis",
                },
              ].map((right, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{right.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {right.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* data retention */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Vaccination Records</span>
                <Badge variant="secondary">Permanent</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Personal Information</span>
                <Badge variant="secondary">As per GOV guidelines</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">System Logs</span>
                <Badge variant="secondary">7 years</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">Communication Records</span>
                <Badge variant="secondary">3 years</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* contact info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Our Data Protection Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have questions about this privacy policy or wish to
                exercise your rights, please contact:
              </p>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">Data Protection Officer</h4>
                <p className="text-sm text-muted-foreground">
                  Email: dpo@evrs.gov.lk
                  <br />
                  Phone: 0112 123 123
                  <br />
                  Address: 123 Colombo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
