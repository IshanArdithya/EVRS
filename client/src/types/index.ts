// dashboard - system information

export type Support = {
  label: string;
  value: string;
};

export type HPKeyFeatures = string[];

export type HospitalKeyFeatures = string[];

export type MOHKeyFeatures = string[];

// dashboard navigations

export type MOHNavigation = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export type HospitalNavigation = {
  name: string;
  href: string;
  icon: React.ElementType;
};

export type HealthcareProviderNavigation = {
  name: string;
  href: string;
  icon: React.ElementType;
};

// dashboard - quick actions

export type HealthcareProviderQA = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
};

export type HospitalQA = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
};

export type MohQA = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
};

export interface Vaccine {
  _id: string;
  vaccineId: string;
  name: string;
  sideEffects?: string;
}

export interface VaccinationRecord {
  vaccinationId: string;
  citizenId: string;
  vaccineId: string;
  citizenName: string;
  vaccinationType: string;
  provider: string;
  location: string;
  vaccinationLocation: string;
  createdAt: string;
  division: string;
  recordedBy: {
    id: string;
    role: string;
  };
}

export interface allVaccines {
  vaccineId: string;
  name: string;
  sideEffects: string;
  createdAt: string;
}

export type HCPUser = {
  hcpId: string;
  role: "doctor" | "nurse" | "midwife" | string;
  mainRole: "hcp" | string;
  fullName: string;
  email: string;
  nic: string;
  createdAt: string;
};

export type HospitalUser = {
  hospitalId: string;
  mainRole: "hospital" | string;
  name: string;
  email: string;
  district: string;
  province: string;
};
