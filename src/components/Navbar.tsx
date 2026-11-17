"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  ChevronDown,
  Sparkles,
  Map,
  Target,
  FileCheck,
  Briefcase,
  Users,
  ShieldCheck,
  Building2,
  LayoutDashboard,
  GraduationCap,
  Bell,
  LogOut,
  User,
  Menu,
  X as CloseIcon,
} from "lucide-react";
import { CuteStudentAvatar } from "@/components/CustomIcons";

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 font-sans">
      <div className="mx-auto flex max-w-[1720px] items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Brand Logo & Platform Title */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-500/25 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-zinc-950 dark:text-white">
                  Career<span className="text-red-600">Path</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-800">
                  ENTERPRISE
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 font-medium hidden sm:block">
                Sistem Bimbingan & Akselerasi Karier Nasional
              </span>
            </div>
          </Link>

          {/* Clean Real Navigation Links (No more '01 01 ASSESS' or squished '02-05'!) */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/") && pathname !== "/input" && pathname !== "/output" && pathname !== "/admin"
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dashboard Karier</span>
            </Link>

            <Link
              href="/input"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/input")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Asesmen Minat & Skill</span>
            </Link>

            <Link
              href="/output"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/output")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>Peta Karier & O*NET</span>
            </Link>

            <Link
              href="/development-plans"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/development-plans")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Rencana Aksi (IDP)</span>
            </Link>

            <Link
              href="/portfolio"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/portfolio")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Skill Passport</span>
            </Link>

            <Link
              href="/opportunities"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/opportunities")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Peluang Karier & Magang</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/admin")
                  ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Audit & Admin</span>
            </Link>
          </nav>
        </div>

        {/* Right: Authenticated User Info (Hilman Zahrawa Budiarto) & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 bg-white dark:bg-zinc-850 transition-all cursor-pointer"
            >
              <CuteStudentAvatar className="w-8 h-8" showBadge={true} />
              <div className="flex flex-col text-left leading-tight hidden sm:block">
                <span className="font-bold text-zinc-950 dark:text-white text-xs">
                  Hilman Zahrawa
                </span>
                <span className="text-[10px] text-zinc-400">
                  D4 SIB Polinema · L4 READY
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-zinc-400 ml-1" />
            </button>

            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl py-2 z-50 text-xs divide-y divide-zinc-100 dark:divide-zinc-800 animate-fadeIn"
                onClick={() => setUserMenuOpen(false)}
              >
                <div className="p-3 space-y-1">
                  <div className="font-bold text-zinc-950 dark:text-white text-sm">
                    Hilman Zahrawa Budiarto
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    budiarto3788@gmail.com
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 text-[10px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    <span>Tingkat 4: READY (Mahasiswa Akhir)</span>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>Profil Akademik & CV</span>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                  >
                    <FileCheck className="h-4 w-4 text-zinc-500" />
                    <span>Digital Skill Passport</span>
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
                  >
                    <ShieldCheck className="h-4 w-4 text-zinc-500" />
                    <span>Pusat Tata Kelola Platform</span>
                  </Link>
                </div>

                <div className="p-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar / Ganti Akun</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <CloseIcon className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-1 animate-fadeIn">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <LayoutDashboard className="h-4 w-4 text-red-600" />
            <span>Dashboard Karier</span>
          </Link>
          <Link
            href="/input"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Target className="h-4 w-4 text-red-600" />
            <span>Asesmen Minat & Skill</span>
          </Link>
          <Link
            href="/output"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Map className="h-4 w-4 text-red-600" />
            <span>Peta Karier & O*NET</span>
          </Link>
          <Link
            href="/development-plans"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <GraduationCap className="h-4 w-4 text-red-600" />
            <span>Rencana Aksi (IDP)</span>
          </Link>
          <Link
            href="/portfolio"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <FileCheck className="h-4 w-4 text-red-600" />
            <span>Skill Passport</span>
          </Link>
          <Link
            href="/opportunities"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Briefcase className="h-4 w-4 text-red-600" />
            <span>Peluang Karier & Magang</span>
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <ShieldCheck className="h-4 w-4 text-red-600" />
            <span>Audit & Admin</span>
          </Link>
        </div>
      )}
    </header>
  );
}
