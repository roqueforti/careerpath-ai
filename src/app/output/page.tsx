"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MockupScreen2 } from "@/components/MockupScreens";

export default function OutputPage() {
  const router = useRouter();

  function handleNavigate(tab: string) {
    if (tab === "asesmen") {
      router.push("/assessments");
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
      <MockupScreen2 isPreview={false} onNavigate={handleNavigate} />
    </div>
  );
}
