import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-primary-DEFAULT">
            Profile Management
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* profile picture & basic info */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="relative inline-block">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary-DEFAULT text-white text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold">User User</h3>
                <p className="text-sm text-muted-foreground">
                  Patient ID: EVRS001234567
                </p>
                <Badge variant="secondary" className="mt-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* personal info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="FName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="LName" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="email@email.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+94 77 122 5383" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    defaultValue="1985-06-15"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" defaultValue="123 Colombo" rows={3} />
              </div>

              <Button className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* medical info */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>
              Important medical details for healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evrsNumber">EVRS Number</Label>
                <Input id="evrsNumber" defaultValue="00000000" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Input id="bloodType" defaultValue="O+" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any known allergies or adverse reactions..."
                defaultValue="Penicillin - mild rash"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="List any ongoing medical conditions..."
                defaultValue="Hypertension (controlled with medication)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                defaultValue="User User - Wife - +94 12 123 1234"
              />
            </div>
          </CardContent>
        </Card>

        {/* notification preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you&apos;d like to receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Vaccination Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming vaccinations
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Email + SMS
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Health Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive important health information
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Email Only
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
