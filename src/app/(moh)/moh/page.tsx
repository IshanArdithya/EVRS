"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MOHPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/moh/login");
  }, [router]);

  return null;
}
