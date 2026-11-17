"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Building,
  Lock,
  Shield,
  Save,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  KeyRound,
  History,
} from "lucide-react";

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  role: "STUDENT" | "MENTOR" | "INSTITUTION_ADMIN" | "PLATFORM_ADMIN";
  avatar_url?: string | null;
  created_at: string;
  education_level?: string;
  career_maturity?: string;
  career_maturity_score?: number;
  target_career_id?: string | null;
  target_career_title?: string | null;
  target_career_category?: string | null;
  bio?: string | null;
  phone?: string | null;
  interests?: string | null;
  is_public?: number;
  institution?: {
    institution_name: string;
    institution_code: string;
    institution_type: string;
    member_role: string;
    student_id_number?: string;
  } | null;
  recentActivity?: Array<{
    action: string;
    resource: string;
    created_at: string;
  }>;
}

interface CareerOption {
  id: string;
  title: string;
  category: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [careers, setCareers] = useState<CareerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [educationLevel, setEducationLevel] = useState("SMA");
  const [targetCareerId, setTargetCareerId] = useState("");
  const [institutionCode, setInstitutionCode] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    fetchProfileData();
    fetchCareers();
  }, []);

  async function fetchProfileData() {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/profile");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/profile");
          return;
        }
        setErrorMsg("Gagal memuat profil pengguna.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
        setFullName(data.profile.full_name || "");
        setPhone(data.profile.phone || "");
        setBio(data.profile.bio || "");
        setInterests(data.profile.interests || "");
        setEducationLevel(data.profile.education_level || "SMA");
        setTargetCareerId(data.profile.target_career_id || "");
        setIsPublic(data.profile.is_public === 1);
      }
      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setErrorMsg("Terjadi gangguan saat mengambil data profil.");
      setLoading(false);
    }
  }

  async function fetchCareers() {
    try {
      const res = await fetch("/api/careers");
      if (res.ok) {
        const data = await res.json();
        setCareers(data.careers || []);
      }
    } catch (err) {
      console.error("Careers fetch error:", err);
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          bio,
          interests,
          educationLevel,
          targetCareerId: targetCareerId || null,
          institutionCode: institutionCode.trim() || undefined,
          isPublic: isPublic ? 1 : 0,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Profil akun berhasil diperbarui.");
        setProfile(data.profile);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(data.error || "Gagal memperbarui profil akun.");
      }
    } catch (err) {
      console.error("Profile submit error:", err);
      setErrorMsg("Terjadi kesalahan saat menyimpan pembaruan profil.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmNewPassword) {
      setPasswordMsg({ text: "Konfirmasi kata sandi baru tidak sesuai.", isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: "Kata sandi baru minimal harus 6 karakter.", isError: true });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordMsg({ text: "Kata sandi berhasil diperbarui dengan aman.", isError: false });
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setTimeout(() => setPasswordMsg(null), 4000);
      } else {
        setPasswordMsg({ text: data.error || "Gagal memperbarui kata sandi.", isError: true });
      }
    } catch (err) {
      console.error("Password change error:", err);
      setPasswordMsg({ text: "Terjadi kesalahan internal saat memperbarui kata sandi.", isError: true });
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 font-sans text-center">
        <div className="inline-flex h-10 w-10 animate-spin items-center justify-center rounded-full border-2 border-red-600 border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-stone-500">Memuat profil akun Anda...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 font-sans text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
        <h2 className="mt-4 text-lg font-bold text-stone-900 dark:text-white">Sesi Akun Tidak Ditemukan</h2>
        <p className="mt-2 text-xs text-stone-500">Silakan masuk ke akun Anda terlebih dahulu.</p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700"
        >
          Masuk ke Akun
        </Link>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    STUDENT: "Pelajar / Mahasiswa",
    MENTOR: "Mentor Profesional",
    INSTITUTION_ADMIN: "Pengelola Institusi",
    PLATFORM_ADMIN: "Platform Superadmin",
  };

  const eduLabels: Record<string, string> = {
    SMP: "SMP / MTs",
    SMA: "SMA / MA",
    SMK: "SMK Vokasi",
    MA: "Madrasah Aliyah",
    MAHASISWA: "Mahasiswa S1/D4",
    MAHASISWA_AKHIR: "Mahasiswa Tingkat Akhir",
    UMUM: "Umum / Profesional",
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans selection:bg-red-600 selection:text-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Actions */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <Link href="/dashboard" className="hover:text-red-600">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-stone-900 dark:text-white font-bold">Profil & Pengaturan Akun</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-stone-950 dark:text-white">
            Pengaturan Akun Pengguna
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:border-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 transition-colors shadow-2xs"
          >
            Kembali ke Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="mb-8 rounded-[28px] border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs dark:border-stone-850 dark:bg-stone-900">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white dark:bg-red-600 font-bold text-2xl shadow-md">
            {profile.full_name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-500 dark:border-stone-900" />
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white">
                {profile.full_name}
              </h2>
              <span className="rounded-full bg-red-50 border border-red-200/70 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950/50 dark:border-red-900/60 dark:text-red-300">
                {roleLabels[profile.role] || profile.role}
              </span>
              {profile.education_level && (
                <span className="rounded-full bg-stone-100 border border-stone-200 px-2.5 py-0.5 text-[11px] font-bold text-stone-700 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300">
                  {eduLabels[profile.education_level] || profile.education_level}
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              {profile.email} • Terdaftar sejak{" "}
              {new Date(profile.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            {profile.bio && (
              <p className="text-xs text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed pt-1">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Quick Metrics */}
          {profile.role === "STUDENT" && (
            <div className="flex items-center gap-3 sm:border-l sm:border-stone-200 sm:pl-6 dark:border-stone-800">
              <div className="text-center rounded-2xl bg-stone-50 border border-stone-200/70 p-3 dark:bg-stone-800 dark:border-stone-700">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Kematangan
                </span>
                <span className="text-base font-black text-red-600 block">
                  {profile.career_maturity || "EXPLORE"}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Skor: {profile.career_maturity_score || 0}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Alerts */}
      {successMsg && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Form (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-850 dark:bg-stone-900">
            <div className="flex items-center gap-2.5 pb-5 border-b border-stone-100 dark:border-stone-800 mb-6">
              <User className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-base font-bold text-stone-950 dark:text-white">
                  Informasi Profil Pengguna
                </h3>
                <p className="text-xs text-stone-500">
                  Perbarui identitas, kontak, dan bio deskripsi diri Anda.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Alamat Email (Akun Terverifikasi)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full rounded-full border border-stone-200 bg-stone-100 py-2.5 px-4 text-xs text-stone-500 cursor-not-allowed dark:border-stone-800 dark:bg-stone-850 dark:text-stone-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Nomor WhatsApp / Telepon
                  </label>
                  <input
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Jenjang Pendidikan
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all cursor-pointer"
                  >
                    <option value="SMP">SMP / MTs (Eksplorasi Awal)</option>
                    <option value="SMA">SMA / MA (Peminatan Akademik)</option>
                    <option value="SMK">SMK (Peminatan Vokasi / Kejuruan)</option>
                    <option value="MAHASISWA">Mahasiswa (Semester 1 - 6)</option>
                    <option value="MAHASISWA_AKHIR">Mahasiswa Tingkat Akhir / Skripsi</option>
                    <option value="UMUM">Umum / Profesional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                  Bio / Deskripsi Singkat Diri
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan latar belakang minat, keahlian, atau tujuan karier Anda..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                  Minat & Kata Kunci Karier (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Machine Learning, Cloud Architecture, Data Analytics, Fintech"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                  Target Okupasi / Karier Idaman
                </label>
                <select
                  value={targetCareerId}
                  onChange={(e) => setTargetCareerId(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all cursor-pointer"
                >
                  <option value="">-- Belum Memilih Target Karier --</option>
                  {careers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution link input if not attached */}
              {!profile.institution && (
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Hubungkan ke Institusi / Kampus (Kode Institusi)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: ITB-CDC atau SMAN1-JKT"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                  />
                  <p className="mt-1 text-[11px] text-stone-400">
                    Masukkan kode resmi dari sekolah/universitas Anda untuk mengaktifkan pemantauan karier oleh pembimbing.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-stone-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="isPublic" className="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  Izinkan profil portofolio dan lencana kompetensi saya dapat dilihat oleh perekrut publik.
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? "Menyimpan Perubahan..." : "Simpan Pembaruan Profil"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-850 dark:bg-stone-900">
            <div className="flex items-center gap-2.5 pb-5 border-b border-stone-100 dark:border-stone-800 mb-6">
              <KeyRound className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-base font-bold text-stone-950 dark:text-white">
                  Ganti Kata Sandi
                </h3>
                <p className="text-xs text-stone-500">
                  Pastikan akun Anda menggunakan kombinasi sandi yang kuat dan aman.
                </p>
              </div>
            </div>

            {passwordMsg && (
              <div
                className={`mb-5 flex items-center gap-2.5 rounded-2xl border p-3.5 text-xs font-semibold ${
                  passwordMsg.isError
                    ? "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
                }`}
              >
                {passwordMsg.isError ? (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                )}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/70 py-2.5 px-4 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-950 bg-stone-950 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>{passwordSaving ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar Details (1 col) */}
        <div className="space-y-6">
          {/* Target Career Status Card */}
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-850 dark:bg-stone-900">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-950 dark:text-white mb-3">
              <Target className="h-4 w-4 text-red-600" />
              <span>Target Okupasi Aktif</span>
            </div>
            {profile.target_career_title ? (
              <div className="rounded-2xl border border-red-200/80 bg-red-50/60 p-4 dark:border-red-950 dark:bg-red-950/30">
                <h4 className="text-sm font-black text-stone-950 dark:text-white">
                  {profile.target_career_title}
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">
                  Bidang: {profile.target_career_category}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/career-map`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700"
                  >
                    <span>Lihat Peta Karier</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-200 p-4 text-center dark:border-stone-800">
                <p className="text-xs text-stone-500 mb-2">Belum ada target karier yang dipilih.</p>
                <Link
                  href="/assessments"
                  className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1.5 text-[11px] font-bold text-stone-800 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <Sparkles className="h-3 w-3 text-red-600" />
                  <span>Ikuti Asesmen RIASEC</span>
                </Link>
              </div>
            )}
          </div>

          {/* Institution Membership Card */}
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-850 dark:bg-stone-900">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-950 dark:text-white mb-3">
              <Building className="h-4 w-4 text-red-600" />
              <span>Afiliasi Institusi Kampus / Sekolah</span>
            </div>

            {profile.institution ? (
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-850 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                    {profile.institution.institution_code}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {profile.institution.institution_type}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-white leading-tight">
                  {profile.institution.institution_name}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Peran: <strong className="text-stone-800 dark:text-stone-200">{profile.institution.member_role}</strong>
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-4 text-center dark:border-stone-800 dark:bg-stone-850">
                <p className="text-xs text-stone-500">
                  Akun Anda belum terhubung ke institusi pendidikan formal.
                </p>
              </div>
            )}
          </div>

          {/* Security & Audit Activity */}
          <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-850 dark:bg-stone-900">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-950 dark:text-white mb-3">
              <History className="h-4 w-4 text-red-600" />
              <span>Riwayat Aktivitas Keamanan</span>
            </div>

            {profile.recentActivity && profile.recentActivity.length > 0 ? (
              <div className="space-y-2">
                {profile.recentActivity.map((act, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between border-b border-stone-100 pb-2 dark:border-stone-800 text-[11px]"
                  >
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-white font-mono">
                        {act.action}
                      </p>
                      <p className="text-[10px] text-stone-400">Target: {act.resource}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                      {new Date(act.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400">Belum ada catatan aktivitas keamanan.</p>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
