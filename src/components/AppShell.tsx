"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

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
      setUserDropdownOpen(false);
      router.push("/login");
      router.refresh();
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Active link helper
  const isHomeActive = pathname === "/";
  const isInputActive = pathname === "/input" || pathname.startsWith("/assessments");
  const isResultActive =
    pathname === "/output" ||
    pathname.startsWith("/assessment-results") ||
    pathname.startsWith("/career-map");
  const isAdminDashboard = pathname.startsWith("/admin");
  const isStudentDashboard = pathname.startsWith("/dashboard");

  const isAdmin = currentUser?.role === "PLATFORM_ADMIN" || currentUser?.role === "INSTITUTION_ADMIN";

  return (
    <div className="min-h-screen bg-[#eef0fb] text-[#0f172a] font-sans antialiased p-2.5 sm:p-4 lg:p-6 flex flex-col justify-between">
      <div className="w-full max-w-[1780px] mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-3rem)]">
        
        {/* ========================================================================= */}
        {/* LEFT FLOATING SIDEBAR (Desktop Fixed/Sticky, Mobile Drawer)               */}
        {/* ========================================================================= */}
        <aside
          className={`
            fixed lg:static top-3 bottom-3 left-3 z-50 w-64 sm:w-72 
            bg-white rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(84,82,230,0.06)] border border-[#e8ebf8]
            flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-[110%] lg:translate-x-0"}
          `}
        >
          {/* Top: Brand Logo & Navigation */}
          <div className="flex flex-col space-y-7">
            {/* Logo */}
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

            {/* Core Navigation Items */}
            <nav className="flex flex-col space-y-1.5">
              {/* 1. Beranda */}
              <Link
                href="/"
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isHomeActive
                    ? "bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4 shrink-0" />
                <span>{t("Beranda", "Home")}</span>
              </Link>

              {/* 2. Input Asesmen */}
              <Link
                href="/assessments"
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isInputActive
                    ? "bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <FileEdit className="w-4 h-4 shrink-0" />
                <span>{t("Input Asesmen", "Take Assessment")}</span>
              </Link>

              {/* 3. Hasil & Rekomendasi */}
              <Link
                href="/output"
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isResultActive
                    ? "bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{t("Hasil & Rekomendasi", "Results & Recs")}</span>
              </Link>

              {/* 4. Dashboard (Siswa / Admin) */}
              {isAdmin ? (
                <Link
                  href="/admin"
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isAdminDashboard
                      ? "bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>{t("Dashboard Admin", "Admin Dashboard")}</span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    isStudentDashboard
                      ? "bg-[#5452e6] text-white shadow-[0_4px_16px_rgba(84,82,230,0.28)]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>{t("Dashboard", "Dashboard")}</span>
                </Link>
              )}

              {/* Extended Admin Menu when in Admin View or Admin user */}
              {isAdmin && (
                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Admin Tools
                  </div>
                  <Link
                    href="/admin#users"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{t("Manajemen Pengguna", "User Management")}</span>
                  </Link>
                  <Link
                    href="/admin#mentors"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span>{t("Manajemen Mentor", "Mentor Management")}</span>
                  </Link>
                  <Link
                    href="/admin#analytics"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    <span>{t("Analitik", "Analytics")}</span>
                  </Link>
                  <Link
                    href="/admin#content"
                    className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span>{t("Konten & Materi", "Content & Catalog")}</span>
                  </Link>
                </div>
              )}

              {/* Student Features Quick Links */}
              {!isAdmin && (
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <Link
                    href="/development-plans"
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      pathname === "/development-plans"
                        ? "bg-purple-50 text-[#5452e6] font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Compass className="w-4 h-4 text-slate-400" />
                    <span>{t("Rencana Karier (IDP)", "Career Plan (IDP)")}</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      pathname === "/portfolio"
                        ? "bg-purple-50 text-[#5452e6] font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Award className="w-4 h-4 text-slate-400" />
                    <span>{t("Skill Passport", "Skill Passport")}</span>
                  </Link>
                  <Link
                    href="/opportunities"
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      pathname === "/opportunities"
                        ? "bg-purple-50 text-[#5452e6] font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{t("Peluang Karier", "Career Opportunities")}</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Bottom Sidebar: Bantuan, Pengaturan, Logout */}
          <div className="pt-5 border-t border-slate-100 flex flex-col space-y-1">
            <Link
              href="/#contact"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>{t("Bantuan", "Help & Support")}</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>{t("Pengaturan", "Settings")}</span>
            </Link>

            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left w-full cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{t("Keluar", "Logout")}</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-[#5452e6] hover:bg-purple-50 transition-colors"
              >
                <LogIn className="w-4 h-4 text-[#5452e6]" />
                <span>{t("Masuk Akun", "Sign In")}</span>
              </Link>
            )}
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* ========================================================================= */}
        {/* RIGHT MAIN CONTENT AREA                                                   */}
        {/* ========================================================================= */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Top Bar: Mobile Hamburger + Language Switcher + User Profile Pill */}
          <header className="flex items-center justify-between mb-4 sm:mb-6 px-1">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 bg-white rounded-2xl border border-[#e8ebf8] shadow-sm text-slate-700 hover:bg-slate-50"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5 text-[#5452e6]" />
              </button>
              
              <div className="lg:hidden">
                <BrandLogo />
              </div>
            </div>

            {/* Right Controls: Language Pill + Bell + User Profile */}
            <div className="flex items-center gap-2.5 sm:gap-4 ml-auto">
              
              {/* Language Switcher Pill */}
              <div className="flex items-center p-1 rounded-2xl bg-white border border-[#e8ebf8] shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage("id")}
                  className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                    language === "id"
                      ? "bg-[#5452e6] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Bahasa Indonesia"
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                    language === "en"
                      ? "bg-[#5452e6] text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="English"
                >
                  EN
                </button>
              </div>

              {/* Notification Bell with Badge */}
              <button
                type="button"
                className="relative p-2.5 bg-white hover:bg-slate-50 rounded-2xl border border-[#e8ebf8] shadow-sm text-slate-600 transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {/* User Profile Capsule */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 bg-white hover:bg-slate-50 rounded-2xl border border-[#e8ebf8] shadow-sm transition-all"
                  >
                    <img
                      src={
                        currentUser.avatarUrl ||
                        (currentUser.role === "PLATFORM_ADMIN"
                          ? "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120"
                          : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120")
                      }
                      alt={currentUser.fullName}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-purple-100"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.fullName}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 capitalize leading-tight">
                        {currentUser.role === "PLATFORM_ADMIN"
                          ? "Administrator"
                          : currentUser.role === "MENTOR"
                          ? "Mentor"
                          : "Siswa"}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-fadeIn">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t("Profil Saya", "My Profile")}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl w-full text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t("Keluar Akun", "Sign Out")}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-slate-700 hover:bg-white transition-all"
                  >
                    <span>{t("Masuk", "Sign In")}</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#5452e6] hover:bg-[#433ec8] text-white rounded-2xl text-xs font-bold shadow-sm shadow-purple-500/20 transition-all"
                  >
                    <span>{t("Daftar", "Register")}</span>
                  </Link>
                </div>
              )}
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
