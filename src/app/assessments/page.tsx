"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MockupScreen1 } from "@/components/MockupScreens";

export default function AssessmentsPage() {
  const router = useRouter();

  function handleNavigate(tab: string) {
    if (tab === "hasil") {
      router.push("/output");
    } else if (tab === "beranda") {
      router.push("/dashboard");
    } else if (tab === "admin") {
      router.push("/admin");
    } else {
      router.push(`/?tab=${tab}`);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#eef0fb]">
      <MockupScreen1 isPreview={false} onNavigate={handleNavigate} />
    </div>
  );
}
