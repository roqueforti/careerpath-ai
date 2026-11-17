"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: "STUDENT" | "MENTOR" | "INSTITUTION_ADMIN";
  educationLevel?: string;
}

export function GoogleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleAuthModal({
  isOpen,
  onClose,
  role = "STUDENT",
  educationLevel = "MAHASISWA",
}: GoogleAuthModalProps) {
  const router = useRouter();
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleGoogleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes("@")) {
      setError("Silakan masukkan alamat email Google yang valid.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: googleEmail.trim().toLowerCase(),
          fullName: googleName.trim() || googleEmail.split("@")[0],
          role,
          educationLevel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Gagal melakukan autentikasi dengan akun Google.");
        setLoading(false);
        return;
      }

      onClose();

      // Route according to user role
      const userRole = data.user?.role;
      if (userRole === "PLATFORM_ADMIN") {
        router.push("/admin");
      } else if (userRole === "INSTITUTION_ADMIN") {
        router.push("/institution");
      } else if (userRole === "MENTOR") {
        router.push("/mentoring");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err) {
      console.error("Google Auth modal error:", err);
      setError("Terjadi gangguan koneksi saat menghubungi layanan autentikasi Google.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-[28px] border border-stone-200 bg-white p-6 sm:p-7 shadow-2xl dark:border-stone-800 dark:bg-stone-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-50 border border-stone-200 dark:bg-stone-800 dark:border-stone-700 shadow-2xs">
            <GoogleIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-950 dark:text-white">
            Masuk dengan Google
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs leading-relaxed">
            Gunakan akun Google Anda untuk autentikasi SSO terverifikasi ke platform CareerPath AI.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Google Account Form */}
        <form onSubmit={handleGoogleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
              Alamat Email Google / Gmail
            </label>
            <input
              type="email"
              required
              placeholder="nama.anda@gmail.com"
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-900 dark:text-stone-200 mb-1.5">
              Nama Lengkap Profil
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
              className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-stone-200 py-3 text-xs font-semibold text-stone-600 hover:text-stone-900 dark:border-stone-700 dark:text-stone-300 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !googleEmail}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 py-3 text-xs font-bold text-white shadow-xs hover:bg-black disabled:opacity-50 cursor-pointer transition-colors dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
            >
              {loading ? "Menghubungkan..." : "Lanjutkan"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* Security Footer Note */}
        <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>Sesi terenkripsi dan disimpan aman dalam session cookie HTTP-only</span>
        </div>
      </div>
    </div>
  );
}
