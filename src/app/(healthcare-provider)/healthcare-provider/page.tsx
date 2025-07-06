"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HealthcareProviderPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/healthcare-provider/login");
  }, [router]);

  return null;
}
