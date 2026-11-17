"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map,
  ArrowLeft,
  Target,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Check,
  BookOpen,
} from "lucide-react";

interface CompetencyReq {
  id: string;
  name: string;
  code: string;
  category: string;
  expectedLevel: string;
  importance: string;
}

interface OccupationDetail {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  hollandCode: string;
  educationPaths: string;
  explorationActivities: string;
  salaryRange?: string | null;
  outlook: string;
  competencies: CompetencyReq[];
}

interface SkillGapData {
  targetCareerTitle: string;
  acquiredSkills: Array<{ name: string; tier: string }>;
  gapSkills: Array<{ name: string; expectedLevel: string; importance: string }>;
  completionPercentage: number;
}

export default function CareerDetailClient({ slug }: { slug: string }) {
  const [occ, setOcc] = useState<OccupationDetail | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetSet, setTargetSet] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/careers/${slug}`);
        if (res.ok) {
          const json = await res.json();
          setOcc(json.occupation);

          if (json.occupation?.id) {
            const gapRes = await fetch(`/api/careers/skill-gap?occupationId=${json.occupation.id}`);
            if (gapRes.ok) {
              const gapJson = await gapRes.json();
              setSkillGap(gapJson.analysis);
            }
          }
        }
      } catch (err) {
        console.error("Error loading occupation detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  async function handleSetTarget() {
    if (!occ) return;
    try {
      const res = await fetch("/api/careers/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupationId: occ.id }),
      });
      if (res.ok) {
        setTargetSet(true);
        setTimeout(() => setTargetSet(false), 3000);
      }
    } catch (err) {
      console.error("Error setting target:", err);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
        <p className="text-xs font-semibold tracking-tight text-stone-500">Memuat profil profesi & analisis kesenjangan...</p>
      </div>
    );
  }

  if (!occ) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-sm font-bold text-red-600">Profesi tidak ditemukan.</p>
        <Link href="/career-map" className="mt-3 inline-block text-xs font-bold text-stone-900 hover:text-red-600 underline">
          Kembali ke Peta Karier
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/career-map"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-700 hover:border-stone-900 hover:text-stone-950 transition-colors dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Peta Karier
        </Link>
      </div>

      {/* Main Occupation Banner */}
      <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                {occ.category}
              </span>
              <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300">
                Holland Code: {occ.hollandCode}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                Outlook: {occ.outlook}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-950 dark:text-white">
              {occ.title}
            </h1>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-3xl whitespace-pre-line">
              {occ.description}
            </p>
          </div>

          <div className="flex shrink-0">
            <button
              onClick={handleSetTarget}
              disabled={targetSet}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-bold shadow-xs transition-colors ${
                targetSet
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {targetSet ? (
                <>
                  <Check className="h-4 w-4" /> Karier Sasaran Aktif
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" /> Tetapkan Sebagai Sasaran IDP
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Skill Gap Analysis Card */}
      {skillGap && (
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-red-600" />
              <h2 className="text-base font-black tracking-tight text-stone-950 dark:text-white">
                Analisis Kesiapan & Kesenjangan Keterampilan (Skill Gap)
              </h2>
            </div>
            <span className="text-sm font-black text-red-600">
              {skillGap.completionPercentage}% Kesiapan
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="h-2.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-500"
                style={{ width: `${skillGap.completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
              <span>{skillGap.acquiredSkills.length} Kompetensi Dikuasai</span>
              <span>{skillGap.gapSkills.length} Kesenjangan Harus Dikejar</span>
            </div>
          </div>

          {/* 2 Columns: Acquired vs Gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Acquired Skills */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Kompetensi Terpenuhi ({skillGap.acquiredSkills.length})</span>
              </div>
              <div className="space-y-2">
                {skillGap.acquiredSkills.length > 0 ? (
                  skillGap.acquiredSkills.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white/80 p-2.5 text-xs dark:bg-stone-850 border border-emerald-100 dark:border-emerald-900/40"
                    >
                      <span className="font-semibold text-stone-900 dark:text-stone-200">â€¢ {s.name}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.2 text-[9px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                        {s.tier}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic">Belum ada verifikasi kompetensi untuk profesi ini.</p>
                )}
              </div>
            </div>

            {/* Gap Skills */}
            <div className="rounded-2xl border border-red-200/80 bg-red-50/40 p-5 dark:border-red-900/60 dark:bg-red-950/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-red-900 dark:text-red-300">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>Kesenjangan Keterampilan ({skillGap.gapSkills.length})</span>
              </div>
              <div className="space-y-2">
                {skillGap.gapSkills.length > 0 ? (
                  skillGap.gapSkills.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white/80 p-2.5 text-xs dark:bg-stone-850 border border-red-100 dark:border-red-900/40"
                    >
                      <span className="font-semibold text-stone-900 dark:text-stone-200">â€¢ {s.name}</span>
                      <span className="rounded-full border border-stone-300 bg-stone-100 px-2 py-0.2 text-[9px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        Level: {s.expectedLevel} ({s.importance})
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-bold">Semua kompetensi prasyarat telah terpenuhi!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Education & Exploration Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education Paths */}
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-4 w-4 text-red-600" />
            <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white">Jalur Pendidikan yang Relevan</h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {occ.educationPaths}
          </p>
        </div>

        {/* Exploration Activities */}
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-stone-800 dark:text-stone-200" />
            <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white">Contoh Aktivitas Eksplorasi</h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {occ.explorationActivities}
          </p>
        </div>
      </div>

      {/* Required Competencies Table */}
      <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white">
            Matriks Standar Kompetensi Prasyarat ({occ.competencies.length})
          </h3>
          <span className="text-xs text-stone-400">Standar Okupasi Nasional</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-stone-200 bg-stone-50/70 dark:border-stone-800 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Nama Kompetensi</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">Tingkat Kemahiran</th>
                <th className="p-3.5">Tingkat Urgensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {occ.competencies.map((comp) => (
                <tr key={comp.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                  <td className="p-3.5 font-bold text-stone-950 dark:text-white">{comp.name}</td>
                  <td className="p-3.5 text-stone-500">{comp.category}</td>
                  <td className="p-3.5 font-bold text-red-600">{comp.expectedLevel}</td>
                  <td className="p-3.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                        comp.importance === "CRITICAL"
                          ? "border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300"
                          : "border-stone-300 bg-stone-100 text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
                      }`}
                    >
                      {comp.importance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
