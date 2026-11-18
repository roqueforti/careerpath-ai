"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Award,
  Briefcase,
  TrendingUp,
  Users,
  UserCheck,
  BarChart3,
  BookOpen,
  Bell,
  Star,
  ExternalLink,
  HelpCircle,
  Settings,
  ChevronRight,
  Layers,
  GraduationCap,
  FileCheck,
  Plus,
  Send,
} from "lucide-react";
import RiasecRadarChart from "@/components/RiasecRadarChart";
import { UserActivityLineChart, CareerInterestDonutChart } from "@/components/AdminAnalyticsCharts";

export default function HomePage() {
  // View mode: "all" (2x2 Grid like user reference screenshot), "hero_assess", "results", "student_dash", "admin_dash"
  const [activeTab, setActiveTab] = useState<"all" | "student_dash" | "hero_assess" | "results" | "admin_dash">("all");

  // Assessment question state for interactive demo
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLikert, setSelectedLikert] = useState<number>(4);

  const sampleQuestions = [
    { text: "Saya lebih suka menganalisis data dan mencari pola.", dimension: "INVESTIGATIVE" },
    { text: "Saya senang merakit perangkat keras komputer atau alat mekanis.", dimension: "REALISTIC" },
    { text: "Saya gemar merancang visual antarmuka atau ilustrasi digital.", dimension: "ARTISTIC" },
    { text: "Saya antusias mendengarkan dan membantu memecahkan masalah teman.", dimension: "SOCIAL" },
    { text: "Saya berani mempresentasikan ide bisnis di hadapan publik.", dimension: "ENTERPRISING" },
    { text: "Saya menyukai pekerjaan teratur dengan SOP dan spreadsheet rapi.", dimension: "CONVENTIONAL" },
  ];

  const currentQ = sampleQuestions[currentQuestionIndex];
  const progressPct = Math.round(((currentQuestionIndex + 1) / sampleQuestions.length) * 100);

  return (
    <div className="w-full flex flex-col space-y-5 pb-16">
      
      {/* Top View Selector Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl p-2 sm:p-2.5 border border-[#e8ebf8] shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-[#5452e6] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            ✦ Tampilan Penuh (Grid 2 &times; 2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("hero_assess")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "hero_assess"
                ? "bg-[#5452e6] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            1. Input Asesmen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "results"
                ? "bg-[#5452e6] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            2. Hasil &amp; Rekomendasi
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("student_dash")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "student_dash"
                ? "bg-[#5452e6] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            3. Beranda Siswa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("admin_dash")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "admin_dash"
                ? "bg-[#5452e6] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            4. Dashboard Admin
          </button>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 hidden md:block">
          Desain Visual Standard &mdash; CareerPath AI
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2X2 GRID OR SINGLE VIEW CONTAINER                                         */}
      {/* ========================================================================= */}
      <div
        className={
          activeTab === "all"
            ? "grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6"
            : "w-full space-y-6"
        }
      >

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 1 (Top-Left): INPUT ASESMEN / HERO BANNER                          */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "hero_assess") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] flex flex-col justify-between space-y-6">
            
            {/* Top Banner with Student Desk Vector Illustration */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff9ea] via-[#fbf8fe] to-[#f2effe] p-6 sm:p-8 border border-amber-100/60">
              {/* Background soft pastel ambient circles */}
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-amber-200/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-purple-200/40 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Text */}
                <div className="flex-1 space-y-3 text-left">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">
                    Temukan Arah Kariermu <br className="hidden sm:inline" />
                    Bersama <span className="text-[#5452e6]">CareerPath AI</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md leading-relaxed">
                    Kenali minat, potensi, dan jelajahi peluang karier terbaik untuk masa depanmu melalui asesmen psikometri terstandar.
                  </p>
                </div>

                {/* Right Illustration */}
                <div className="w-48 sm:w-56 h-48 sm:h-52 relative shrink-0 flex items-center justify-center">
                  <img
                    src="/illustrations/student-desk.jpg"
                    alt="Student at desk with laptop"
                    className="w-full h-full object-contain rounded-2xl drop-shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Question Taking Card */}
            <div className="bg-[#fafbff] rounded-2xl p-5 sm:p-6 border border-[#e8ebf8] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Asesmen Minat Karier Holland RIASEC
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Pilih tingkat kesetujuanmu pada setiap pernyataan berikut (1 = Sangat Tidak Setuju, 5 = Sangat Setuju).
                  </p>
                </div>
                <div className="flex flex-col items-start sm:items-end shrink-0">
                  <span className="text-xs font-bold text-[#5452e6]">Progress: {progressPct}%</span>
                  <div className="w-28 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-[#5452e6] rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Question Statement Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-800 flex-1">
                  {currentQ.text}
                </span>

                {/* Likert Scale 1-5 Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSelectedLikert(val)}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        selectedLikert === val
                          ? "bg-[#5452e6] text-white shadow-md shadow-purple-500/30 scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => {
                    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentQuestionIndex < sampleQuestions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1);
                    } else {
                      setActiveTab("results");
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#5452e6] hover:bg-[#433ec8] text-white font-bold text-xs shadow-sm shadow-purple-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 2 (Top-Right): HASIL ASESMEN KARIERMU                              */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "results") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] flex flex-col justify-between space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Hasil Asesmen Kariermu
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Berikut adalah hasil analisis minat dan rekomendasi karier untukmu.
              </p>
            </div>

            {/* Grid 2 Columns: Left Radar Chart, Right Recommendation & Match */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-stretch">
              
              {/* Left Card: Profil Minat RIASEC (Hexagon Radar Chart) */}
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-800 mb-2 block">
                  Profil Minat RIASEC
                </span>
                <div className="py-2">
                  <RiasecRadarChart
                    scores={{ R: 10, I: 15, A: 12, S: 8, E: 11, C: 13 }}
                  />
                </div>
              </div>

              {/* Right Stack: Match Score & Recommendation */}
              <div className="flex flex-col space-y-4">
                
                {/* Match Score Card */}
                <div className="bg-[#fafbff] rounded-2xl p-4 border border-[#e8ebf8] flex items-center justify-between gap-4">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
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
                    <span className="absolute text-sm font-black text-slate-900">92%</span>
                  </div>

                  <div className="flex-1">
                    <span className="text-xs font-bold text-slate-800 block">Kecocokan Karier</span>
                    <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                      Sangat Tinggi ↗
                    </span>
                  </div>
                </div>

                {/* Primary Recommendation Card with Mentor Woman Illustration */}
                <div className="bg-gradient-to-r from-amber-50/70 to-rose-50/70 rounded-2xl p-4 border border-amber-200/50 flex items-center justify-between gap-3 flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
                      Rekomendasi Utama ↗
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">Data Scientist</h4>
                    <p className="text-[11px] text-slate-600 font-medium leading-relaxed max-w-[210px]">
                      Karier yang sesuai dengan minat dan potensimu di bidang analisis data.
                    </p>
                  </div>

                  <div className="w-20 h-24 relative shrink-0">
                    <img
                      src="/illustrations/mentor-woman.jpg"
                      alt="Career mentor recommendation"
                      className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Row: Skill Gap & Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Analisis Skill Gap */}
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Analisis Skill Gap</span>
                <div className="space-y-2.5">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Analytical Thinking</span>
                      <span className="font-bold text-slate-900">85%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5452e6] rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Problem Solving</span>
                      <span className="font-bold text-slate-900">78%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#fb923c] rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
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
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] flex flex-col justify-between space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Langkah Selanjutnya</span>
                <div className="space-y-2 text-xs font-medium text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Pelajari lebih lanjut tentang profesi Data Scientist</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Ikuti kursus Analisis Data</span>
                  </div>
                </div>
                <Link
                  href="/career-map/data-scientist"
                  className="text-xs font-bold text-[#5452e6] hover:text-[#433ec8] flex items-center gap-1 pt-1"
                >
                  <span>Lihat Detail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 3 (Bottom-Left): BERANDA SISWA / DASHBOARD                         */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "student_dash") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] flex flex-col justify-between space-y-6">
            
            {/* Welcome Banner with Rocket Student Illustration */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fbf8fe] via-[#f4effe] to-[#eef6ff] p-6 border border-purple-100/60">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      Halo, Aditya! 👋
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Level 1</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Terus berkembang dan wujudkan karier impianmu!
                  </p>
                </div>

                <div className="w-32 h-28 relative shrink-0">
                  <img
                    src="/illustrations/student-rocket.jpg"
                    alt="Student with rocket"
                    className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Stepper: Progres Perjalanan Kariermu */}
            <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] space-y-4">
              <span className="text-xs font-bold text-slate-800 block">Progres Perjalanan Kariermu</span>
              
              <div className="grid grid-cols-4 gap-2 relative">
                {/* Connecting bar */}
                <div className="absolute top-3.5 left-8 right-8 h-0.5 bg-slate-200 -z-0" />

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
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span className="text-xs font-bold text-slate-700">Plan</span>
                  <span className="text-[10px] text-slate-400 font-medium">Rencanakan Tujuan</span>
                </div>

                {/* Step 3: Develop */}
                <div className="flex flex-col items-center text-center space-y-1 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                    3
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

            {/* 3 Quick Cards: Profil & Minat, Skill Passport, Peluang Karier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Card 1: Profil & Minat */}
              <div className="bg-[#fafbff] rounded-2xl p-4 border border-[#e8ebf8] flex flex-col justify-between space-y-2">
                <span className="text-[11px] font-bold text-slate-500">Profil &amp; Minat</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    ✓
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-tight">92%</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Kecocokan Karier</span>
                  </div>
                </div>
                <Link href="/output" className="text-[10px] font-bold text-[#5452e6] hover:underline pt-1">
                  Lihat Detail ➔
                </Link>
              </div>

              {/* Card 2: Skill Passport */}
              <div className="bg-[#fafbff] rounded-2xl p-4 border border-[#e8ebf8] flex flex-col justify-between space-y-2">
                <span className="text-[11px] font-bold text-slate-500">Skill Passport</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                    🏆
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-tight">5</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Sertifikat &amp; Skill</span>
                  </div>
                </div>
                <Link href="/portfolio" className="text-[10px] font-bold text-[#5452e6] hover:underline pt-1">
                  Lihat Portofolio ➔
                </Link>
              </div>

              {/* Card 3: Peluang Karier */}
              <div className="bg-[#fafbff] rounded-2xl p-4 border border-[#e8ebf8] flex flex-col justify-between space-y-2">
                <span className="text-[11px] font-bold text-slate-500">Peluang Karier</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-sm">
                    💼
                  </div>
                  <div>
                    <span className="text-base font-black text-slate-900 block leading-tight">128+</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Lowongan Relevan</span>
                  </div>
                </div>
                <Link href="/opportunities" className="text-[10px] font-bold text-[#5452e6] hover:underline pt-1">
                  Lihat Semua ➔
                </Link>
              </div>

            </div>

            {/* Rekomendasi AI Career Mentor Box */}
            <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120"
                  alt="AI Mentor Avatar"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Rekomendasi AI Career Mentor</span>
                  <p className="text-xs text-slate-600 font-medium italic">
                    &ldquo;Terus asah kemampuan analisis datamu, Aditya. Kamu punya potensi besar di bidang teknologi!&rdquo;
                  </p>
                </div>
              </div>

              <Link
                href="/ai-mentor"
                className="px-4 py-2.5 rounded-xl bg-[#5452e6] hover:bg-[#433ec8] text-white font-bold text-xs shadow-sm shadow-purple-500/25 transition-all flex items-center gap-1.5 shrink-0 justify-center"
              >
                <span>Chat Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* VIEW 4 (Bottom-Right): DASHBOARD ADMIN                                  */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === "all" || activeTab === "admin_dash") && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] flex flex-col justify-between space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Dashboard Admin
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Ringkasan data dan aktivitas platform CareerPath AI
              </p>
            </div>

            {/* 4 Stat Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-[#fafbff] rounded-2xl p-3.5 border border-[#e8ebf8] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    👥
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pengguna</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">12.480</div>
                <div className="text-[10px] font-bold text-emerald-600">&uarr; 12% dari bln lalu</div>
              </div>

              <div className="bg-[#fafbff] rounded-2xl p-3.5 border border-[#e8ebf8] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                    👤
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Mentor</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">42</div>
                <div className="text-[10px] font-bold text-emerald-600">&uarr; 8% aktif</div>
              </div>

              <div className="bg-[#fafbff] rounded-2xl p-3.5 border border-[#e8ebf8] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                    📊
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Aktivitas</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">86%</div>
                <div className="text-[10px] font-bold text-emerald-600">&uarr; 5% interaksi</div>
              </div>

              <div className="bg-[#fafbff] rounded-2xl p-3.5 border border-[#e8ebf8] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                    💼
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lowongan</span>
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">128</div>
                <div className="text-[10px] font-bold text-emerald-600">&uarr; 10% baru</div>
              </div>

            </div>

            {/* 2 Middle Charts: Tren Aktivitas & Distribusi Minat */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tren Aktivitas Pengguna (Line Chart) */}
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Tren Aktivitas Pengguna
                </span>
                <UserActivityLineChart />
              </div>

              {/* Distribusi Minat Karier (Donut Chart) */}
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Distribusi Minat Karier
                </span>
                <div className="py-2">
                  <CareerInterestDonutChart />
                </div>
              </div>

            </div>

            {/* Bottom Row: Quick Management & System Update */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Manajemen Cepat */}
              <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Manajemen Cepat</span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/admin#users"
                    className="p-2.5 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#5452e6]" />
                    <span>Tambah Pengguna</span>
                  </Link>

                  <Link
                    href="/admin#mentors"
                    className="p-2.5 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#5452e6]" />
                    <span>Kelola Mentor</span>
                  </Link>

                  <Link
                    href="/admin#content"
                    className="p-2.5 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#5452e6]" />
                    <span>Kelola Konten</span>
                  </Link>

                  <Link
                    href="/admin#analytics"
                    className="p-2.5 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-[#5452e6]" />
                    <span>Lihat Laporan</span>
                  </Link>
                </div>
              </div>

              {/* Update Sistem with Mentor Illustration */}
              <div className="bg-gradient-to-r from-purple-50/70 to-blue-50/70 rounded-2xl p-4 border border-purple-200/50 flex items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#5452e6]">
                    <span>📢</span>
                    <span>Update Sistem</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Versi 1.0.0 telah dirilis dengan fitur analitik yang lebih lengkap dan integrasi Supabase.
                  </p>
                  <Link href="/admin" className="text-xs font-bold text-[#5452e6] hover:underline inline-block pt-1">
                    Lihat Detail ➔
                  </Link>
                </div>

                <div className="w-20 h-24 relative shrink-0">
                  <img
                    src="/illustrations/mentor-woman.jpg"
                    alt="System update advisor"
                    className="w-full h-full object-contain rounded-xl drop-shadow-sm"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
