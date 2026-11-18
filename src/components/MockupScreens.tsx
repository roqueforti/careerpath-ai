"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  FileEdit,
  Sparkles,
  LayoutDashboard,
  Compass,
  Award,
  Briefcase,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Users,
  UserCheck,
  BarChart3,
  BookOpen,
  Plus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Star,
  Check,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import RiasecRadarChart from "@/components/RiasecRadarChart";
import { UserActivityLineChart, CareerInterestDonutChart } from "@/components/AdminAnalyticsCharts";

/* ========================================================================= */
/* FLOATING BADGES FOR ASESMEN BANNER                                        */
/* ========================================================================= */

export function FloatingScienceBadges() {
  return (
    <>
      {/* 1. Globe Badge (Cyan) */}
      <div className="hidden sm:flex absolute top-4 left-1/2 -translate-x-12 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs shadow-xs border border-sky-100 items-center justify-center pointer-events-none z-10">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3.6 9h16.8M3.6 15h16.8" />
          <path d="M12 3a14 14 0 0 0 0 18M12 3a14 14 0 0 1 0 18" />
        </svg>
      </div>

      {/* 2. Chemistry Flask / Beaker Badge (Teal) */}
      <div className="hidden sm:flex absolute top-14 left-1/3 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs shadow-xs border border-teal-100 items-center justify-center pointer-events-none z-10">
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <path d="M9 3h6M10 3v5l-4 7a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-4-7V3" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 15h9" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1" fill="#2dd4bf" />
          <circle cx="10" cy="14" r="0.8" fill="#2dd4bf" />
        </svg>
      </div>

      {/* 3. Dual Interlocking Gears (Blue & Orange) */}
      <div className="hidden sm:flex absolute top-4 right-20 items-center pointer-events-none z-10">
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-amber-500 -ml-2 -mt-2" fill="currentColor">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      </div>

      {/* 4. Artist Palette Badge (Coral with Colorful Dots) */}
      <div className="hidden sm:flex absolute top-18 right-8 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs shadow-xs border border-rose-100 items-center justify-center pointer-events-none z-10">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
          <path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4.5 3 4.5.8 0 1.5-.7 1.5-1.5 0-.5.2-.9.5-1.2.4-.4.9-.8 1.5-.8h1c3.9 0 7-3.1 7-7 0-2.2-.9-4-2.5-4z" fill="#fca5a5" stroke="#f43f5e" strokeWidth="1.5" />
          <circle cx="7.5" cy="8.5" r="1.3" fill="#f59e0b" />
          <circle cx="11.5" cy="6.5" r="1.3" fill="#10b981" />
          <circle cx="15.5" cy="8.5" r="1.3" fill="#3b82f6" />
          <circle cx="9.5" cy="12.5" r="1.3" fill="#8b5cf6" />
        </svg>
      </div>

      {/* 5. Green Plant Sprout at Bottom Left Corner */}
      <div className="absolute bottom-2 left-6 w-11 h-11 pointer-events-none z-10">
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <path d="M24 44 C24 30 14 26 8 26 C8 36 18 44 24 44 Z" fill="#2dd4bf" />
          <path d="M24 44 C24 28 34 22 40 22 C40 34 30 44 24 44 Z" fill="#14b8a6" />
          <path d="M24 44 L24 20" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </>
  );
}

/* ========================================================================= */
/* SCREEN 3: BERANDA SISWA (Halaman Utama / Dashboard Siswa)                 */
/* ========================================================================= */

