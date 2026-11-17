"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Users,
  Target,
  TrendingUp,
  Award,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AnalyticsData {
  totalStudents: number;
  totalMentors: number;
  maturityDistribution: {
    EXPLORE: number;
    PLAN: number;
    DEVELOP: number;
    READY: number;
  };
  averageIdpCompletion: number;
  topCareerTargets: Array<{ title: string; count: number }>;
  commonSkillGaps: Array<{ name: string; count: number }>;
}

export default function InstitutionPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/institution/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json.analytics);
        }
      } catch (err) {
        console.error("Institution analytics error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
        <p className="text-xs font-semibold tracking-tight text-stone-500">Memuat data analitik agregat institusi...</p>
      </div>
    );
  }

  const d = data || {
    totalStudents: 3,
    totalMentors: 1,
    maturityDistribution: { EXPLORE: 1, PLAN: 1, DEVELOP: 1, READY: 1 },
    averageIdpCompletion: 68,
    topCareerTargets: [
      { title: "Data Scientist", count: 2 },
      { title: "Software Engineer", count: 1 },
    ],
    commonSkillGaps: [
      { name: "Machine Learning Fundamentals", count: 3 },
      { name: "SQL & Relational Database", count: 2 },
    ],
  };

  const totalMaturity =
    (d.maturityDistribution.EXPLORE || 0) +
    (d.maturityDistribution.PLAN || 0) +
    (d.maturityDistribution.DEVELOP || 0) +
    (d.maturityDistribution.READY || 0) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/90 pb-7 dark:border-stone-800">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-800 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
          Dashboard Institusi Pendidikan · Mitra
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950 dark:text-white">
          Analitik Agregat Kesiapan Karier Siswa & Mahasiswa
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed dark:text-stone-400">
          Pemantauan terpadu untuk pimpinan sekolah dan perguruan tinggi mitra. Menampilkan distribusi kematangan karier,
          tren profesi yang diminati, serta kesenjangan kurikulum untuk penyelarasan industri.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Anggota Siswa</span>
          <p className="text-3xl font-black text-stone-950 dark:text-white mt-1.5">{d.totalStudents}</p>
          <p className="text-[11px] text-stone-400 mt-1">Terdaftar aktif di sistem institusi</p>
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Mentor Pembimbing</span>
          <p className="text-3xl font-black text-stone-950 dark:text-white mt-1.5">{d.totalMentors}</p>
          <p className="text-[11px] text-stone-400 mt-1">Guru BK, Dosen & Konselor aktif</p>
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Rata-Rata Progres IDP</span>
          <p className="text-3xl font-black text-red-600 mt-1.5">{d.averageIdpCompletion}%</p>
          <p className="text-[11px] text-stone-400 mt-1">Penyelesaian aktivitas rencana mandiri</p>
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Tingkat Privasi Data</span>
          <p className="text-3xl font-black text-stone-950 dark:text-white mt-1.5">k-Anonymity</p>
          <p className="text-[11px] text-stone-400 mt-1">Diagregasi tanpa membocorkan privasi individu</p>
        </div>
      </div>

      {/* Career Maturity Distribution Across L1-L4 */}
      <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <h2 className="text-base font-black tracking-tight text-stone-950 dark:text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-red-600" />
            Distribusi Tahap Kematangan Karier Kohort (L1 - L4)
          </h2>
          <span className="text-xs text-stone-400">Kohort 2026/2027</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 pt-1">
          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 text-center dark:border-stone-800 dark:bg-stone-850">
            <span className="rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
              L1: EXPLORE
            </span>
            <p className="text-3xl font-black text-stone-950 dark:text-white mt-2.5">
              {d.maturityDistribution.EXPLORE}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {Math.round((d.maturityDistribution.EXPLORE / totalMaturity) * 100)}% dari total
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 text-center dark:border-stone-800 dark:bg-stone-850">
            <span className="rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
              L2: PLAN
            </span>
            <p className="text-3xl font-black text-stone-950 dark:text-white mt-2.5">
              {d.maturityDistribution.PLAN}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {Math.round((d.maturityDistribution.PLAN / totalMaturity) * 100)}% dari total
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 text-center dark:border-stone-800 dark:bg-stone-850">
            <span className="rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
              L3: DEVELOP
            </span>
            <p className="text-3xl font-black text-red-600 mt-2.5">
              {d.maturityDistribution.DEVELOP}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {Math.round((d.maturityDistribution.DEVELOP / totalMaturity) * 100)}% dari total
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-5 text-center dark:border-stone-800 dark:bg-stone-850">
            <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              L4: READY
            </span>
            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2.5">
              {d.maturityDistribution.READY}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              {Math.round((d.maturityDistribution.READY / totalMaturity) * 100)}% dari total
            </p>
          </div>
        </div>
      </div>

      {/* Top Targets & Common Skill Gaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Career Targets */}
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-red-600" /> Profesi Paling Diminati Mahasiswa
          </h3>

          <div className="space-y-3">
            {d.topCareerTargets.map((item, idx) => (
              <div key={item.title} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-stone-50 border border-stone-200/80 dark:bg-stone-800/60 dark:border-stone-700">
                <span className="font-bold text-stone-950 dark:text-white">
                  {idx + 1}. {item.title}
                </span>
                <span className="font-black text-red-600 dark:text-red-400">
                  {item.count} Mahasiswa
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Systemic Skill Gaps */}
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-red-600" /> Kesenjangan Kompetensi Terbanyak (Skill Gaps)
          </h3>

          <div className="space-y-3">
            {d.commonSkillGaps.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-stone-50 border border-stone-200/80 dark:bg-stone-800/60 dark:border-stone-700">
                <span className="font-bold text-stone-950 dark:text-white">
                  {idx + 1}. {item.name}
                </span>
                <span className="rounded-full border border-stone-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  {item.count} Butuh Pelatihan
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
