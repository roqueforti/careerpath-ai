"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Map,
  Search,
  Sparkles,
  ArrowRight,
  Target,
  Check,
  Star,
  TrendingUp,
  Compass,
  Briefcase,
  SlidersHorizontal,
} from "lucide-react";
import CareerExplorerGraph from "@/components/CareerExplorerGraph";

interface CareerRecommendation {
  id: string;
  occupationId: string;
  title: string;
  slug: string;
  category: string;
  outlook: string;
  salaryRange?: string | null;
  description: string;
  matchScore: number;
  factors: {
    interest_fit?: string;
    matched_skills?: string[];
    gap_skills?: string[];
    education_fit?: string;
  };
}

interface OccupationSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  hollandCode: string;
  educationPaths: string;
  salaryRange?: string | null;
  outlook: string;
}

export default function CareerMapPage() {
  const [activeTab, setActiveTab] = useState<"RECOMMENDED" | "ALL">("RECOMMENDED");
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [occupations, setOccupations] = useState<OccupationSummary[]>([]);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [targetSuccessId, setTargetSuccessId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [category]);

  async function loadData() {
    setLoading(true);
    try {
      const [recRes, occRes] = await Promise.all([
        fetch("/api/careers/recommendations"),
        fetch(`/api/careers?category=${category}&search=${encodeURIComponent(search)}`),
      ]);

      if (recRes.ok) {
        const recJson = await recRes.json();
        setRecommendations(recJson.recommendations || []);
      }
      if (occRes.ok) {
        const occJson = await occRes.json();
        setOccupations(occJson.occupations || []);
      }
    } catch (err) {
      console.error("Failed to load career map:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSetTarget(occupationId: string) {
    try {
      const res = await fetch("/api/careers/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ occupationId }),
      });
      if (res.ok) {
        setTargetSuccessId(occupationId);
        setTimeout(() => setTargetSuccessId(null), 3000);
      }
    } catch (err) {
      console.error("Error setting target career:", err);
    }
  }

  const categories = [
    "ALL",
    "Teknologi Informasi",
    "Desain & Kreatif",
    "Kesehatan & Sosial",
    "Bisnis & Manajemen",
  ];

  const filteredOccupations = occupations.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans pb-24 selection:bg-red-600 selection:text-white">
      {/* 1. Kinetic Marquee Ticker */}
      <div className="w-full bg-stone-950 text-white overflow-hidden py-2 border-b border-stone-850">
        <div className="flex items-center gap-8 whitespace-nowrap text-[11px] font-mono tracking-wider animate-pulse">
          <span>✦ TRAJECTORY RADAR</span>
          <span>EXPLAINABLE HOLLAND MATCH</span>
          <span>O*NET TAXONOMY</span>
          <span>SALARY SPECTRUM INTEL</span>
          <span>RECOMMENDED: {recommendations.length} PROFESI</span>
          <span>TOTAL EXPLORABLE: {occupations.length} OCCUPATIONS</span>
          <span>✦ TRAJECTORY RADAR</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-12">
        {/* Visual Interactive Career Roadmap (Reference UI) */}
        <CareerExplorerGraph />

        {/* 2. Editorial Split Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Title & Filter Bar (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 dark:text-red-300 px-2.5 py-1 rounded-full border border-red-200/60 dark:border-red-900/50">
                  MODUL MAP // RADAR JALUR KARIER
                </span>
                <span className="text-[11px] font-mono text-stone-400">·</span>
                <span className="text-xs font-semibold text-stone-500">
                  Explainable Career Trajectory
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-950 dark:text-white leading-[0.98]">
                EXPLORE YOUR <br />
                <span className="text-red-600">TRAJECTORY.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                Peta okupasi transparan berstandar O*NET internasional. Setiap rekomendasi dihitung secara objektif berdasarkan skor tes minat Holland Code, gap keterampilan, dan preferensi studimu.
              </p>
            </div>

            {/* Pill Tabs & Search Filter Strip */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab("RECOMMENDED")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all border cursor-pointer ${
                    activeTab === "RECOMMENDED"
                      ? "bg-stone-950 text-white border-stone-950 dark:bg-white dark:text-stone-950 shadow-2xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 shadow-2xs"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                  <span>Rekomendasi Terbuka ({recommendations.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("ALL")}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold transition-all border cursor-pointer ${
                    activeTab === "ALL"
                      ? "bg-stone-950 text-white border-stone-950 dark:bg-white dark:text-stone-950 shadow-2xs"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-900 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-700 shadow-2xs"
                  }`}
                >
                  <Compass className="h-3 w-3 text-stone-400" />
                  <span>Semua Okupasi ({occupations.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 shadow-2xs focus:border-red-600 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "ALL" ? "Semua Klaster Bidang" : c}
                    </option>
                  ))}
                </select>

                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Ketik profesi atau keahlian..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-white pl-9 pr-4 py-2 text-xs font-medium text-stone-900 focus:border-red-600 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Featured Cohort Exhibit (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900 h-full flex flex-col">
              <div className="relative flex-1 min-h-[380px] lg:min-h-[440px] rounded-[24px] overflow-hidden border border-stone-100 dark:border-stone-800">
                <img
                  src="/collaborative_mentoring_sofa.jpg"
                  alt="Young College Students Exploring Career Pathways"
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/95 text-stone-900 backdrop-blur-md px-3.5 py-1 text-xs font-semibold shadow-xs border border-stone-200/80 dark:bg-stone-900/95 dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>O*NET & RIASEC Accredited</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-100 dark:border-stone-700 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">
                      EXPLAINABLE FIT ALGORITHM
                    </span>
                    <span className="font-mono text-xs font-black text-red-600">89% CLARITY</span>
                  </div>
                  <p className="text-xs font-bold text-stone-900 dark:text-white">
                    Transparansi Perhitungan Kecocokan
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Sistem tidak sekadar menyodorkan rekomendasi instan, tetapi merinci alasan minat, kompetensi yang relevan, dan gap keterampilan yang perlu dipelajari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Career Index Exhibit (Breaking boring cards!) */}
        {loading ? (
          <div className="p-16 text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Mengalkulasi Kecocokan Algoritma Karier...
            </p>
          </div>
        ) : activeTab === "RECOMMENDED" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200/90 pb-4 dark:border-stone-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                RECOMMENDED CAREER STACK ({recommendations.length} MATCHES)
              </span>
              <span className="text-xs font-mono text-stone-400">SORTED BY FIT COEFFICIENT</span>
            </div>

            <div className="space-y-5">
              {recommendations.map((rec, idx) => {
                const isTargetSuccess = targetSuccessId === rec.occupationId;
                return (
                  <div
                    key={rec.id}
                    className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs hover:border-stone-950 transition-all dark:border-stone-800 dark:bg-stone-900 space-y-5 group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600 transition-colors">
                            INDEX // {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 dark:bg-red-950/60 px-3 py-1 text-xs font-black text-red-600 border border-red-200/70 dark:border-red-900">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            {rec.matchScore}% KECOCOKAN
                          </span>
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                            {rec.category}
                          </span>
                          <span className="font-mono text-xs text-stone-500">
                            PROSPEK: <strong className="text-stone-900 dark:text-white uppercase">{rec.outlook}</strong>
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-stone-950 dark:text-white tracking-tight">
                          {rec.title}
                        </h2>

                        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-4xl leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2.5 shrink-0 self-start">
                        <button
                          onClick={() => handleSetTarget(rec.occupationId)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                            isTargetSuccess
                              ? "bg-emerald-600 text-white"
                              : "bg-white border border-stone-200 text-stone-850 hover:border-red-600 hover:text-red-600 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-200"
                          }`}
                        >
                          {isTargetSuccess ? (
                            <>
                              <Check className="h-3.5 w-3.5" /> Target Disimpan!
                            </>
                          ) : (
                            <>
                              <Target className="h-3.5 w-3.5 text-red-600" /> Jadikan Target
                            </>
                          )}
                        </button>
                        <Link
                          href={`/career-map/${rec.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all cursor-pointer"
                        >
                          Lihat Skill Gap <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Explainable AI Factor Strip */}
                    <div className="rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-4 sm:p-5 border border-stone-200/60 dark:border-stone-800 text-xs space-y-3">
                      <div className="flex items-start gap-2.5">
                        <Sparkles className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-950 dark:text-white">
                            Explainable Fit Factor (Rasionalisasi Kecocokan):
                          </p>
                          <p className="text-stone-600 dark:text-stone-300 text-[11px] mt-0.5 leading-relaxed">
                            {rec.factors.interest_fit || "Kesesuaian tinggi berdasarkan profil Holland Code RIASEC dominan."}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                        {rec.factors.matched_skills && rec.factors.matched_skills.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">
                              Keahlian Cocok:
                            </span>
                            {rec.factors.matched_skills.map((s) => (
                              <span
                                key={s}
                                className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-2.5 py-0.5 text-[10px] font-semibold text-stone-800 dark:text-stone-200"
                              >
                                <Check className="h-2.5 w-2.5 text-emerald-600" /> {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {rec.factors.gap_skills && rec.factors.gap_skills.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px]">
                              Perlu Dikembangkan:
                            </span>
                            {rec.factors.gap_skills.map((s) => (
                              <span
                                key={s}
                                className="rounded-full bg-red-50 dark:bg-red-950/60 border border-red-200/80 dark:border-red-900 px-2.5 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-300"
                              >
                                • {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* All Occupations Tab */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200/90 pb-4 dark:border-stone-800">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">
                ALL OCCUPATIONS INDEX ({filteredOccupations.length} ITEMS)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOccupations.map((occ, idx) => (
                <div
                  key={occ.id}
                  className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs hover:border-stone-950 transition-all dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-stone-400 group-hover:text-red-600 transition-colors">
                        OCC // {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[10px] font-black text-red-600 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-full border border-red-200/60 dark:border-red-900">
                        RIASEC: {occ.hollandCode}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-stone-950 dark:text-white tracking-tight leading-snug">
                      {occ.title}
                    </h3>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                      {occ.description}
                    </p>

                    {occ.salaryRange && (
                      <p className="text-[11px] font-mono text-stone-500 pt-1">
                        GAJI: <strong className="text-stone-900 dark:text-white font-sans">{occ.salaryRange}</strong>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <button
                      onClick={() => handleSetTarget(occ.id)}
                      className="text-xs font-bold text-stone-600 hover:text-red-600 dark:text-stone-400 transition-colors cursor-pointer"
                    >
                      Pilih Target
                    </button>
                    <Link
                      href={`/career-map/${occ.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-stone-950 hover:text-red-600 dark:text-white transition-colors"
                    >
                      Detail Profesi <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
