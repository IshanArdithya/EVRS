/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Save, Plus, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();

  // --- fields ---
  const [citizenId, setCitizenId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // --- email-change flow ---
  const [newEmail, setNewEmail] = useState("");
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  // --- phone-change flow ---
  const [newPhone, setNewPhone] = useState("");
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  // medical info states
  const [bloodType, setBloodType] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("");
  const [medicalConditions, setMedicalConditions] = useState<string>("");
  const [emContactName, setEmContactName] = useState<string>("");
  const [emContactPhone, setEmContactPhone] = useState<string>("");

  // --- password change states ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    api
      .get("/auth/get/citizen")
      .then((res) => {
        const u = res.data.citizen;
        setCitizenId(u.citizenId);
        setEmail(u.email || "");
        setFirstName(u.firstName);
        setLastName(u.lastName);
        setPhone(u.phoneNumber || "");
        setAddress(u.address || "");
        setBirthDate(u.birthDate);

        if (u.bloodType) setBloodType(u.bloodType);
        if (u.allergies) setAllergies(u.allergies.join(", "));
        if (u.medicalConditions)
          setMedicalConditions(u.medicalConditions.join(", "));
        if (u.emergencyContact) {
          setEmContactName(u.emergencyContact.name);
          setEmContactPhone(u.emergencyContact.phoneNumber);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router]);

  const handleAddEmail = async () => {
    if (!newEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.post("/citizen/profile/email/request", { newEmail });
      setShowEmailVerification(true);
      toast({
        title: "OTP Sent",
        description: "Check your inbox for the code.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to send code",
        variant: "destructive",
      });
    }
  };

  const handleEmailVerification = async () => {
    if (emailVerificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }
    setIsVerifyingEmail(true);
    try {
      const res = await api.post("/citizen/profile/email/verify", {
        code: emailVerificationCode,
      });
      setEmail(res.data.email);
      setNewEmail("");
      setEmailVerificationCode("");
      setShowEmailVerification(false);
      toast({ title: "Success", description: "Email updated!" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Invalid code",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleAddPhone = async () => {
    if (!newPhone.trim() || newPhone.length !== 9) {
      toast({
        title: "Error",
        description: "Please enter a valid 9-digit phone number",
        variant: "destructive",
      });
      return;
    }
    try {
      await api.post("/citizen/profile/phone/request", {
        newPhone: `+94${newPhone}`,
      });
      setShowPhoneVerification(true);
      toast({
        title: "OTP Sent",
        description: "Check your messages for the code.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to send code",
        variant: "destructive",
      });
    }
  };

  const handlePhoneVerification = async () => {
    if (phoneVerificationCode.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }
    setIsVerifyingPhone(true);
    try {
      const res = await api.post("/citizen/profile/phone/verify", {
        code: phoneVerificationCode,
      });
      setPhone(res.data.phone);
      setNewPhone("");
      setPhoneVerificationCode("");
      setShowPhoneVerification(false);
      toast({ title: "Success", description: "Phone updated!" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Invalid code",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      await api.put("/citizen/profile", { address });
      toast({ title: "Success", description: "Address updated!" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update address",
        variant: "destructive",
      });
    }
  };

  const handleMedicalSubmit = async () => {
    if (emContactName.trim() && !emContactPhone.trim()) {
      toast({
        title: "Error",
        description: "Emergency phone is required",
        variant: "destructive",
      });
      return;
    }
    if (emContactPhone.trim() && !emContactName.trim()) {
      toast({
        title: "Error",
        description: "Emergency name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: any = {};
      if (bloodType) payload.bloodType = bloodType;
      if (allergies.trim()) payload.allergies = allergies;
      if (medicalConditions.trim())
        payload.medicalConditions = medicalConditions;
      if (emContactName.trim()) {
        payload.emergencyContact = {
          name: emContactName.trim(),
          phoneNumber: emContactPhone.trim(),
        };
      }

      await api.put("/citizen/profile/medical", payload);
      toast({ title: "Saved", description: "Medical info updated." });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save",
        variant: "destructive",
      });
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

    setIsChangingPassword(true);
    try {
      await api.put("/citizen/profile/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast({
        title: "Success",
        description: "Password changed successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

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
                    {firstName.charAt(0).toUpperCase() || "U"}
                    {lastName.charAt(0).toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-semibold">
                  {firstName} {lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {citizenId}
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    This field cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    This field cannot be changed
                  </p>
                </div>
              </div>

              {/* email section */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {email ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                      />
                      <Badge variant="secondary" className="text-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter new email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <Button size="sm" onClick={handleAddEmail}>
                        <Plus className="w-4 h-4 mr-1" />
                        Change
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Enter new email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <Button size="sm" onClick={handleAddEmail}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              {/* phone section */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {phone ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        id="phone"
                        value={phone}
                        disabled
                        className="bg-muted"
                      />
                      <Badge variant="secondary" className="text-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          +94
                        </span>
                        <Input
                          placeholder="Enter 9-digit phone number"
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
                      <Button size="sm" onClick={handleAddPhone}>
                        <Plus className="w-4 h-4 mr-1" />
                        Change
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        +94
                      </span>
                      <Input
                        placeholder="Enter 9-digit phone number"
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
                    <Button size="sm" onClick={handleAddPhone}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={birthDate}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  This field cannot be changed
                </p>
              </div>

              {/* address section */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleUpdateAddress}
                className="w-full md:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                Update Address
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* medical information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>
              (optional) Blood type, allergies, conditions & emergency contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* blood type */}
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select
                onValueChange={(v) => setBloodType(v)}
                value={bloodType || undefined}
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bt) => (
                      <SelectItem key={bt} value={bt}>
                        {bt}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* allergies */}
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. penicillin, peanuts"
                rows={2}
              />
            </div>

            {/* medical conditions */}
            <div className="space-y-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="e.g. asthma, diabetes"
                rows={2}
              />
            </div>

            {/* emergency contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emName">Emergency Contact Name</Label>
                <Input
                  id="emName"
                  value={emContactName}
                  onChange={(e) => setEmContactName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emPhone">Emergency Contact Phone</Label>
                <Input
                  id="emPhone"
                  value={emContactPhone}
                  onChange={(e) => setEmContactPhone(e.target.value)}
                  placeholder="+94XXXXXXXXX"
                />
              </div>
            </div>

            <Button onClick={handleMedicalSubmit} className="w-full md:w-auto">
              Save Medical Info
            </Button>
          </CardContent>
        </Card>

        {/* security section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Change your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
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
                  placeholder="Enter your new password"
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
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long
              </p>
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
              disabled={
                isChangingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
              className="w-full md:w-auto"
            >
              <Lock className="mr-2 h-4 w-4" />
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
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

        {/* email verification dialog */}
        <Dialog
          open={showEmailVerification}
          onOpenChange={setShowEmailVerification}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Email Address</DialogTitle>
              <DialogDescription>
                We&apos;ve sent a 6-digit code to{" "}
                <strong>{newEmail || email}</strong>. Enter it below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailCode">Verification Code</Label>
                <Input
                  id="emailCode"
                  placeholder="______"
                  className="text-center text-lg tracking-widest"
                  value={emailVerificationCode}
                  onChange={(e) =>
                    setEmailVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  maxLength={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmailVerification(false);
                  setEmailVerificationCode("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEmailVerification}
                disabled={
                  isVerifyingEmail || emailVerificationCode.length !== 6
                }
              >
                {isVerifyingEmail ? "Verifying..." : "Verify Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* phone verification dialog */}
        <Dialog
          open={showPhoneVerification}
          onOpenChange={setShowPhoneVerification}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verify Phone Number</DialogTitle>
              <DialogDescription>
                We&apos;ve sent a 6-digit code to{" "}
                <strong>{newPhone || phone}</strong>. Enter it below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneCode">Verification Code</Label>
                <Input
                  id="phoneCode"
                  placeholder="______"
                  className="text-center text-lg tracking-widest"
                  value={phoneVerificationCode}
                  onChange={(e) =>
                    setPhoneVerificationCode(
                      e.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  maxLength={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPhoneVerification(false);
                  setPhoneVerificationCode("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePhoneVerification}
                disabled={
                  isVerifyingPhone || phoneVerificationCode.length !== 6
                }
              >
                {isVerifyingPhone ? "Verifying..." : "Verify Phone"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
