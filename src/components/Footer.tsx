import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/90 bg-white dark:border-zinc-800 dark:bg-zinc-900 font-sans">
      <div className="mx-auto max-w-[1720px] px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Top: Brand & Grand Design Architecture */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-xs">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-zinc-950 dark:text-white tracking-tight">
                Career<span className="text-red-600">Path</span> AI-Assisted Mentoring Platform
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Arsitektur Ekosistem Bimbingan Karier Terpadu (SMP/MTs, SMA/SMK/MA, Mahasiswa & Mahasiswa Akhir)
              </p>
            </div>
          </div>

          {/* 5 Core Enterprise Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Link href="/input" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Asesmen Terarah
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">➔</span>
            <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Peta Karier O*NET
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">➔</span>
            <Link href="/development-plans" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Rencana Aksi IDP
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">➔</span>
            <Link href="/portfolio" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Digital Skill Passport
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">➔</span>
            <Link href="/opportunities" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Peluang Industri & Magang
            </Link>
          </div>
        </div>

        {/* Bottom: 5 Principles & Governance */}
        <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">5 Prinsip Tata Kelola:</span>
            <span>Personalisasi</span> • 
            <span>Human-in-the-Loop</span> • 
            <span>Bukti Kompetensi</span> • 
            <span>Privasi & Keamanan Data</span> • 
            <span>Akses Inklusif</span>
          </div>

          <div className="text-center sm:text-right font-medium">
            &copy; {new Date().getFullYear()} CareerPath. Standar O*NET & Kurikulum Vokasi Nasional.
          </div>
        </div>
      </div>
    </footer>
  );
}
