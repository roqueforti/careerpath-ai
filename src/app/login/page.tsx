"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Target,
  FileCheck,
} from "lucide-react";
import GoogleAuthModal, { GoogleIcon } from "@/components/GoogleAuthModal";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Gagal masuk. Periksa kembali alamat email dan kata sandi Anda.");
        setLoading(false);
        return;
      }

      // Route by role
      const role = data.user?.role;
      if (role === "PLATFORM_ADMIN") {
        router.push("/admin");
      } else if (role === "INSTITUTION_ADMIN") {
        router.push("/institution");
      } else if (role === "MENTOR") {
        router.push("/mentoring");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Login submit error:", err);
      setError("Terjadi gangguan koneksi saat menghubungi server. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans selection:bg-red-600 selection:text-white py-6 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Back Nav & Brand Tagline */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-950 hover:border-stone-400 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 shadow-2xs transition-all"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Autentikasi Terenkripsi &amp; Terlindungi</span>
          </div>
        </div>

        {/* 2-Column Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Form & Narrative (7 cols on lg, 6 cols on xl) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-6">
            {/* Header Narrative */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                Portal Akses Pengguna
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 dark:text-white leading-[1.08]">
                Welcome back to your <span className="text-red-600">career</span> blueprint.
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg leading-relaxed">
                Masuk untuk mengakses Individual Development Plan (IDP), pemetaan minat RIASEC, validasi bukti kompetensi, dan sesi bimbingan bersama mentor.
              </p>
            </div>

            {/* Compact Visual Card for Mobile / Tablet view (< lg) */}
            <div className="lg:hidden rounded-[24px] border border-stone-200/90 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900 overflow-hidden">
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src="/woman_white_blazer_red.jpg"
                  alt="Young College Student & Early Career Cohort"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-stone-900 backdrop-blur-md">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                  94% Placement
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold leading-tight">CareerPath Verified Ecosystem</p>
                  <p className="text-[10px] text-stone-300">Terhubung dengan ratusan mentor industri & institusi pendidikan.</p>
                </div>
              </div>
            </div>

            {/* Login Card Container */}
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs dark:border-stone-800 dark:bg-stone-900">
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Sign-in Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-stone-200/90 bg-white py-3 px-4 text-xs font-bold text-stone-800 shadow-2xs hover:bg-stone-50 hover:border-stone-400 active:scale-[0.99] dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-750 transition-all cursor-pointer"
              >
                <GoogleIcon className="h-4 w-4" />
                <span>Masuk dengan Google</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-stone-100 dark:border-stone-800" />
                <span className="absolute bg-white dark:bg-stone-900 px-3 text-[11px] font-medium text-stone-400">
                  atau masuk dengan email
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200">
                      Kata Sandi
                    </label>
                    <span className="text-[11px] text-stone-400 hover:text-red-600 cursor-pointer transition-colors">
                      Lupa kata sandi?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-11 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 dark:text-stone-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-stone-300 text-red-600 focus:ring-red-500"
                    />
                    <span>Ingat sesi saya di perangkat ini</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Memproses Autentikasi..." : "Masuk ke Workspace"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                Belum memiliki akun terdaftar?{" "}
                <Link
                  href="/register"
                  className="font-bold text-stone-950 dark:text-white hover:text-red-600 transition-colors"
                >
                  Daftar Akun Baru <span className="ml-0.5 text-stone-400 font-normal">‹</span>
                </Link>
              </div>
            </div>

            {/* Security Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-[11px] text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white p-3 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Enkripsi kata sandi bcrypt & JWT HttpOnly</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-stone-200/80 bg-white p-3 dark:border-stone-800 dark:bg-stone-900 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0" />
                <span>Kontrol akses berbasis peran (RBAC)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-5 hidden lg:block">
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-3.5 shadow-xs dark:border-stone-800 dark:bg-stone-900 h-full flex flex-col">
              <div className="relative flex-1 min-h-[580px] lg:min-h-[640px] rounded-[24px] overflow-hidden border border-stone-100 dark:border-stone-800">
                <img
                  src="/woman_white_blazer_red.jpg"
                  alt="Young Woman Professional in Early 20s"
                  className="w-full h-full object-cover object-center"
                />

                {/* Top Right Floating Pill */}
                <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-white/95 text-stone-900 backdrop-blur-md px-4 py-1.5 text-xs font-semibold shadow-xs border border-stone-200/80 dark:bg-stone-900/95 dark:text-white">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span>94% Kesiapan Kerja</span>
                </div>

                {/* Bottom Floating Clarity & Metrics Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-100 dark:border-stone-700 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      <span className="text-[11px] font-bold text-stone-900 dark:text-white">CareerPath Ecosystem</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Early 20s Cohort</span>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <div className="text-3xl sm:text-4xl font-black text-stone-950 dark:text-white tracking-tight">
                      89%
                    </div>
                    <div className="flex -space-x-2">
                      <div className="h-7 w-7 rounded-full bg-stone-200 dark:bg-stone-700 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-bold text-stone-700">R</div>
                      <div className="h-7 w-7 rounded-full bg-stone-300 dark:bg-stone-600 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-bold text-stone-800">S</div>
                      <div className="h-7 w-7 rounded-full bg-stone-800 dark:bg-stone-500 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-bold text-white">D</div>
                      <div className="h-7 w-7 rounded-full bg-red-600 border-2 border-white dark:border-stone-900 flex items-center justify-center text-[10px] font-bold text-white">P</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-2.5 leading-relaxed italic">
                    "Portofolio kompetensi dan pendampingan mentor di CareerPath membantu saya diterima di posisi impian sebelum wisuda."
                  </p>
                  <p className="text-[10px] font-bold text-stone-900 dark:text-white mt-1">
                    — Mahasiswa Tingkat Akhir, ITB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />
    </div>
  );
}
