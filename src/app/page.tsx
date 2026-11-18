"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MockupScreen1,
  MockupScreen2,
  MockupScreen3,
  MockupScreen4,
} from "@/components/MockupScreens";
import { Maximize2, Sparkles, LayoutGrid, Check } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // "overview" (Figma 2x2 Board) | "asesmen" | "hasil" | "beranda" | "admin"
  const [activeTab, setActiveTab] = useState<"overview" | "asesmen" | "hasil" | "beranda" | "admin">("overview");

  useEffect(() => {
    if (tabParam === "asesmen" || tabParam === "hasil" || tabParam === "beranda" || tabParam === "admin" || tabParam === "overview") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  function switchTab(newTab: string) {
    if (newTab === "overview" || newTab === "asesmen" || newTab === "hasil" || newTab === "beranda" || newTab === "admin") {
      setActiveTab(newTab);
      router.push(`/?tab=${newTab}`, { scroll: false });
    }
  }

  return (
    <div className={`w-full min-h-screen transition-colors duration-300 ${activeTab === "overview" ? "bg-[#706ce8]" : "bg-[#eef0fb]"}`}>
      
      {/* Floating Top Switcher Bar */}
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 py-3 flex items-center justify-between backdrop-blur-md bg-slate-900/40 border-b border-white/10 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => switchTab("overview")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "overview"
                ? "bg-white text-[#5452e6] shadow-sm scale-102"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tampilan Penuh (Grid 2 × 2)</span>
          </button>

          <span className="text-white/20 select-none">|</span>

          <button
            type="button"
            onClick={() => switchTab("asesmen")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "asesmen"
                ? "bg-white text-[#5452e6] shadow-sm font-bold scale-102"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            1. Input Asesmen
          </button>

          <button
            type="button"
            onClick={() => switchTab("hasil")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "hasil"
                ? "bg-white text-[#5452e6] shadow-sm font-bold scale-102"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            2. Hasil &amp; Rekomendasi
          </button>

          <button
            type="button"
            onClick={() => switchTab("beranda")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "beranda"
                ? "bg-white text-[#5452e6] shadow-sm font-bold scale-102"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            3. Beranda Siswa
          </button>

          <button
            type="button"
            onClick={() => switchTab("admin")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === "admin"
                ? "bg-white text-[#5452e6] shadow-sm font-bold scale-102"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            4. Dashboard Admin
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-white/90 text-xs font-medium pl-4 shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Figma Design System 100% Presisi</span>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MODE 1: 2x2 FIGMA PRESENTATION CANVAS (EXACT REPLICA OF USER REFERENCE)   */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <main className="w-full max-w-[1880px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-7 items-start">
            
            {/* Top-Left: Screen 1 (Input Asesmen) */}
            <section
              onClick={() => switchTab("asesmen")}
              className="bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white/40 hover:ring-4 hover:ring-white/50 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Buka Layar Penuh ↗</span>
              </div>
              <div className="pointer-events-none sm:pointer-events-auto">
                <MockupScreen1 isPreview={true} onNavigate={switchTab} />
              </div>
            </section>

            {/* Top-Right: Screen 2 (Hasil Asesmen Kariermu) */}
            <section
              onClick={() => switchTab("hasil")}
              className="bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white/40 hover:ring-4 hover:ring-white/50 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Buka Layar Penuh ↗</span>
              </div>
              <div className="pointer-events-none sm:pointer-events-auto">
                <MockupScreen2 isPreview={true} onNavigate={switchTab} />
              </div>
            </section>

            {/* Bottom-Left: Screen 3 (Beranda Siswa) */}
            <section
              onClick={() => switchTab("beranda")}
              className="bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white/40 hover:ring-4 hover:ring-white/50 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Buka Layar Penuh ↗</span>
              </div>
              <div className="pointer-events-none sm:pointer-events-auto">
                <MockupScreen3 isPreview={true} onNavigate={switchTab} />
              </div>
            </section>

            {/* Bottom-Right: Screen 4 (Dashboard Admin) */}
            <section
              onClick={() => switchTab("admin")}
              className="bg-white rounded-[28px] shadow-2xl overflow-hidden border border-white/40 hover:ring-4 hover:ring-white/50 transition-all duration-300 cursor-pointer group relative"
            >
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Buka Layar Penuh ↗</span>
              </div>
              <div className="pointer-events-none sm:pointer-events-auto">
                <MockupScreen4 isPreview={true} onNavigate={switchTab} />
              </div>
            </section>

          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: FULL-SCREEN INDIVIDUAL SCREENS (100% FULL DESKTOP VIEW)           */}
      {/* ========================================================================= */}
      {activeTab === "asesmen" && (
        <div className="w-full">
          <MockupScreen1 isPreview={false} onNavigate={switchTab} />
        </div>
      )}

      {activeTab === "hasil" && (
        <div className="w-full">
          <MockupScreen2 isPreview={false} onNavigate={switchTab} />
        </div>
      )}

      {activeTab === "beranda" && (
        <div className="w-full">
          <MockupScreen3 isPreview={false} onNavigate={switchTab} />
        </div>
      )}

      {activeTab === "admin" && (
        <div className="w-full">
          <MockupScreen4 isPreview={false} onNavigate={switchTab} />
        </div>
      )}

    </div>
  );
}
