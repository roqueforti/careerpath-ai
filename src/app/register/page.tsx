"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Phone,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  CheckCircle2,
  Target,
  Sparkles,
  FileCheck,
} from "lucide-react";
import GoogleAuthModal, { GoogleIcon } from "@/components/GoogleAuthModal";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "MENTOR" | "INSTITUTION_ADMIN">("STUDENT");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [educationLevel, setEducationLevel] = useState<"SMP" | "SMA" | "SMK" | "MA" | "MAHASISWA" | "MAHASISWA_AKHIR" | "UMUM">("SMA");
  const [institutionCode, setInstitutionCode] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }

    if (!consent) {
      setError("Persetujuan pemrosesan data karier wajib dicentang untuk membuat akun.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          role,
          educationLevel: role === "STUDENT" ? educationLevel : "UMUM",
          institutionCode: institutionCode.trim() || undefined,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Gagal melakukan registrasi akun baru.");
        setLoading(false);
        return;
      }

      // Route according to registered role
      if (role === "INSTITUTION_ADMIN") {
        router.push("/institution");
      } else if (role === "MENTOR") {
        router.push("/mentoring");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Register submit error:", err);
      setError("Terjadi gangguan koneksi saat menghubungi server.");
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
            <span>Jaringan Institusi &amp; Mentor Terverifikasi</span>
          </div>
        </div>

        {/* 2-Column Editorial Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Form & Role Switcher (7 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center space-y-6">
            {/* Header Narrative */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                Pendaftaran Akun Baru
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-stone-950 dark:text-white leading-[1.08]">
                Begin your college & <span className="text-red-600">early career</span> journey.
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                Pilih peran akun Anda untuk mengaktifkan kurikulum pemetaan minat RIASEC, penyusunan IDP terukur, portofolio kompetensi, dan bimbingan mentor berstandar industri.
              </p>
            </div>

            {/* Compact Visual Card for Mobile / Tablet view (< lg) */}
            <div className="lg:hidden rounded-[24px] border border-stone-200/90 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900 overflow-hidden">
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src="/collaborative_mentoring_sofa.jpg"
                  alt="Young College Students Collaborating"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-stone-900 backdrop-blur-md">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-600 mr-1.5 animate-pulse" />
                  RIASEC & O*NET
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-bold leading-tight">Ekosistem Karier Terpadu</p>
                  <p className="text-[10px] text-stone-300">12,400+ mahasiswa & siswa aktif terbimbing secara terstruktur.</p>
                </div>
              </div>
            </div>

            {/* Role Switcher Pill Tabs matching Landing Page style */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setRole("STUDENT")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all border cursor-pointer ${
                  role === "STUDENT"
                    ? "bg-stone-950 text-white border-stone-950 dark:bg-white dark:text-stone-950 shadow-2xs"
                    : "bg-white text-stone-700 border-stone-300 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 shadow-2xs"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5 text-red-600" />
                <span>Pelajar & Mahasiswa</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("MENTOR")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all border cursor-pointer ${
                  role === "MENTOR"
                    ? "bg-stone-950 text-white border-stone-950 dark:bg-white dark:text-stone-950 shadow-2xs"
                    : "bg-white text-stone-700 border-stone-300 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 shadow-2xs"
                }`}
              >
                <UserCheck className="h-3.5 w-3.5 text-red-600" />
                <span>Mentor BK & Industri</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("INSTITUTION_ADMIN")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all border cursor-pointer ${
                  role === "INSTITUTION_ADMIN"
                    ? "bg-stone-950 text-white border-stone-950 dark:bg-white dark:text-stone-950 shadow-2xs"
                    : "bg-white text-stone-700 border-stone-300 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 shadow-2xs"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-red-600" />
                <span>Pengelola Institusi</span>
              </button>
            </div>

            {/* Registration Form Card */}
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
                <span>Daftar dengan Google</span>
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full border-t border-stone-100 dark:border-stone-800" />
                <span className="absolute bg-white dark:bg-stone-900 px-3 text-[11px] font-medium text-stone-400">
                  atau daftar dengan email
                </span>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Nama Lengkap & Gelar
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder={
                        role === "MENTOR"
                          ? "Contoh: Dr. Sarah Wulandari, M.Psi."
                          : role === "INSTITUTION_ADMIN"
                          ? "Contoh: Administrator ITB Career Center"
                          : "Contoh: Budi Santoso"
                      }
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                      Alamat Email Aktif
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
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                      Nomor WhatsApp / Telepon
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                      <input
                        type="tel"
                        placeholder="0812xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                      Kata Sandi (Min. 6 Karakter)
                    </label>
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

                  <div>
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {role === "STUDENT" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                        Jenjang Pendidikan
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value as any)}
                          className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs cursor-pointer"
                        >
                          <option value="SMP">SMP / MTs (Eksplorasi Awal)</option>
                          <option value="SMA">SMA / MA (Peminatan Akademik)</option>
                          <option value="SMK">SMK (Peminatan Vokasi / Kejuruan)</option>
                          <option value="MAHASISWA">Mahasiswa (Semester 1 - 6)</option>
                          <option value="MAHASISWA_AKHIR">Mahasiswa Tingkat Akhir / Skripsi</option>
                          <option value="UMUM">Umum / Fresh Graduate</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                        Kode Institusi / Kampus (Opsional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          placeholder="Contoh: ITB-CDC / SMAN1-JKT"
                          value={institutionCode}
                          onChange={(e) => setInstitutionCode(e.target.value)}
                          className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {role !== "STUDENT" && (
                  <div>
                    <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                      Kode Afiliasi Institusi (Opsional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-3.5 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Contoh: ITB-CDC"
                        value={institutionCode}
                        onChange={(e) => setInstitutionCode(e.target.value)}
                        className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-3 pl-11 pr-4 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
                      />
                    </div>
                  </div>
                )}

                {/* Privacy Consent Box */}
                <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3.5 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-800/50 dark:text-stone-300">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-[11px] leading-relaxed">
                      Saya menyetujui pemrosesan data profil, minat, dan portofolio untuk keperluan
                      rekomendasi karier personal sesuai standar privasi data dan etika AI.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Mendaftarkan Akun..." : "Daftar Akun Baru"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
                Sudah memiliki akun CareerPath?{" "}
                <Link
                  href="/login"
                  className="font-bold text-stone-950 dark:text-white hover:text-red-600 transition-colors"
                >
                  Masuk ke Akun Anda <span className="ml-0.5 text-stone-400 font-normal">‹</span>
                </Link>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Data terenkripsi dan dilindungi dengan kontrol akses berbasis peran (RBAC)</span>
            </div>
          </div>

          {/* Right Column: Editorial Visual Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 xl:col-span-5 hidden lg:block">
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-3.5 shadow-xs dark:border-stone-800 dark:bg-stone-900 h-full flex flex-col">
              <div className="relative flex-1 min-h-[640px] rounded-[24px] overflow-hidden border border-stone-100 dark:border-stone-800">
                <img
                  src="/collaborative_mentoring_sofa.jpg"
                  alt="Young College Students Collaborating on Career Roadmaps"
                  className="w-full h-full object-cover object-center"
                />

                {/* Top Right Floating Pill */}
                <div className="absolute top-5 right-5 flex items-center gap-2 rounded-full bg-white/95 text-stone-900 backdrop-blur-md px-4 py-1.5 text-xs font-semibold shadow-xs border border-stone-200/80 dark:bg-stone-900/95 dark:text-white">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                  <span>Terstandar RIASEC & O*NET</span>
                </div>

                {/* Bottom Floating Feature Matrix Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-stone-100 dark:border-stone-700 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      <span className="text-[11px] font-bold text-stone-900 dark:text-white">Ekosistem Karier Terpadu</span>
                    </div>
                    <span className="rounded-full bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 px-2.5 py-0.5 text-[10px] font-mono font-bold">100% Free</span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 mt-0.5">
                        <Target className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-950 dark:text-white">Asesmen Minat Multidimensi</p>
                        <p className="text-[10px] text-stone-500">Pemetaan Holland Code RIASEC dengan algoritma kecocokan okupasi akurat.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 mt-0.5">
                        <Sparkles className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-950 dark:text-white">Individual Development Plan (IDP)</p>
                        <p className="text-[10px] text-stone-500">Penyusunan target aksi dan portofolio per semester yang dapat diukur.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 mt-0.5">
                        <FileCheck className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-950 dark:text-white">Validasi Portofolio Berjenjang</p>
                        <p className="text-[10px] text-stone-500">Bukti sertifikat dan proyek dikurasi langsung oleh mentor manusia.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        role={role}
        educationLevel={educationLevel}
      />
    </div>
  );
}
