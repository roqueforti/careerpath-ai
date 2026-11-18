"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  Target,
  FileCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
  ExternalLink,
  Star,
} from "lucide-react";

interface DashboardData {
  studentName: string;
  educationLevel: string;
  careerMaturity: "EXPLORE" | "PLAN" | "DEVELOP" | "READY";
  careerMaturityScore: number;
  assessmentCompleted: boolean;
  hollandSummary?: string | null;
  targetCareerTitle?: string | null;
  targetCareerCategory?: string | null;
  activeIdp?: {
    id: string;
    title: string;
    progressPercentage: number;
    activityCount: number;
    completedCount: number;
  } | null;
  pendingTasksCount: number;
  skillPassportCounts: {
    claimed: number;
    evidenceBacked: number;
    mentorValidated: number;
  };
  recentNotifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/analytics/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json.dashboard);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full py-24 text-center font-sans">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-300 border-t-[#5452e6] mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Memuat Dashboard Karier...
        </p>
      </div>
    );
  }

  const d = data || {
    studentName: "Aditya",
    educationLevel: "MAHASISWA",
    careerMaturity: "EXPLORE" as const,
    careerMaturityScore: 92,
    assessmentCompleted: true,
    hollandSummary: "Investigative · Realistic",
    targetCareerTitle: "Data Scientist",
    targetCareerCategory: "Teknologi Informasi",
    activeIdp: {
      id: "idp-001",
      title: "Rencana Akselerasi Menuju Data Scientist 2026",
      progressPercentage: 65,
      activityCount: 4,
      completedCount: 2,
    },
    pendingTasksCount: 1,
    skillPassportCounts: { claimed: 2, evidenceBacked: 2, mentorValidated: 1 },
    recentNotifications: [],
  };

  const displayName = d.studentName?.split(" ")[0] || "Aditya";

  return (
    <div className="w-full space-y-6">
      
      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] space-y-6">
        
        {/* Welcome Banner with Rocket Student Illustration */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fbf8fe] via-[#f4effe] to-[#eef6ff] p-6 sm:p-8 border border-purple-100/60">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Halo, {displayName}! 👋
                </h1>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Level 1</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Terus berkembang dan wujudkan karier impianmu bersama sistem bimbingan berbasis data.
              </p>
            </div>

            <div className="w-36 sm:w-44 h-32 sm:h-36 relative shrink-0">
              <img
                src="/illustrations/student-rocket.jpg"
                alt="Student with rocket"
                className="w-full h-full object-contain rounded-2xl drop-shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Stepper: Progres Perjalanan Kariermu */}
        <div className="bg-[#fafbff] rounded-2xl p-5 sm:p-6 border border-[#e8ebf8] space-y-4">
          <span className="text-xs font-bold text-slate-800 block">Progres Perjalanan Kariermu</span>
          
          <div className="grid grid-cols-4 gap-2 relative">
            {/* Connecting bar */}
            <div className="absolute top-3.5 left-10 right-10 h-0.5 bg-slate-200 -z-0" />

            {/* Step 1: Explore */}
            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
              <div className="w-7 h-7 rounded-full bg-[#5452e6] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                ✓
              </div>
              <span className="text-xs font-bold text-slate-900">Explore</span>
              <span className="text-[10px] text-slate-400 font-medium">Kenali Minat</span>
            </div>

            {/* Step 2: Plan */}
            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                d.targetCareerTitle ? "bg-[#5452e6] text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {d.targetCareerTitle ? "✓" : "2"}
              </div>
              <span className="text-xs font-bold text-slate-700">Plan</span>
              <span className="text-[10px] text-slate-400 font-medium">Rencanakan Tujuan</span>
            </div>

            {/* Step 3: Develop */}
            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                d.activeIdp ? "bg-[#5452e6] text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {d.activeIdp ? "✓" : "3"}
              </div>
              <span className="text-xs font-bold text-slate-700">Develop</span>
              <span className="text-[10px] text-slate-400 font-medium">Kembangkan Kompetensi</span>
            </div>

            {/* Step 4: Ready */}
            <div className="flex flex-col items-center text-center space-y-1 relative z-10">
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                4
              </div>
              <span className="text-xs font-bold text-slate-700">Ready</span>
              <span className="text-[10px] text-slate-400 font-medium">Siap Berkarier</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards: Profil & Minat, Skill Passport, Peluang Karier */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Profil & Minat */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-slate-500">Profil &amp; Minat</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-base">
                ✓
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-tight">
                  {d.careerMaturityScore || 92}%
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Kecocokan Karier</span>
              </div>
            </div>
            <Link href="/output" className="text-xs font-bold text-[#5452e6] hover:underline pt-1">
              Lihat Detail ➔
            </Link>
          </div>

          {/* Card 2: Skill Passport */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-slate-500">Skill Passport</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-base">
                🏆
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-tight">
                  {(d.skillPassportCounts.claimed + d.skillPassportCounts.evidenceBacked + d.skillPassportCounts.mentorValidated) || 5}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Sertifikat &amp; Skill</span>
              </div>
            </div>
            <Link href="/portfolio" className="text-xs font-bold text-[#5452e6] hover:underline pt-1">
              Lihat Portofolio ➔
            </Link>
          </div>

          {/* Card 3: Peluang Karier */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-slate-500">Peluang Karier</span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-base">
                💼
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-tight">128+</span>
                <span className="text-[11px] text-slate-400 font-semibold">Lowongan Relevan</span>
              </div>
            </div>
            <Link href="/opportunities" className="text-xs font-bold text-[#5452e6] hover:underline pt-1">
              Lihat Semua ➔
            </Link>
          </div>

        </div>

        {/* Rekomendasi AI Career Mentor Box */}
        <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120"
              alt="AI Mentor Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200 shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 block">Rekomendasi AI Career Mentor</span>
              <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
                &ldquo;Terus asah kemampuan analisis datamu, {displayName}. Kamu punya potensi besar di bidang teknologi!&rdquo;
              </p>
            </div>
          </div>

          <Link
            href="/ai-mentor"
            className="px-5 py-2.5 rounded-xl bg-[#5452e6] hover:bg-[#433ec8] text-white font-bold text-xs shadow-sm shadow-purple-500/25 transition-all flex items-center gap-2 shrink-0 justify-center cursor-pointer"
          >
            <span>Chat Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
