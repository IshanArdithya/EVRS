import { HealthcareProviderQA, HospitalQA, MohQA } from "@/types";
import { FileUser, Eye, Baby } from "lucide-react";

export const healthcareproviderQA: HealthcareProviderQA[] = [
  {
    title: "Vaccination Records",
    description: "View citizen vaccinations and add vaccination records",
    href: "/healthcare-provider/vaccination-records",
    icon: FileUser,
    color: "bg-blue-500",
  },

  {
    title: "View Vaccines",
    description: "Browse and manage vaccine information",
    href: "/healthcare-provider/view-vaccines",
    icon: Eye,
    color: "bg-purple-500",
  },
];

export const hospitalQA: HospitalQA[] = [
  {
    title: "Vaccination Records",
    description: "View citizen vaccinations and add vaccination records",
    href: "/hospital/vaccination-records",
    icon: FileUser,
    color: "bg-blue-500",
  },
  {
    title: "Create Newborn Account",
    description: "Register new citizen accounts for newborn babies",
    href: "/hospital/create-newborn",
    icon: Baby,
    color: "bg-green-500",
  },
  {
    title: "View Vaccines",
    description: "Browse and manage vaccine information",
    href: "/hospital/view-vaccines",
    icon: Eye,
    color: "bg-purple-500",
  },
];

export const mohQA: MohQA[] = [
  {
    title: "Vaccination Records",
    description: "View citizen vaccinations and add vaccination records",
    href: "/moh/vaccination-records",
    icon: FileUser,
    color: "bg-blue-500",
  },
  {
    title: "Create Newborn Account",
    description: "Register new citizen accounts for newborn babies",
    href: "/moh/create-newborn",
    icon: Baby,
    color: "bg-green-500",
  },
  {
    title: "View Vaccines",
    description: "Browse and manage vaccine information",
    href: "/moh/view-vaccines",
    icon: Eye,
    color: "bg-purple-500",
  },
];
