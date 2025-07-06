"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HospitalPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/hospital/login");
  }, [router]);

  return null;
}
