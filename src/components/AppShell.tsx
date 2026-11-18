"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Home,
  FileEdit,
  Sparkles,
  LayoutDashboard,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Users,
  UserCheck,
  BarChart3,
  BookOpen,
  Sliders,
  ChevronRight,
  LogIn,
  User,
  Compass,
  Briefcase,
  Award,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTabParam = searchParams.get("tab");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, currentTabParam]);

  // Determine current screen context:
  // "beranda" | "asesmen" | "hasil" | "admin"
  let currentScreen: "beranda" | "asesmen" | "hasil" | "admin" = "beranda";

  if (pathname === "/admin" || currentTabParam === "admin") {
    currentScreen = "admin";
  } else if (
    pathname === "/assessments" ||
    pathname === "/input" ||
    currentTabParam === "asesmen"
  ) {
    currentScreen = "asesmen";
  } else if (
    pathname === "/output" ||
    pathname.startsWith("/assessment-results") ||
    pathname.startsWith("/career-map") ||
    currentTabParam === "hasil"
  ) {
    currentScreen = "hasil";
  } else {
    currentScreen = "beranda";
  }

  const isSelfContainedPage =
    pathname === "/" ||
    pathname === "/assessments" ||
    pathname === "/output" ||
    pathname === "/dashboard" ||
    pathname === "/admin" ||
    pathname === "/input" ||
    pathname === "/login" ||
    pathname === "/register";

  if (isSelfContainedPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-3 sm:p-5 lg:p-7 flex flex-col justify-between">
      <div className="w-full max-w-[1720px] mx-auto flex flex-col lg:flex-row gap-5 lg:gap-7 min-h-[calc(100vh-2.5rem)]">
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Adapts strictly to the 4 Screens in reference)              */}
        {/* ========================================================================= */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-68 
            bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col space-y-7">
            {/* Logo */}
            <div className="flex items-center justify-between">
              <Link href="/?tab=beranda" className="hover:opacity-90 transition-opacity">
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

            {/* Menu Items depending on Screen */}
            <nav className="flex flex-col space-y-1.5">
              
              {/* ----------------------------------------------------------------- */}
              {/* CASE A: BERANDA SISWA (Screen 3 Bottom-Left)                      */}
              {/* ----------------------------------------------------------------- */}
              {currentScreen === "beranda" && (
                <>
                  <Link
                    href="/?tab=beranda"
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
                </>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* CASE B: INPUT ASESMEN (Screen 1 Top-Left)                         */}
              {/* ----------------------------------------------------------------- */}
              {currentScreen === "asesmen" && (
                <>
                  <Link
                    href="/?tab=beranda"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Beranda</span>
                  </Link>

                  <Link
                    href="/?tab=asesmen"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)] transition-all"
                  >
                    <FileEdit className="w-4 h-4 shrink-0" />
                    <span>Input Asesmen</span>
                  </Link>

                  <Link
                    href="/?tab=hasil"
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
                </>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* CASE C: HASIL & REKOMENDASI (Screen 2 Top-Right)                  */}
              {/* ----------------------------------------------------------------- */}
              {currentScreen === "hasil" && (
                <>
                  <Link
                    href="/?tab=beranda"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Beranda</span>
                  </Link>

                  <Link
                    href="/?tab=asesmen"
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Input Asesmen</span>
                  </Link>

                  <Link
                    href="/?tab=hasil"
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
                </>
              )}

              {/* ----------------------------------------------------------------- */}
              {/* CASE D: DASHBOARD ADMIN (Screen 4 Bottom-Right)                   */}
              {/* ----------------------------------------------------------------- */}
              {currentScreen === "admin" && (
                <>
                  <Link
                    href="/?tab=beranda"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <Home className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Beranda</span>
                  </Link>

                  <Link
                    href="/?tab=asesmen"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <FileEdit className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Input Asesmen</span>
                  </Link>

                  <Link
                    href="/?tab=admin"
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
                </>
              )}

            </nav>
          </div>

          {/* Bottom Sidebar: Bantuan & Pengaturan / Logout */}
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#bantuan"
              className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Bantuan</span>
            </Link>

            {currentScreen === "admin" ? (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left w-full cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/profile"
                className="flex items-center gap-3.5 px-4 py-2 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pengaturan</span>
              </Link>
            )}
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ========================================================================= */}
        {/* MAIN PAGE AREA                                                            */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Mobile Top Bar */}
          <div className="lg:hidden flex items-center justify-between mb-3 bg-white p-3 rounded-2xl border border-[#e8ebf8]">
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

          {/* Children View Content */}
          <main className="flex-1 w-full max-w-full">
            {children}
          </main>
        </div>

      </div>
    </div>
  );
}
