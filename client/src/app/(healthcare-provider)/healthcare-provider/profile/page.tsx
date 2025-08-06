/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { User, Mail, Phone, Shield, Eye, EyeOff, Lock } from "lucide-react";
import { HealthcareProviderLayout } from "@/app/(healthcare-provider)/healthcare-provider/components/healthcare-provider-layout";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function HealthcareProviderProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { hcp, loading } = useUser();

  const [newEmail, setNewEmail] = useState("");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [emailChangeStep, setEmailChangeStep] = useState<"request" | "verify">(
    "request"
  );

  const [newPhone, setNewPhone] = useState("");
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [phonePin, setPhonePin] = useState("");
  const [phonePinDialogOpen, setPhonePinDialogOpen] = useState(false);
  const [phoneChangeStep, setPhoneChangeStep] = useState<"request" | "verify">(
    "request"
  );

  const [hcpId, setHcpId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [nic, setNic] = useState<string>("");

  // --- password change states ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!hcp) return;

    setHcpId(hcp.hcpId || "");
    setEmail(hcp.email || "");
    setFullName(hcp.fullName || "");
    setPhone(hcp.phoneNumber || "");
    setRole(hcp.role || "");
    setNic(hcp.nic || "");
  }, [hcp]);

  if (loading) {
    return (
      <HealthcareProviderLayout>
        <p>Loading your profile…</p>
      </HealthcareProviderLayout>
    );
  }

  if (!hcp) {
    return (
      <HealthcareProviderLayout>
        <p>Please log in to view your dashboard.</p>
      </HealthcareProviderLayout>
    );
  }

  const handleEmailChangeRequest = async () => {
    if (!newEmail.trim() || newEmail.trim() === email) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid new email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("hcp/profile/email/request", {
        newEmail,
      });

      if (response.status === 200) {
        setEmailChangeStep("verify");
        setPinDialogOpen(true);
        setEmailDialogOpen(false);
        toast({
          title: "Verification Code Sent",
          description: "Please check your new email for the verification code.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (pin.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("hcp/profile/email/verify", {
        code: pin,
      });

      if (response.status === 200) {
        setEmail(newEmail);
        setPinDialogOpen(false);
        setPin("");
        setNewEmail("");
        setEmailChangeStep("request");

        toast({
          title: "Email Updated",
          description: "Your email address has been successfully updated.",
        });
      }
    } catch {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChangeRequest = async () => {
    if (
      !newPhone.trim() ||
      newPhone.length !== 9 ||
      `+94${newPhone.trim()}` === phone
    ) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid new phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("hcp/profile/phone/request", {
        newPhone: `+94${newPhone}`,
      });

      if (response.status === 200) {
        setPhoneChangeStep("verify");
        setPhonePinDialogOpen(true);
        setPhoneDialogOpen(false);
        toast({
          title: "Verification Code Sent",
          description: "Please check your SMS for the verification code.",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async () => {
    if (phonePin.length !== 6) {
      toast({
        title: "Invalid PIN",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("hcp/profile/phone/verify", {
        code: phonePin,
      });

      if (response.status === 200) {
        setPhone(`+94${newPhone}`);
        setPhonePinDialogOpen(false);
        setNewPhone("");
        setPhonePin("");
        setPhoneChangeStep("request");

        toast({
          title: "Phone Updated",
          description: "Your phone number has been successfully updated.",
        });
      }
    } catch {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await api.put("hcp/profile/password", {
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

  // if (!currentUser) {
  //   return (
  //     <HealthcareProviderLayout>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //           <p className="mt-2 text-muted-foreground">Loading profile...</p>
  //         </div>
  //       </div>
  //     </HealthcareProviderLayout>
  //   );
  // }

  return (
    <HealthcareProviderLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and security settings
          </p>
        </div>

        {/* personal info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your basic profile information. Some fields cannot be changed for
              security reasons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hcpId">Healthcare Provider ID</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="hcpId"
                    value={hcpId}
                    disabled
                    className="bg-muted"
                  />
                  <Badge variant="secondary">Unchangeable</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fullName"
                    value={fullName}
                    disabled
                    className="bg-muted"
                  />
                  <Badge variant="secondary">Unchangeable</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    value={email}
                    disabled
                    className="bg-muted"
                  />
                  <Dialog
                    open={emailDialogOpen}
                    onOpenChange={setEmailDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Email Address</DialogTitle>
                        <DialogDescription>
                          Enter your new email address. You&apos;ll receive a
                          verification code to confirm the change.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newEmail">New Email Address</Label>
                          <Input
                            id="newEmail"
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email address"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setEmailDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleEmailChangeRequest}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Verification Code"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="phone"
                    value={phone || "Not set"}
                    disabled
                    className="bg-muted"
                  />
                  <Dialog
                    open={phoneDialogOpen}
                    onOpenChange={setPhoneDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Phone Number</DialogTitle>
                        <DialogDescription>
                          Enter your new phone number. You&apos;ll receive a
                          verification code via SMS.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPhone">New Phone Number</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                              +94
                            </span>
                            <Input
                              id="newPhone"
                              placeholder="Enter 9-digit phone number"
                              type="tel"
                              value={newPhone}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 9);
                                setNewPhone(value);
                              }}
                              className="rounded-l-none"
                              maxLength={9}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setPhoneDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePhoneChangeRequest}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending..." : "Send Verification Code"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="role"
                    value={role}
                    disabled
                    className="bg-muted capitalize"
                  />
                  <Badge variant="secondary">Unchangeable</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nic">NIC</Label>
                <div className="flex items-center gap-2">
                  <Input id="nic" value={nic} disabled className="bg-muted" />
                  <Badge variant="secondary">Unchangeable</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* security settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Choose a strong password with at least 8 characters, including
                uppercase, lowercase, numbers, and special characters.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* email PIN verification dialog */}
        <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Email Change</DialogTitle>
              <DialogDescription>
                Enter the 6-digit verification code sent to {newEmail}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={pin}
                onChange={(value) => setPin(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPinDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEmailVerification}
                disabled={isLoading || pin.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* phone PIN verification dialog */}
        <Dialog open={phonePinDialogOpen} onOpenChange={setPhonePinDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Phone Change</DialogTitle>
              <DialogDescription>
                Enter the 6-digit verification code sent to {newPhone}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <InputOTP
                maxLength={6}
                value={phonePin}
                onChange={(value) => setPhonePin(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPhonePinDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePhoneVerification}
                disabled={isLoading || phonePin.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </HealthcareProviderLayout>
  );
}
