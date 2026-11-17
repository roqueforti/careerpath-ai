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
} from "lucide-react";
import { MaturityBadge } from "@/components/MaturityBadge";

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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 text-center font-sans">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Mengalkulasi Metrik Blueprint Karier...
        </p>
      </div>
    );
  }

  const d = data || {
    studentName: "Pengguna",
    educationLevel: "MAHASISWA",
    careerMaturity: "EXPLORE" as const,
    careerMaturityScore: 10,
    assessmentCompleted: false,
    hollandSummary: null,
    targetCareerTitle: null,
    targetCareerCategory: null,
    activeIdp: null,
    pendingTasksCount: 0,
    skillPassportCounts: { claimed: 0, evidenceBacked: 0, mentorValidated: 0 },
    recentNotifications: [],
  };

  const readinessPercentage = d.careerMaturityScore || 15;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans pb-20 selection:bg-red-600 selection:text-white">
      {/* 1. Kinetic Marquee Ticker */}
      <div className="w-full bg-stone-950 text-white overflow-hidden py-2 border-b border-stone-850">
        <div className="flex items-center gap-8 whitespace-nowrap text-[11px] font-mono tracking-wider animate-pulse">
          <span>✦ LIVE METRICS</span>
          <span>RIASEC: {d.hollandSummary || "DIAGNOSIS IN-FLIGHT"}</span>
          <span>STAGE: {d.careerMaturity} ({readinessPercentage}%)</span>
          <span>TARGET: {d.targetCareerTitle || "EKSPLORASI TERBUKA"}</span>
          <span>EVIDENCE PASSPORT: {d.skillPassportCounts.mentorValidated} VALIDATED</span>
          <span>✦ 12,400+ EARLY CAREER COHORTS</span>
          <span>✦ LIVE METRICS</span>
          <span>RIASEC: {d.hollandSummary || "DIAGNOSIS IN-FLIGHT"}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* 2. Massive Editorial Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero Statement (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 dark:text-red-300 px-2.5 py-1 rounded-full border border-red-200/60 dark:border-red-900/50">
                  COHORT 2026 // {d.educationLevel}
                </span>
                <span className="text-[11px] font-mono text-stone-400">·</span>
                <span className="text-xs font-semibold text-stone-500">
                  Evidence-Based Career Blueprint
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-950 dark:text-white leading-[0.98]">
                CAREER <br />
                <span className="text-red-600">BLUEPRINT.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                Halo, <strong className="text-stone-950 dark:text-white">{d.studentName}</strong>. Rekam jejak kompetensi, kematangan karier, dan rencana aksi semestermu diproses secara deterministik berdasarkan bukti capaian nyata.
              </p>
            </div>

            {/* Quick Action Pill Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <Link
                href="/ai-mentor"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Konsultasi AI Mentor</span>
              </Link>
              <Link
                href="/development-plans"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-5 py-2.5 text-xs font-bold text-stone-850 hover:border-stone-900 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 transition-all"
              >
                <Target className="h-3.5 w-3.5 text-red-600" />
                <span>Buka Rencana IDP</span>
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-5 py-2.5 text-xs font-bold text-stone-850 hover:border-stone-900 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 transition-all"
              >
                <FileCheck className="h-3.5 w-3.5 text-stone-500" />
                <span>Upload Bukti Karya</span>
              </Link>
            </div>

            {/* Big Readiness Gauge Panel */}
            <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 sm:p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-950 dark:text-white">
                    Career Readiness Gauge
                  </span>
                </div>
                <MaturityBadge stage={d.careerMaturity} />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div className="text-5xl sm:text-6xl font-black text-stone-950 dark:text-white tracking-tight">
                  {readinessPercentage}
                  <span className="text-xl font-normal text-stone-400">/100</span>
                </div>
                <div className="text-xs font-mono font-bold text-red-600">
                  STAGE: {d.careerMaturity} · MATURITY LEVEL
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden mb-5">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, readinessPercentage)}%` }}
                />
              </div>

              {/* Verification Checklist Stamps */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      d.assessmentCompleted ? "text-emerald-600" : "text-stone-300"
                    }`}
                  />
                  <span>RIASEC Test</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      d.targetCareerTitle ? "text-emerald-600" : "text-stone-300"
                    }`}
                  />
                  <span>Target Profesi</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      d.activeIdp ? "text-emerald-600" : "text-stone-300"
                    }`}
                  />
                  <span>Aksi IDP</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 shrink-0 ${
                      d.skillPassportCounts.mentorValidated > 0 ? "text-emerald-600" : "text-stone-300"
                    }`}
                  />
                  <span>Bukti Mentor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Exhibit (5 cols) with Young College Student Photography */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900 h-full flex flex-col">
              <div className="relative flex-1 min-h-[460px] lg:min-h-[520px] rounded-[24px] overflow-hidden border border-stone-100 dark:border-stone-800">
                <img
                  src="/woman_white_blazer_red.jpg"
                  alt="Young College Student and Early Career Cohort"
                  className="w-full h-full object-cover object-center"
                />

                {/* Floating Top Badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/95 text-stone-900 backdrop-blur-md px-3.5 py-1 text-xs font-semibold shadow-xs border border-stone-200/80 dark:bg-stone-900/95 dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>94% Kesiapan Kerja</span>
                </div>

                {/* Floating Bottom Insight Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-100 dark:border-stone-700 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                      TARGET PROFESI PILIHAN
                    </span>
                    <span className="rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {d.targetCareerCategory || "GENERAL"}
                    </span>
                  </div>

                  <p className="text-base font-black text-stone-950 dark:text-white truncate">
                    {d.targetCareerTitle || "Belum Menentukan Target"}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] text-stone-500">
                      {d.assessmentCompleted ? "Tervalidasi Minat Holland" : "Selesaikan asesmen untuk mencocokkan"}
                    </span>
                    <Link
                      href="/career-map"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700"
                    >
                      Peta Jalur <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Subway Roadmap Pathway (Replacing Boring Cards!) */}
        <div className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                LIFECYCLE · PROGRESSION METRO
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-white mt-1">
                Jalur Navigasi Karier Mahasiswa
              </h2>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              STATUS: {d.careerMaturity} COHORT
            </span>
          </div>

          {/* Interactive Metro / Subway Line */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: ASSESS */}
            <div className="relative rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 group hover:border-red-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600">
                  01 // ASSESS
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.assessmentCompleted
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  {d.assessmentCompleted ? "SELESAI" : "PENDING"}
                </span>
              </div>
              <p className="text-sm font-bold text-stone-950 dark:text-white">
                Pemetaan Minat RIASEC
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {d.assessmentCompleted
                  ? `Holland Code: ${d.hollandSummary || "Terpetakan"}`
                  : "Uji 6 dimensi Holland Code untuk memetakan DNA kariermu."}
              </p>
              <Link
                href="/assessments"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
              >
                {d.assessmentCompleted ? "Lihat Hasil Asesmen" : "Mulai Tes Sekarang"}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 2: MAP */}
            <div className="relative rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 group hover:border-red-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600">
                  02 // MAP
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.targetCareerTitle
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  {d.targetCareerTitle ? "TERKUNCI" : "EKSPLORASI"}
                </span>
              </div>
              <p className="text-sm font-bold text-stone-950 dark:text-white truncate">
                {d.targetCareerTitle || "Pilih Target Okupasi"}
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Peta profesi O*NET dengan perhitungan explainable fit dan gap kompetensi.
              </p>
              <Link
                href="/career-map"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
              >
                Eksplorasi Peta Karier <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 3: PLAN */}
            <div className="relative rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 group hover:border-red-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600">
                  03 // PLAN
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.activeIdp
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  {d.activeIdp ? `${d.activeIdp.progressPercentage}% SELESAI` : "BELUM AKTIF"}
                </span>
              </div>
              <p className="text-sm font-bold text-stone-950 dark:text-white">
                Individual Dev Plan (IDP)
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {d.activeIdp
                  ? `${d.activeIdp.completedCount} dari ${d.activeIdp.activityCount} aktivitas terselesaikan.`
                  : "Target aksi semester, sertifikasi, dan kurasi proyek mandiri."}
              </p>
              <Link
                href="/development-plans"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
              >
                Kelola Roadmap IDP <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Step 4: PROVE */}
            <div className="relative rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 group hover:border-red-600 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600">
                  04 // PROVE
                </span>
                <span className="rounded-full bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 px-2.5 py-0.5 text-[10px] font-bold">
                  {d.skillPassportCounts.mentorValidated} VALIDATED
                </span>
              </div>
              <p className="text-sm font-bold text-stone-950 dark:text-white">
                Skill Passport & Portofolio
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Bukti proyek dan sertifikasi dikurasi & divalidasi langsung oleh mentor.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 pt-1"
              >
                Lihat Paspor Bukti <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4. Asymmetrical Split: Skill Passport Credential vs Live Notification Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Passport Credential Passbook (7 cols) */}
          <div className="lg:col-span-7 rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-950 text-white dark:bg-white dark:text-stone-950">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-950 dark:text-white">
                      Skill Passport Credentials
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Standardisasi portofolio kompetensi 3-tier
                    </p>
                  </div>
                </div>
                <Link
                  href="/portfolio"
                  className="rounded-full bg-stone-950 hover:bg-black text-white px-4 py-1.5 text-xs font-semibold self-start transition-all"
                >
                  Buka Passport Lengkap →
                </Link>
              </div>

              {/* 3 Metric Stamps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-850">
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-500">
                    TIER 1 · KLAIM
                  </span>
                  <div className="text-3xl font-black text-stone-950 dark:text-white mt-1">
                    {d.skillPassportCounts.claimed}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Deklarasi mandiri tanpa lampiran.
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-850">
                  <span className="text-[10px] font-mono font-bold uppercase text-stone-600 dark:text-stone-300">
                    TIER 2 · BUKTI KARYA
                  </span>
                  <div className="text-3xl font-black text-stone-950 dark:text-white mt-1">
                    {d.skillPassportCounts.evidenceBacked}
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Didukung artefak proyek & repositori.
                  </p>
                </div>

                <div className="rounded-2xl border border-red-200/80 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
                  <span className="text-[10px] font-mono font-bold uppercase text-red-600 dark:text-red-300">
                    TIER 3 · VALIDASI MENTOR
                  </span>
                  <div className="text-3xl font-black text-red-600 mt-1">
                    {d.skillPassportCounts.mentorValidated}
                  </div>
                  <p className="text-[10px] text-red-700/80 dark:text-red-400 mt-1">
                    Resmi diverifikasi mentor industri.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick AI Mock Interview Teaser Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-stone-100/80 dark:bg-stone-800/80 p-4 border border-stone-200/60 dark:border-stone-700">
              <div className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-300">
                <Sparkles className="h-4 w-4 text-red-600 shrink-0" />
                <span>Uji kesiapan teknismu sebelum interview magang dengan AI simulator.</span>
              </div>
              <Link
                href="/ai-mentor"
                className="rounded-full bg-stone-950 text-white px-4 py-1.5 text-xs font-bold hover:bg-black transition-all shrink-0 text-center"
              >
                Mulai Tes Teks →
              </Link>
            </div>
          </div>

          {/* Live Notification & Activity Log (5 cols) */}
          <div className="lg:col-span-5 rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-stone-100 pb-5 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  <h3 className="text-base font-black text-stone-950 dark:text-white">
                    Live Feed & Notifikasi
                  </h3>
                </div>
                <span className="font-mono text-[11px] font-bold text-stone-400">
                  {d.pendingTasksCount} PENDING
                </span>
              </div>

              {d.recentNotifications.length > 0 ? (
                <div className="space-y-3.5 mt-5">
                  {d.recentNotifications.slice(0, 4).map((notif) => (
                    <div
                      key={notif.id}
                      className="rounded-2xl border border-stone-100 bg-stone-50/70 p-3.5 dark:border-stone-800 dark:bg-stone-850 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-950 dark:text-white">
                          {notif.title}
                        </span>
                        <span className="font-mono text-[10px] text-stone-400">
                          RECENT
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 p-8 text-center text-xs text-stone-500 mt-5">
                  <CheckCircle2 className="h-6 w-6 text-stone-300 mx-auto mb-2" />
                  Semua aktivitas dan penugasan IDP terkini telah tersinkronisasi.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
              <Link
                href="/mentoring"
                className="flex items-center justify-between text-xs font-bold text-stone-900 hover:text-red-600 dark:text-stone-200 dark:hover:text-red-400 transition-colors"
              >
                <span>Buka Portal Diskusi & Mentoring</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
