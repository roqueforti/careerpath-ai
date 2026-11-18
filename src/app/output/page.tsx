"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, Award } from "lucide-react";
import RiasecRadarChart from "@/components/RiasecRadarChart";

export default function OutputPage() {
  return (
    <div className="w-full space-y-6">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 rounded-xl border border-[#e8ebf8] bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Ambil Asesmen Baru
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#5452e6] text-[10px] font-black uppercase tracking-wider">
              Investigative &middot; Realistic
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-medium">
              Analisis Minat Psikometri O*NET v31.0
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hasil Asesmen Kariermu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Berikut adalah hasil analisis minat dan rekomendasi karier untukmu.
          </p>
        </div>

        {/* 2-Column Grid: Left Radar Chart, Right Match & Recommendation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Card: Profil Minat RIASEC (Hexagon Radar Chart) */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">Profil Minat RIASEC</span>
              <span className="text-xs text-slate-400">Skala 1 - 20</span>
            </div>

            <div className="py-4">
              <RiasecRadarChart
                scores={{ R: 11, I: 16, A: 12, S: 8, E: 10, C: 13 }}
                maxScore={20}
              />
            </div>

            <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div>
                <strong className="text-slate-800">Tipe Dominan: </strong>
                <span className="text-[#5452e6] font-bold">Investigative (I)</span>
                <span> &amp; <span className="text-slate-700 font-semibold">Conventional (C)</span></span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Kecenderungan kuat pada pemecahan masalah analitis, investigasi data empiris, dan struktur logika sistematis.
              </p>
            </div>
          </div>

          {/* Right Column: Score & Primary Recommendation */}
          <div className="flex flex-col space-y-5">
            
            {/* 92% Circular Match Score */}
            <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex items-center justify-between gap-5">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#2dd4bf"
                    strokeWidth="3.5"
                    strokeDasharray="92, 100"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-base font-black text-slate-900">92%</span>
              </div>

              <div className="flex-1 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Tingkat Keselarasan
                </span>
                <h3 className="text-base font-black text-slate-900">Kecocokan Karier</h3>
                <span className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-600">
                  Sangat Tinggi ↗
                </span>
              </div>
            </div>

            {/* Primary Recommendation Card with Mentor Woman Illustration */}
            <div className="bg-gradient-to-r from-amber-50/80 via-rose-50/60 to-purple-50/80 rounded-2xl p-5 border border-amber-200/60 flex items-center justify-between gap-4 flex-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                  Rekomendasi Utama ↗
                </span>
                <h4 className="text-lg font-black text-slate-900">Data Scientist</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs">
                  Karier yang sesuai dengan minat dan potensimu di bidang analisis data, pemodelan statistik, dan machine learning.
                </p>
                <Link
                  href="/career-map/data-scientist"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5452e6] hover:underline pt-2"
                >
                  <span>Pelajari Roadmap Okupasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="w-24 h-28 relative shrink-0">
                <img
                  src="/illustrations/mentor-woman.jpg"
                  alt="Career mentor"
                  className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Row: Skill Gap & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Skill Gap Analysis */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] space-y-3">
            <span className="text-sm font-bold text-slate-900 block">Analisis Skill Gap</span>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Analytical Thinking</span>
                  <span className="font-bold text-slate-900">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5452e6] rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Problem Solving</span>
                  <span className="font-bold text-slate-900">78%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#fb923c] rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>Data Literacy</span>
                  <span className="font-bold text-slate-900">70%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2dd4bf] rounded-full" style={{ width: "70%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Langkah Selanjutnya */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col justify-between space-y-3">
            <span className="text-sm font-bold text-slate-900 block">Langkah Selanjutnya</span>
            <div className="space-y-2.5 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pelajari lebih lanjut tentang profesi Data Scientist</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Ikuti kursus Analisis Data &amp; SQL di bursa peluang terkurasi</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Rancang rencana aksi IDP untuk semester ini</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/development-plans"
                className="text-xs font-bold text-[#5452e6] hover:underline flex items-center gap-1"
              >
                <span>Buka Rencana Aksi (IDP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
