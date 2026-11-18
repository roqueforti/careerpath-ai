"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MockupScreen4 } from "@/components/MockupScreens";

export default function AdminDashboardPage() {
  const router = useRouter();

  function handleNavigate(tab: string) {
    if (tab === "asesmen") {
      router.push("/assessments");
    } else if (tab === "hasil") {
      router.push("/output");
    } else if (tab === "beranda") {
      router.push("/dashboard");
    } else {
      router.push(`/?tab=${tab}`);
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#eef0fb]">
      <MockupScreen4 isPreview={false} onNavigate={handleNavigate} />
    </div>
  );
}
