/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import api from "@/lib/api";
import type {
  CitizenUser,
  HCPUser,
  HospitalUser,
  MOHUser,
  AdminUser,
} from "@/types";

export type UserRole = "citizen" | "hcp" | "hospital" | "moh" | "admin";

interface UserContextType {
  citizen: CitizenUser | null;
  hcp: HCPUser | null;
  hospital: HospitalUser | null;
  moh: MOHUser | null;
  admin: AdminUser | null;
  loading: boolean;

  refreshProfiles: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  roles: UserRole[];
}

export function UserProvider({ children, roles }: UserProviderProps) {
  const [citizen, setCitizen] = useState<CitizenUser | null>(null);
  const [hcp, setHcp] = useState<HCPUser | null>(null);
  const [hospital, setHospital] = useState<HospitalUser | null>(null);
  const [moh, setMoh] = useState<MOHUser | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const endpoints: Record<UserRole, string> = {
    citizen: "/citizen/get/profile",
    hcp: "/hcp/get/profile",
    hospital: "/hospital/get/profile",
    moh: "/moh/get/profile",
    admin: "/admin/get/profile",
  };

  // refetch provided roles
  const refreshProfiles = useCallback(async () => {
    setLoading(true);

    await Promise.all(
      roles.map(async (role) => {
        try {
          const res = await api.get(endpoints[role]);
          switch (role) {
            case "citizen":
              setCitizen(res.data.citizen);
              break;
            case "hcp":
              setHcp(res.data.hcp);
              break;
            case "hospital":
              setHospital(res.data.hospital);
              break;
            case "moh":
              setMoh(res.data.moh);
              break;
            case "admin":
              setAdmin(res.data.admin);
              break;
            default:
              break;
          }
        } catch {
          switch (role) {
            case "citizen":
              setCitizen(null);
              break;
            case "hcp":
              setHcp(null);
              break;
            case "hospital":
              setHospital(null);
              break;
            case "moh":
              setMoh(null);
              break;
            case "admin":
              setAdmin(null);
              break;
          }
        }
      })
    );

    setLoading(false);
  }, [roles.join(",")]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const value: UserContextType = {
    citizen,
    hcp,
    hospital,
    moh,
    admin,
    loading,
    refreshProfiles,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context)
    throw new Error(
      "useUser must be used within a UserProvider with roles set"
    );
  return context;
}
