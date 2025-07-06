import {
  HealthcareProviderNavigation,
  HospitalNavigation,
  MOHNavigation,
} from "@/types";
import {
  LayoutDashboard,
  FileUser,
  UserPlus,
  Eye,
  User,
  HelpCircle,
  FileText,
} from "lucide-react";

export const mohnavigation: MOHNavigation[] = [
  {
    name: "Dashboard",
    href: "/moh/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vaccination Records",
    href: "/moh/vaccination-records",
    icon: FileUser,
  },
  {
    name: "Create Newborn Account",
    href: "/moh/create-newborn",
    icon: UserPlus,
  },
  { name: "View Vaccines", href: "/moh/view-vaccines", icon: Eye },
  { name: "Profile", href: "/moh/profile", icon: User },
  { name: "Support", href: "/moh/support", icon: HelpCircle },
  { name: "Privacy Policy", href: "/moh/privacy", icon: FileText },
];

export const hospitalnavigation: HospitalNavigation[] = [
  {
    name: "Dashboard",
    href: "/hospital/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vaccination Records",
    href: "/hospital/vaccination-records",
    icon: FileUser,
  },
  {
    name: "Create Newborn Account",
    href: "/hospital/create-newborn",
    icon: UserPlus,
  },
  { name: "View Vaccines", href: "/hospital/view-vaccines", icon: Eye },
  { name: "Profile", href: "/hospital/profile", icon: User },
  { name: "Support", href: "/hospital/support", icon: HelpCircle },
  { name: "Privacy Policy", href: "/hospital/privacy", icon: FileText },
];

export const healthcareprovidernavigation: HealthcareProviderNavigation[] = [
  {
    name: "Dashboard",
    href: "/healthcare-provider/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vaccination Records",
    href: "/healthcare-provider/vaccination-records",
    icon: FileUser,
  },
  {
    name: "View Vaccines",
    href: "/healthcare-provider/view-vaccines",
    icon: Eye,
  },
  { name: "Profile", href: "/healthcare-provider/profile", icon: User },
  { name: "Support", href: "/healthcare-provider/support", icon: HelpCircle },
  {
    name: "Privacy Policy",
    href: "/healthcare-provider/privacy",
    icon: FileText,
  },
];