export function ScreenBerandaSiswa() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[calc(100vh-2.5rem)]">
        
        {/* --- Sidebar Beranda Siswa --- */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-68 
            bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BrandLogo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)] transition-all"
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>Beranda</span>
              </Link>

              <Link
                href="/development-plans"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Compass className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Rencana Karier</span>
              </Link>

              <Link
                href="/portfolio"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Skill Passport</span>
              </Link>

              <Link
                href="/opportunities"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Peluang Karier</span>
              </Link>

              <Link
                href="/ai-mentor"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
                <span>AI Career Mentor</span>
              </Link>

              <Link
                href="/#notifikasi"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Bell className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Notifikasi</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#bantuan"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Bantuan</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Pengaturan</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* --- Main Content Beranda Siswa --- */}
        <main className="flex-1 flex flex-col space-y-6 min-w-0">
          
          {/* Mobile Header Bar */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e8ebf8]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-[#5452e6]" />
            </button>
            <BrandLogo />
            <div className="w-8" />
          </div>

          {/* Welcome Banner with Rocket Student */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff9f2] via-[#faf6fe] to-[#f0ebfe] p-8 sm:p-11 border border-purple-100/50 shadow-xs">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                    Halo, Aditya! 👋
                  </h1>
                  <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Level 1</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Terus berkembang dan wujudkan karier impianmu!
                </p>
              </div>

              {/* Student Rocket Transparent Illustration */}
              <div className="w-48 sm:w-64 h-36 sm:h-48 relative shrink-0">
                <img
                  src="/illustrations/student-rocket.png"
                  alt="Student with rocket blasting off"
                  className="w-full h-full object-contain select-none"
                />
              </div>
            </div>
          </div>

          {/* Stepper: Progres Perjalanan Kariermu */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#e8ebf8] shadow-xs space-y-5">
            <span className="text-sm font-bold text-slate-900 block">
              Progres Perjalanan Kariermu
            </span>

            <div className="grid grid-cols-4 gap-2 relative pt-2">
              <div className="absolute top-6 left-12 right-12 h-0.5 bg-slate-200 -z-0" />

              {/* Step 1: Explore */}
              <Link href="/assessments" className="flex flex-col items-center text-center space-y-1.5 relative z-10 group">
                <div className="w-8 h-8 rounded-full bg-[#5452e6] text-white flex items-center justify-center text-xs font-black shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                  ✓
                </div>
                <span className="text-xs font-bold text-slate-900">Explore</span>
                <span className="text-[10px] text-slate-400 font-medium">Kenali Minat</span>
              </Link>

              {/* Step 2: Plan */}
              <Link href="/development-plans" className="flex flex-col items-center text-center space-y-1.5 relative z-10 group">
                <div className="w-8 h-8 rounded-full bg-[#5452e6] text-white flex items-center justify-center text-xs font-bold shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  2
                </div>
                <span className="text-xs font-bold text-slate-800">Plan</span>
                <span className="text-[10px] text-slate-400 font-medium">Rencanakan Tujuan</span>
              </Link>

              {/* Step 3: Develop */}
              <Link href="/portfolio" className="flex flex-col items-center text-center space-y-1.5 relative z-10 group">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold group-hover:bg-slate-300 transition-colors">
                  3
                </div>
                <span className="text-xs font-bold text-slate-600">Develop</span>
                <span className="text-[10px] text-slate-400 font-medium">Kembangkan Kompetensi</span>
              </Link>

              {/* Step 4: Ready */}
              <Link href="/opportunities" className="flex flex-col items-center text-center space-y-1.5 relative z-10 group">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold group-hover:bg-slate-300 transition-colors">
                  4
                </div>
                <span className="text-xs font-bold text-slate-600">Ready</span>
                <span className="text-[10px] text-slate-400 font-medium">Siap Berkarier</span>
              </Link>
            </div>
          </div>

          {/* 3 Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            
            {/* Card 1: Profil & Minat */}
            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex flex-col justify-between space-y-3">
              <span className="text-xs font-bold text-slate-500">Profil &amp; Minat</span>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-base">
                  ✓
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">92%</span>
                  <span className="text-xs text-slate-400 font-semibold">Kecocokan Karier</span>
                </div>
              </div>
              <Link
                href="/output"
                className="text-xs font-bold text-[#5452e6] hover:underline pt-1 text-left inline-flex items-center gap-1"
              >
                <span>Lihat Detail</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Skill Passport */}
            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex flex-col justify-between space-y-3">
              <span className="text-xs font-bold text-slate-500">Skill Passport</span>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-base">
                  🏆
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">5</span>
                  <span className="text-xs text-slate-400 font-semibold">Sertifikat &amp; Skill</span>
                </div>
              </div>
              <Link
                href="/portfolio"
                className="text-xs font-bold text-[#5452e6] hover:underline pt-1 inline-flex items-center gap-1"
              >
                <span>Lihat Portofolio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: Peluang Karier */}
            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex flex-col justify-between space-y-3">
              <span className="text-xs font-bold text-slate-500">Peluang Karier</span>
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-base">
                  💼
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block leading-tight">128+</span>
                  <span className="text-xs text-slate-400 font-semibold">Lowongan Relevan</span>
                </div>
              </div>
              <Link
                href="/opportunities"
                className="text-xs font-bold text-[#5452e6] hover:underline pt-1 inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* Bottom Banner: Rekomendasi AI Career Mentor */}
          <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120"
                alt="AI Mentor"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200 shrink-0"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 block">Rekomendasi AI Career Mentor</span>
                <p className="text-xs sm:text-sm text-slate-600 font-medium italic">
                  &ldquo;Terus asah kemampuan analisis datamu, Aditya. Kamu punya potensi besar di bidang teknologi!&rdquo;
                </p>
              </div>
            </div>

            <Link
              href="/ai-mentor"
              className="px-6 py-3 rounded-2xl bg-[#5452e6] hover:bg-[#433ec8] text-white font-bold text-xs shadow-sm shadow-purple-500/25 transition-all flex items-center gap-2 shrink-0 justify-center"
            >
              <span>Chat Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SCREEN 1: INPUT ASESMEN (/assessments)                                    */
/* ========================================================================= */

export function ScreenInputAsesmen() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLikert, setSelectedLikert] = useState<number>(4);
  const [qIndex, setQIndex] = useState(0);

  const sampleQuestions = [
    { text: "Saya lebih suka menganalisis data dan mencari pola.", dimension: "INVESTIGATIVE" },
    { text: "Saya senang merakit perangkat keras komputer atau alat mekanis.", dimension: "REALISTIC" },
    { text: "Saya gemar merancang visual antarmuka atau ilustrasi digital.", dimension: "ARTISTIC" },
    { text: "Saya antusias mendengarkan dan membantu memecahkan masalah teman.", dimension: "SOCIAL" },
    { text: "Saya berani mempresentasikan ide bisnis di hadapan publik.", dimension: "ENTERPRISING" },
    { text: "Saya menyukai pekerjaan teratur dengan SOP dan spreadsheet rapi.", dimension: "CONVENTIONAL" },
  ];

  const currentQ = sampleQuestions[qIndex];
  // Calculate dynamic progress
  const progressPct = Math.round(((qIndex + 1) / sampleQuestions.length) * 100);

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[calc(100vh-2.5rem)]">
        
        {/* --- Sidebar Input Asesmen --- */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-68 
            bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BrandLogo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Beranda</span>
              </Link>

              <Link
                href="/assessments"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)] transition-all"
              >
                <FileEdit className="w-4 h-4 shrink-0" />
                <span>Input Asesmen</span>
              </Link>

              <Link
                href="/output"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Hasil &amp; Rekomendasi</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#bantuan"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Bantuan</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Pengaturan</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* --- Main Content Input Asesmen --- */}
        <main className="flex-1 flex flex-col space-y-6 min-w-0">
          
          {/* Mobile Header Bar */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e8ebf8]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-[#5452e6]" />
            </button>
            <BrandLogo />
            <div className="w-8" />
          </div>

          {/* Top Banner with Student at Desk & Floating Badges */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff4dc] via-[#faf6ff] to-[#eee8fd] p-8 sm:p-11 border border-amber-100/60 shadow-xs">
            {/* Ambient Background Glows */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-purple-200/50 blur-3xl pointer-events-none" />

            {/* Floating Science, Gear, Palette & Sprout Icons */}
            <FloatingScienceBadges />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3.5 flex-1">
                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0f172a] tracking-tight leading-[1.12]">
                  Temukan Arah Kariermu<br />
                  Bersama CareerPath AI
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md leading-relaxed">
                  Kenali minat, potensi, dan jelajahi peluang karier terbaik untuk masa depanmu.
                </p>
              </div>

              {/* Student at Desk Transparent Illustration */}
              <div className="w-56 sm:w-72 h-56 sm:h-64 relative shrink-0 flex items-center justify-center">
                <img
                  src="/illustrations/student-desk.png"
                  alt="Student at desk with laptop"
                  className="w-full h-full object-contain select-none"
                />
              </div>
            </div>
          </div>

          {/* Lower RIASEC Question Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ebf8] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Asesmen Minat Karier Holland RIASEC
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Pilih tingkat kesetujuanmu pada setiap pernyataan berikut (1 = Sangat Tidak Setuju, 5 = Sangat Setuju).
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end shrink-0">
                <span className="text-xs font-bold text-[#5452e6]">Progress: {progressPct}%</span>
                <div className="w-32 h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-[#5452e6] rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Question Statement Box */}
            <div className="bg-[#f8faff] rounded-2xl p-5 sm:p-6 border border-[#edf0fa] flex flex-col md:flex-row md:items-center justify-between gap-5">
              <span className="text-sm font-semibold text-slate-800 flex-1 leading-relaxed">
                {currentQ.text}
              </span>

              {/* Likert Scale: 1, 2, 3, 4 (active), 5 */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSelectedLikert(val)}
                    className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      selectedLikert === val
                        ? "bg-[#5452e6] text-white shadow-md shadow-purple-500/30 scale-105"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => qIndex > 0 && setQIndex(qIndex - 1)}
                disabled={qIndex === 0}
                className="px-5 py-2.5 rounded-full border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 disabled:opacity-40 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (qIndex < sampleQuestions.length - 1) {
                    setQIndex(qIndex + 1);
                  } else {
                    router.push("/output");
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-[#5452e6] hover:bg-[#433ec8] text-white font-bold text-xs shadow-sm shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{qIndex < sampleQuestions.length - 1 ? "Lanjutkan" : "Lihat Hasil Rekomendasi"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SCREEN 2: HASIL ASESMEN KARIERMU (/output)                                */
/* ========================================================================= */

export function ScreenHasilAsesmen() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[calc(100vh-2.5rem)]">
        
        {/* --- Sidebar Hasil Asesmen --- */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-68 
            bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col space-y-7">
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BrandLogo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <Link
                href="/"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Beranda</span>
              </Link>

              <Link
                href="/assessments"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Input Asesmen</span>
              </Link>

              <Link
                href="/output"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)] transition-all"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Hasil &amp; Rekomendasi</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#bantuan"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Bantuan</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Pengaturan</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* --- Main Content Hasil Asesmen --- */}
        <main className="flex-1 flex flex-col space-y-6 min-w-0">
          
          {/* Mobile Header Bar */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e8ebf8]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-[#5452e6]" />
            </button>
            <BrandLogo />
            <div className="w-8" />
          </div>

          {/* Top Header Bar with Title & Aditya Pratama User Capsule */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Hasil Asesmen Kariermu
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Berikut adalah hasil analisis minat dan rekomendasi karier untukmu.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2.5 bg-white rounded-full border border-[#e8ebf8] text-slate-600 hover:bg-slate-50 transition-colors relative shadow-2xs"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 bg-white rounded-full border border-[#e8ebf8] shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"
                  alt="Aditya Pratama"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-100"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Aditya Pratama</span>
                  <span className="text-[10px] font-semibold text-slate-400 leading-tight">Siswa</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (6/12): Profil Minat RIASEC & Skill Gap */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Hexagon Radar Chart Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Profil Minat RIASEC
                  </span>
                  <button type="button" className="text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="py-2 flex items-center justify-center">
                  <RiasecRadarChart
                    scores={{ R: 10, I: 16, A: 12, S: 8, E: 11, C: 13 }}
                    maxScore={20}
                  />
                </div>
              </div>

              {/* Analisis Skill Gap Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs space-y-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Analisis Skill Gap
                </span>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Analytical Thinking</span>
                      <span className="font-bold text-slate-900">85%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5452e6] rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Problem Solving</span>
                      <span className="font-bold text-slate-900">78%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#fb923c] rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Data Literacy</span>
                      <span className="font-bold text-slate-900">70%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2dd4bf] rounded-full" style={{ width: "70%" }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column (6/12): Match 92%, Rekomendasi Utama & Langkah Selanjutnya */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* 92% Kecocokan Karier Gauge */}
              <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex items-center justify-between gap-6">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f1f5f9"
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
                  <span className="absolute text-lg font-black text-slate-900">92%</span>
                </div>

                <div className="flex-1 space-y-0.5">
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Kecocokan Karier
                  </h3>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold text-emerald-600">
                    Sangat Tinggi ↗
                  </span>
                </div>
              </div>

              {/* Rekomendasi Utama: Data Scientist with Mentor Woman */}
              <div className="bg-gradient-to-r from-[#fff7f0] via-[#fffbf7] to-[#fbf8fe] rounded-3xl p-6 sm:p-7 border border-orange-100/70 shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-500">
                    Rekomendasi Utama ➔
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-slate-900">Data Scientist</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-sm">
                    Karier yang sesuai dengan minat dan potensimu di bidang analisis data.
                  </p>
                </div>

                <div className="w-24 sm:w-28 h-28 sm:h-32 relative shrink-0">
                  <img
                    src="/illustrations/mentor-woman.png"
                    alt="Career mentor"
                    className="w-full h-full object-contain select-none"
                  />
                </div>
              </div>

              {/* Langkah Selanjutnya Checklist */}
              <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs flex flex-col justify-between space-y-4">
                <span className="text-sm font-bold text-slate-900 block">
                  Langkah Selanjutnya
                </span>

                <div className="space-y-3 text-xs font-medium text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Pelajari lebih lanjut tentang profesi Data Scientist</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Ikuti kursus Analisis Data</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <Link
                    href="/development-plans"
                    className="text-xs font-bold text-[#5452e6] hover:underline flex items-center gap-1"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SCREEN 4: DASHBOARD ADMIN (/admin)                                        */
/* ========================================================================= */

export function ScreenDashboardAdmin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[calc(100vh-2.5rem)]">
        
        {/* --- Sidebar Dashboard Admin --- */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-68 
            bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BrandLogo />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Home className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Beranda</span>
              </Link>

              <Link
                href="/assessments"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Input Asesmen</span>
              </Link>

              <Link
                href="/admin"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)] transition-all"
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Admin</span>
              </Link>

              <Link
                href="/admin#users"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Users className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Manajemen Pengguna</span>
              </Link>

              <Link
                href="/admin#mentors"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Manajemen Mentor</span>
              </Link>

              <Link
                href="/admin#analytics"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Analitik</span>
              </Link>

              <Link
                href="/admin#content"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Konten &amp; Materi</span>
              </Link>

              <Link
                href="/admin#settings"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
              >
                <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pengaturan Sistem</span>
              </Link>
            </nav>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#bantuan"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Bantuan</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Logout</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* --- Main Content Dashboard Admin --- */}
        <main className="flex-1 flex flex-col space-y-6 min-w-0">
          
          {/* Mobile Header Bar */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-[#e8ebf8]">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5 text-[#5452e6]" />
            </button>
            <BrandLogo />
            <div className="w-8" />
          </div>

          {/* Top Header Bar with Title & Admin Capsule */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Dashboard Admin
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Ringkasan data dan aktivitas platform CareerPath AI
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2.5 bg-white rounded-full border border-[#e8ebf8] text-slate-600 hover:bg-slate-50 transition-colors relative shadow-2xs"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              <div className="flex items-center gap-2.5 pl-2 pr-4 py-1.5 bg-white rounded-full border border-[#e8ebf8] shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"
                  alt="Dr. Budi Santoso"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-100"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">Dr. Budi Santoso</span>
                  <span className="text-[10px] font-semibold text-slate-400 leading-tight">Administrator</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Stat Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl p-5 border border-[#e8ebf8] shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                  👥
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pengguna</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-tight">12.480</div>
              <div className="text-xs font-bold text-emerald-600">&uarr; 12% dari bln lalu</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#e8ebf8] shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
                  👤
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor Aktif</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-tight">42</div>
              <div className="text-xs font-bold text-emerald-600">&uarr; 8% terverifikasi</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#e8ebf8] shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">
                  📊
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aktivitas Platform</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-tight">86%</div>
              <div className="text-xs font-bold text-emerald-600">&uarr; 5% interaksi</div>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-[#e8ebf8] shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                  💼
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lowongan Aktif</span>
              </div>
              <div className="text-2xl font-black text-slate-900 leading-tight">128</div>
              <div className="text-xs font-bold text-emerald-600">&uarr; 10% kurasi baru</div>
            </div>

          </div>

          {/* 2 Middle Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs space-y-4">
              <span className="text-sm font-bold text-slate-900 block">
                Tren Aktivitas Pengguna
              </span>
              <UserActivityLineChart />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs space-y-4">
              <span className="text-sm font-bold text-slate-900 block">
                Distribusi Minat Karier
              </span>
              <div className="py-2">
                <CareerInterestDonutChart />
              </div>
            </div>

          </div>

          {/* Bottom Row: Quick Management & System Update */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-white rounded-3xl p-6 border border-[#e8ebf8] shadow-xs space-y-4">
              <span className="text-sm font-bold text-slate-900 block">Manajemen Cepat</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="p-3.5 rounded-2xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
                >
                  <Plus className="w-4 h-4 text-[#5452e6]" />
                  <span>Tambah Pengguna</span>
                </button>

                <button
                  type="button"
                  className="p-3.5 rounded-2xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
                >
                  <UserCheck className="w-4 h-4 text-[#5452e6]" />
                  <span>Kelola Mentor</span>
                </button>

                <button
                  type="button"
                  className="p-3.5 rounded-2xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
                >
                  <BookOpen className="w-4 h-4 text-[#5452e6]" />
                  <span>Kelola Konten</span>
                </button>

                <button
                  type="button"
                  className="p-3.5 rounded-2xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
                >
                  <BarChart3 className="w-4 h-4 text-[#5452e6]" />
                  <span>Lihat Laporan</span>
                </button>
              </div>
            </div>

            {/* System Update Banner with Mentor Woman */}
            <div className="bg-gradient-to-r from-purple-50/80 via-blue-50/70 to-slate-50 rounded-3xl p-6 border border-purple-200/50 shadow-xs flex items-center justify-between gap-5">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#5452e6]">
                  <span>📢</span>
                  <span>Update Sistem</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Versi 1.0.0 telah dirilis dengan fitur analitik yang lebih lengkap.
                </p>
                <button type="button" className="text-xs font-bold text-[#5452e6] hover:underline inline-block pt-1 cursor-pointer">
                  Lihat Detail ➔
                </button>
              </div>

              <div className="w-24 sm:w-28 h-28 sm:h-32 relative shrink-0">
                <img
                  src="/illustrations/mentor-woman.png"
                  alt="System update advisor"
                  className="w-full h-full object-contain select-none"
                />
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
