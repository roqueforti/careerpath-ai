"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Target,
  Map,
  GraduationCap,
  FileCheck,
  Briefcase,
  ShieldCheck,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle2,
  ArrowRight,
  LogIn,
} from "lucide-react";
import {
  CuteStudentAvatar,
  CuteMentorAvatar,
  CuteBotMascot,
  IconCoolRocket,
  IconCoolCompass,
  IconCoolShip,
  IconCoolPassport,
  IconCoolTarget,
  IconCoolAI,
} from "@/components/CustomIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mentorModalOpen, setMentorModalOpen] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string | null;
    educationLevel?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          } else {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    }
    fetchMe();
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
      setUserMenuOpen(false);
      router.push("/login");
      router.refresh();
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPublicPage = pathname === "/" || pathname === "/architecture";

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const navTools = [
    { name: t("Peta Karier (Explorer)", "Career Explorer"), href: "/#explorer", icon: IconCoolCompass, badge: "Interactive" },
    { name: t("Asesmen Minat & Skill", "Skill & Interest Assessment"), href: "/input", icon: IconCoolTarget },
    { name: t("Peta Karier & O*NET", "Career Map & O*NET"), href: "/output", icon: Map },
  ];

  const navTasks = [
    { name: t("Rencana Aksi (IDP)", "Individual Plan (IDP)"), href: "/development-plans", icon: IconCoolRocket },
    { name: t("Digital Skill Passport", "Digital Skill Passport"), href: "/portfolio", icon: IconCoolPassport },
    { name: t("Peluang Karier & Magang", "Career & Internships"), href: "/opportunities", icon: Briefcase },
  ];

  const navAdmin = [
    { name: t("Pusat Kendali Admin", "Admin Control Center"), href: "/admin", icon: ShieldCheck },
  ];

  // =========================================================
  // SCENARIO A: AUTHENTICATION PAGES (/login, /register)
  // No sidebar, pure full-page auth layout
  // =========================================================
  if (isAuthPage) {
    return <>{children}</>;
  }

  // =========================================================
  // SCENARIO B: PUBLIC LANDING PAGE (/) & PRESENTATION (/architecture)
  // Clean full-width public layout, NO sidebar!
  // Shows clean Public Navbar with "Masuk" & "Mulai Asesmen"
  // =========================================================
  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] text-zinc-900 font-sans antialiased">
        {/* Public Top Header Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1720px] mx-auto h-16 flex items-center justify-between">
            {/* Left: Brand Logo & Public Nav Links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-sm shadow-red-500/25 group-hover:scale-105 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-zinc-950">
                    Career<span className="text-red-600">Path.</span>
                  </span>
                  <span className="text-[10px] font-semibold text-zinc-400 -mt-1 tracking-wider uppercase">
                    Enterprise Platform
                  </span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-1 text-xs font-bold text-zinc-600">
                <Link
                  href="/#explorer"
                  className={`px-3 py-2 rounded-xl hover:text-zinc-950 hover:bg-zinc-100 transition-all ${
                    pathname === "/" ? "text-red-600 font-extrabold" : ""
                  }`}
                >
                  {t("Peta Karier (Explorer)", "Career Explorer")}
                </Link>
                <Link
                  href="/architecture"
                  className={`px-3 py-2 rounded-xl hover:text-zinc-950 hover:bg-zinc-100 transition-all ${
                    pathname === "/architecture" ? "text-red-600 font-extrabold" : ""
                  }`}
                >
                  {t("Arsitektur Sistem (Presentasi)", "System Architecture")}
                </Link>
                <Link
                  href="/input"
                  className="px-3 py-2 rounded-xl hover:text-zinc-950 hover:bg-zinc-100 transition-all"
                >
                  {t("Asesmen Minat & Skill", "Assessments")}
                </Link>
                <Link
                  href="/opportunities"
                  className="px-3 py-2 rounded-xl hover:text-zinc-950 hover:bg-zinc-100 transition-all"
                >
                  {t("Peluang Karier & Magang", "Opportunities")}
                </Link>
              </nav>
            </div>

            {/* Right: Language Pill & Auth Actions */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Language Switcher Pill Toggle */}
              <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`px-2 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    language === "id"
                      ? "bg-white text-red-600 shadow-2xs font-extrabold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title="Bahasa Indonesia"
                  aria-label="Ubah ke Bahasa Indonesia"
                >
                  <span>🇮🇩</span>
                  <span className="hidden sm:inline">ID</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                    language === "en"
                      ? "bg-white text-red-600 shadow-2xs font-extrabold"
                      : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  title="English"
                  aria-label="Switch to English"
                >
                  <span>🇬🇧</span>
                  <span className="hidden sm:inline">EN</span>
                </button>
              </div>

              {/* Dynamic Auth Action Buttons */}
              {currentUser ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    <CuteStudentAvatar className="w-5 h-5" showBadge={false} />
                    <span>{t("Buka Dashboard", "Open Dashboard")}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title={t("Keluar Akun", "Sign Out")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{t("Masuk Akun", "Sign In")}</span>
                  </Link>
                  <Link
                    href="/input"
                    className="px-3.5 sm:px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t("Mulai Asesmen", "Start Free")}</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Public Content (Full Width) */}
        <main className="flex-1 w-full">{children}</main>
      </div>
    );
  }

  // =========================================================
  // SCENARIO C: INTERNAL APP PAGES (/dashboard, /input, /admin, etc.)
  // Full Dashboard Layout with persistent Left Sidebar
  // =========================================================
  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-zinc-900 font-sans antialiased">
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR (Desktop Fixed, Mobile Slide-Out) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-zinc-200/90 bg-white flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Brand Logo Header */}
          <div className="flex items-center justify-between px-2">
            <Link
              href="/"
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-sm shadow-red-500/25 group-hover:scale-105 transition-transform">
                <Compass className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-zinc-950">
                  Career<span className="text-red-600">Path.</span>
                </span>
                <span className="text-[10px] font-semibold text-zinc-400 -mt-1 tracking-wider uppercase">
                  Enterprise Platform
                </span>
              </div>
            </Link>

            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-6 text-xs font-semibold">
            {/* Dashboard Primary Item */}
            <div>
              <Link
                href="/dashboard"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive("/dashboard")
                    ? "bg-red-50 text-red-600 font-extrabold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* Group: TOOLS */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                TOOLS
              </div>
              {navTools.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                      active
                        ? "bg-red-50 text-red-600 font-extrabold shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-red-100/70 text-red-700 border border-red-200">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Group: TASKS & IDP */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                TASKS & DEVELOPMENT
              </div>
              {navTasks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                      active
                        ? "bg-red-50 text-red-600 font-extrabold shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Group: GOVERNANCE & ADMIN */}
            <div className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
                GOVERNANCE
              </div>
              {navAdmin.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                      active
                        ? "bg-red-50 text-red-600 font-extrabold shadow-2xs"
                        : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Support / Help Card */}
        <div className="p-4 border-t border-zinc-100">
          <div className="rounded-2xl bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border border-red-100 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <CuteBotMascot className="w-10 h-10" />
              <div>
                <div className="font-bold text-zinc-900 text-xs">
                  {t("Butuh Bimbingan Karier?", "Need Career Guidance?")}
                </div>
                <div className="text-[10px] text-zinc-500 leading-snug mt-0.5">
                  {t("Konsultasikan target karier Anda dengan mentor ahli.", "Consult your career target with an expert mentor.")}
                </div>
              </div>
            </div>
            <button
              onClick={() => setMentorModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <IconCoolAI className="w-3.5 h-3.5" />
              <span>{t("Hubungi Mentor", "Contact Mentor")}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Toggle & Page Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-zinc-700 hover:bg-zinc-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-medium text-zinc-400">CareerPath</span>
              <span className="text-zinc-300">/</span>
              <span className="font-bold text-zinc-800">
                {pathname === "/dashboard" && t("Dashboard Karier Mahasiswa", "Student Career Dashboard")}
                {pathname === "/input" && t("Asesmen Minat, Holland & Kompetensi", "Interest, Holland & Competency Assessment")}
                {pathname === "/output" && t("Peta Karier & Rekomendasi O*NET", "Career Map & O*NET Recommendations")}
                {pathname === "/development-plans" && t("Rencana Aksi Individu (IDP)", "Individual Development Plan (IDP)")}
                {pathname === "/portfolio" && t("Digital Skill Passport", "Digital Skill Passport")}
                {pathname === "/opportunities" && t("Peluang Karier & Rekrutmen Industri", "Career & Industry Opportunities")}
                {pathname === "/admin" && t("Pusat Kendali & Tata Kelola Platform", "Governance & Admin Control Center")}
              </span>
            </div>
          </div>

          {/* Right: Language Switcher, Notification Bell & User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Pill Toggle */}
            <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200/90 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage("id")}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                  language === "id"
                    ? "bg-white text-red-600 shadow-2xs font-extrabold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="Bahasa Indonesia"
                aria-label="Ubah ke Bahasa Indonesia"
              >
                <span>🇮🇩</span>
                <span className="hidden sm:inline">ID</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                  language === "en"
                    ? "bg-white text-red-600 shadow-2xs font-extrabold"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
                title="English"
                aria-label="Switch to English"
              >
                <span>🇬🇧</span>
                <span className="hidden sm:inline">EN</span>
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-white animate-pulse" />
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-zinc-200 shadow-2xl py-3 z-50 text-xs divide-y divide-zinc-100 animate-fadeIn">
                  <div className="px-4 pb-2 flex items-center justify-between">
                    <span className="font-black text-zinc-900 text-sm">{t("Notifikasi Karier", "Career Notifications")}</span>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      {t("3 Baru", "3 New")}
                    </span>
                  </div>
                  <div className="py-2 divide-y divide-zinc-50">
                    <div className="px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                      <div className="font-bold text-zinc-900">{t("Portofolio Industri Terverifikasi", "Industrial Portfolio Verified")}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {t("Proyek Sistem Informasi Enterprise Terverifikasi oleh Mentor Vokasi.", "Enterprise Information System project verified by Vocational Mentor.")}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1">{t("2 jam yang lalu", "2 hours ago")}</div>
                    </div>
                    <div className="px-4 py-2.5 hover:bg-zinc-50 transition-colors">
                      <div className="font-bold text-zinc-900">{t("Rekomendasi Magang MSIB Terbuka", "MSIB Internship Recommendation Open")}</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        {t("Posisi Full-Stack Developer & Software Engineer telah dibuka oleh mitra industri.", "Full-Stack Developer & Software Engineer positions now open by industry partners.")}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1">{t("Kemarin", "Yesterday")}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full sm:rounded-2xl border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 transition-all cursor-pointer shadow-xs"
                >
                  <CuteStudentAvatar className="w-8 h-8" showBadge={true} />
                  <div className="flex flex-col text-left leading-tight hidden sm:block">
                    <span className="font-bold text-zinc-950 text-xs">{currentUser.fullName}</span>
                    <span className="text-[10px] text-zinc-400">{currentUser.role}</span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400 hidden sm:block ml-0.5" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-3xl bg-white border border-zinc-200 shadow-2xl py-2 z-50 text-xs divide-y divide-zinc-100 animate-fadeIn"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="p-3.5 flex items-center gap-3">
                      <CuteStudentAvatar className="w-12 h-12" showBadge={false} />
                      <div className="leading-tight">
                        <div className="font-black text-sm text-zinc-950">{currentUser.fullName}</div>
                        <div className="text-[11px] text-zinc-500">{currentUser.email}</div>
                        <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 mt-0.5">
                          <Award className="h-3 w-3" />
                          <span>{currentUser.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-0.5">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 font-semibold"
                      >
                        <User className="h-4 w-4 text-zinc-500" />
                        <span>Profil Akun Saya</span>
                      </Link>
                      <Link
                        href="/portfolio"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 font-semibold"
                      >
                        <FileCheck className="h-4 w-4 text-zinc-500" />
                        <span>{t("Portofolio Terverifikasi", "Verified Portfolio")}</span>
                      </Link>
                      <Link
                        href="/development-plans"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 font-semibold"
                      >
                        <GraduationCap className="h-4 w-4 text-zinc-500" />
                        <span>Rencana Aksi IDP (3 Fase)</span>
                      </Link>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 hover:bg-zinc-100 font-semibold"
                      >
                        <ShieldCheck className="h-4 w-4 text-zinc-500" />
                        <span>Pusat Tata Kelola Platform</span>
                      </Link>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-bold transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("Keluar / Ganti Akun", "Sign Out / Switch Account")}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-2xs"
                >
                  {t("Masuk Akun", "Sign In")}
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* 3. MENTOR CONSULTATION MODAL */}
      {mentorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CuteMentorAvatar className="w-12 h-12" />
                <div>
                  <h3 className="text-lg font-black text-zinc-950">
                    Bimbingan Mentor & Konselor Vokasi
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {t(
                      "Konsultasi penyelarasan profil dengan standar kompetensi industri nasional.",
                      "Consultation aligning student profile with national industry standards."
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMentorModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <div className="font-bold text-zinc-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-red-600" />
                  <span>Saran AI Mentor (Gemini 3.5 Pro):</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {t(
                    "\"Profil talenta vokasi dengan IPK kuat dan portofolio proyek terverifikasi memberikan kesiapan tinggi pada posisi Software Engineer. Fokuskan 6 bulan ke depan pada sertifikasi BNSP Rekayasa Perangkat Lunak dan arsitektur microservices untuk memperkuat daya saing industri Anda.\"",
                    "\"A strong academic profile combined with verified project portfolios yields high readiness for Software Engineer roles. Focus the next 6 months on national software certifications and microservices to solidify your competitive edge.\""
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 space-y-1.5">
                <div className="font-bold text-red-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-red-600" />
                  <span>Konselor Human-in-the-Loop:</span>
                </div>
                <p className="text-red-800 leading-relaxed text-[11px]">
                  Jadwal konsultasi bimbingan karier dibuka setiap Selasa & Kamis secara tatap muka atau via konferensi video.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setMentorModalOpen(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 hover:bg-zinc-100 text-xs font-bold"
              >
                Tutup
              </button>
              <Link
                href="/mentoring"
                onClick={() => setMentorModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Buka Portal Bimbingan ➔
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
