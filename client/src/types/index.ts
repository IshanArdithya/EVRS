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
