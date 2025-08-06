"use client";

import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "@/app/(admin)/admin/components/admin-dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Shield, User, Mail, Lock } from "lucide-react";
import api from "@/lib/api";
import { useUser } from "@/context/UserContext";

export default function AdminProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { admin, loading } = useUser();

  const [adminId, setAdminId] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!admin) return;
    setAdminId(admin.adminId || "");
    setEmail(admin.email || "");
  }, [admin]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <p>Loading your profile…</p>
      </AdminDashboardLayout>
    );
  }

  if (!admin) {
    return (
      <AdminDashboardLayout>
        <p>Please log in to view your dashboard.</p>
      </AdminDashboardLayout>
    );
  }

  const handlePasswordChange = async () => {
    if (!currentPassword.trim()) {
      toast({
        title: "Error",
        description: "Current password is required",
        variant: "destructive",
      });
      return;
    }

    if (!newPassword.trim()) {
      toast({
        title: "Error",
        description: "New password is required",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Error",
        description: "New password must be different from current password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put("/admin/profile/password", {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        toast({
          title: "Password Updated",
          description: "Your password has been successfully changed.",
        });
      }
    } catch {
      toast({
        title: "Password Change Failed",
        description: "Current password is incorrect. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <AdminDashboardLayout>
  //       <div className="flex items-center justify-center min-h-[400px]">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
  //           <p className="mt-2 text-sm text-gray-600">Loading profile...</p>
  //         </div>
  //       </div>
  //     </AdminDashboardLayout>
  //   );
  // }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <User className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600">
              Manage your administrator account settings
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* profile info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span>Administrator Information</span>
              </CardTitle>
              <CardDescription>
                Your administrator account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adminId" className="text-sm font-medium">
                  Admin ID
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="adminId"
                    value={adminId || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <Badge variant="secondary" className="text-xs">
                    Unchangeable
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      value={email || ""}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Unchangeable
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* security settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-red-600" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="currentPassword"
                  className="text-sm font-medium"
                >
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Separator />

              <Button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* security notice */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Security Notice</h3>
                <p className="text-sm text-amber-700 mt-1">
                  As an administrator, your account has elevated privileges.
                  Please ensure you use a strong password and keep your
                  credentials secure. If you suspect any unauthorized access,
                  change your password immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminDashboardLayout>
  );
}
