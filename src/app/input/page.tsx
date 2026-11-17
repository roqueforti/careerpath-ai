"use client";

import React from "react";
import CareerSimulator from "@/components/CareerSimulator";

export default function InputPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
      <CareerSimulator initialTab="assess" />
    </div>
  );
}
