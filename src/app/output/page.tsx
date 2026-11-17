"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, Target } from "lucide-react";
import CareerSimulator from "@/components/CareerSimulator";

export default function OutputPage() {
  const [hasResult, setHasResult] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("careerpath_grand_design_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.success && parsed?.modules?.map?.primaryCareer) {
          setHasResult(true);
          return;
        }
      }
      setHasResult(false);
    } catch {
      setHasResult(false);
    }
  }, []);

  if (hasResult === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#09090b]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600" />
      </div>
    );
  }

  if (!hasResult) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xs space-y-5">
          <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <Compass className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-zinc-950">Belum Ada Hasil Analisis</h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Anda belum menjalankan analisis kecocokan karier. Silakan isi formulir asesmen minat dan keahlian untuk menghasilkan peta karier O*NET dan IDP Anda.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/input"
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Target className="h-4 w-4" />
              <span>Mulai Asesmen Minat & Skill</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/assessments"
              className="w-full py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-xs transition-colors"
            >
              Lihat Katalog Asesmen Holland RIASEC
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
      <CareerSimulator initialTab="overview" />
    </div>
  );
}
