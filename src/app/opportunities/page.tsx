"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  Calendar,
  MapPin,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Filter,
  Check,
  X,
  Zap,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  Flame,
} from "lucide-react";

interface OpportunityItem {
  id: string;
  title: string;
  type: "INTERNSHIP" | "SCHOLARSHIP" | "TRAINING" | "JOB";
  organization: string;
  location: string;
  workType: "REMOTE" | "HYBRID" | "ON_SITE";
  educationLevel: string;
  description: string;
  requirements: string[];
  deadline?: string | null;
  url: string;
  isActive: boolean;
  isSaved?: boolean;
}

interface DiagnosisResult {
  status: "ELIGIBLE" | "POTENTIAL_MATCH" | "NOT_ELIGIBLE";
  matchPercentage: number;
  fulfilledRequirements: string[];
  unfulfilledRequirements: string[];
  actionableRecommendations: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [eduFilter, setEduFilter] = useState("SEMUA");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Diagnostic modal state
  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);
  const [activeOpp, setActiveOpp] = useState<OpportunityItem | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [typeFilter, eduFilter]);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/opportunities?type=${typeFilter}&educationLevel=${eduFilter}&search=${encodeURIComponent(search)}`
      );
      if (res.ok) {
        const json = await res.json();
        setOpportunities(json.opportunities || []);
      }
    } catch (err) {
      console.error("Error loading opportunities:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleSave(oppId: string) {
    try {
      const res = await fetch("/api/opportunities/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: oppId }),
      });
      if (res.ok) {
        const json = await res.json();
        setOpportunities((prev) =>
          prev.map((o) => (o.id === oppId ? { ...o, isSaved: json.isSaved } : o))
        );
      }
    } catch (err) {
      console.error("Error saving opportunity:", err);
    }
  }

  async function handleOpenDiagnosis(opp: OpportunityItem) {
    setActiveOpp(opp);
    setDiagModalOpen(true);
    setDiagLoading(true);
    setDiagnosis(null);

    try {
      const res = await fetch(`/api/opportunities/${opp.id}/eligibility`);
      if (res.ok) {
        const json = await res.json();
        setDiagnosis(json.diagnosis);
      }
    } catch (err) {
      console.error("Error fetching diagnosis:", err);
    } finally {
      setDiagLoading(false);
    }
  }

  const types = [
    { label: "SEMUA PELUANG", val: "ALL" },
    { label: "MAGANG / INTERN", val: "INTERNSHIP" },
    { label: "BEASISWA", val: "SCHOLARSHIP" },
    { label: "BOOTCAMP & TRAINING", val: "TRAINING" },
    { label: "ENTRY LEVEL JOBS", val: "JOB" },
  ];

  const eduLevels = ["SEMUA", "SMP", "SMA_SMK", "MAHASISWA"];

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 selection:bg-red-600 selection:text-white pb-24 font-sans">
      {/* 1. Kinetic Top Marquee Ticker */}
      <div className="border-b border-stone-200 bg-white overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-[marquee_26s_linear_infinite] gap-10 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-600 items-center">
          <span className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-red-600 animate-pulse" /> TALENT RADAR 2026 // LIVE OPPORTUNITY CURATION
          </span>
          <span className="text-stone-300">/</span>
          <span>MBKM BERSERTIFIKAT & TOP INDONESIAN TECH STARTUPS</span>
          <span className="text-stone-300">/</span>
          <span className="text-red-600 font-black">AI ELIGIBILITY DIAGNOSTIC ENGINE VERIFIED</span>
          <span className="text-stone-300">/</span>
          <span>GLOBAL SCHOLARSHIPS // LPDP, IISMA & CHEVENING READY</span>
          <span className="text-stone-300">/</span>
          <span>ZERO CLICKBAIT // INDUSTRY VERIFIED REQUIREMENTS</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Asymmetrical Editorial Masthead */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Bold Typography & Filter HUD */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-stone-900 text-white px-2.5 py-1 rounded">
                  OPP // RADAR 2026
                </span>
                <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                  MODUL MATCH & INDUSTRY FIT
                </span>
                <span className="font-mono text-[10px] font-bold text-stone-500 px-2">
                  CURATED TALENT FEED
                </span>
              </div>

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-stone-950 leading-[0.92]">
                  RADAR ON <br />
                  <span className="text-red-600 underline decoration-red-200 underline-offset-8">TALENT.</span>
                </h1>
                <p className="mt-5 text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                  Jembatan akselerasi antara keahlian yang telah kamu buktikan dengan peluang nyata di industri. Audit kelayakanmu secara instan sebelum mengajukan lamaran.
                </p>
              </div>

              {/* Type Category Pill Selector */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                  FILTER KATEGORI
                </span>
                <div className="flex flex-wrap gap-2">
                  {types.map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setTypeFilter(t.val)}
                      className={`font-mono text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                        typeFilter === t.val
                          ? "bg-stone-950 text-white shadow-xs"
                          : "bg-white text-stone-600 border border-stone-200 hover:border-stone-900"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education Level Selector & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {eduLevels.map((e) => (
                    <button
                      key={e}
                      onClick={() => setEduFilter(e)}
                      className={`font-mono text-[11px] px-3 py-1.5 rounded-full transition-all cursor-pointer font-bold ${
                        eduFilter === e
                          ? "bg-red-600 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {e === "SEMUA" ? "SEMUA JENJANG" : e}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari posisi, institusi, stack..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchOpportunities()}
                    className="w-full rounded-full border border-stone-200 bg-white pl-9 pr-4 py-2 text-xs font-medium text-stone-900 focus:border-red-600 focus:outline-none shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Youth Student Imagery & Floating Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl group">
              <img
                src="/collaborative_mentoring_sofa.jpg"
                alt="Young university students collaborating on career opportunities"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>

              {/* Floating Top Pill */}
              <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE TALENT FEED // RADAR ONLINE
              </div>

              {/* Floating Bottom Telemetry Console */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-lg flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    OPPORTUNITIES IN RADAR
                  </span>
                  <div className="text-2xl font-black text-stone-950 flex items-baseline gap-2">
                    {opportunities.length} POSITIONS
                    <span className="text-xs font-bold text-red-600">
                      LIVE
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold border border-red-200">
                  <Sparkles className="h-3 w-3" /> AI AUDIT READY
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Gen Z Exhibition Index Rows (Breaking the Card Box Grid) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-red-600 rounded-full"></span>
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                TALENT OPPORTUNITY LEDGER ({opportunities.length})
              </h2>
            </div>
            <span className="font-mono text-[11px] text-stone-500">
              AUDITED COMPLIANCE & ELIGIBILITY
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-600 border-t-transparent mx-auto mb-3"></div>
              <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold">
                Querying Industry Opportunities...
              </span>
            </div>
          ) : opportunities.length > 0 ? (
            <div className="space-y-3">
              {opportunities.map((opp, idx) => (
                <div
                  key={opp.id}
                  className="rounded-3xl border border-stone-200/90 bg-white p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group"
                >
                  {/* Subtle red accent bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-stone-200 group-hover:bg-red-600 transition-colors"></div>

                  <div className="pl-3 sm:pl-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Content Section */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-black uppercase text-stone-400">
                          RADAR // #{String(idx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            opp.type === "INTERNSHIP"
                              ? "bg-stone-900 text-white border-stone-900"
                              : opp.type === "SCHOLARSHIP"
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : opp.type === "TRAINING"
                              ? "bg-red-100 text-red-900 border-red-200"
                              : "bg-emerald-100 text-emerald-900 border-emerald-300"
                          }`}
                        >
                          {opp.type}
                        </span>
                        <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
                          {opp.workType}
                        </span>
                        <span className="font-mono text-[10px] text-stone-500">
                          TARGET: {opp.educationLevel}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 group-hover:text-red-600 transition-colors">
                          {opp.title}
                        </h3>
                        <p className="text-xs font-bold text-red-600 uppercase tracking-wider font-mono mt-0.5">
                          {opp.organization}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl line-clamp-2">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-stone-400" /> {opp.location}
                        </span>
                        {opp.deadline && (
                          <span className="flex items-center gap-1 text-red-600 font-bold">
                            <Calendar className="h-3.5 w-3.5" /> TENGGAT: {opp.deadline}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Hub */}
                    <div className="flex items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <button
                        onClick={() => handleToggleSave(opp.id)}
                        title={opp.isSaved ? "Hapus dari Simpanan" : "Simpan Peluang"}
                        className={`h-10 w-10 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
                          opp.isSaved
                            ? "bg-red-50 border-red-300 text-red-600"
                            : "bg-white border-stone-200 text-stone-400 hover:text-stone-900 hover:border-stone-900"
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${opp.isSaved ? "fill-red-600" : ""}`} />
                      </button>

                      <button
                        onClick={() => handleOpenDiagnosis(opp)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-red-700 transition-all cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> AUDIT KELAYAKAN
                      </button>

                      <a
                        href={opp.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-5 py-2.5 font-mono text-xs font-bold text-stone-900 shadow-2xs hover:border-stone-900 transition-colors"
                      >
                        DAFTAR <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-stone-300 p-12 sm:p-16 text-center bg-white space-y-4">
              <Briefcase className="h-12 w-12 text-stone-400 mx-auto mb-2" />
              <h3 className="text-xl font-black text-stone-950">TIDAK ADA PELUANG DENGAN FILTER INI</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau buka semua jenjang pendidikan untuk melihat daftar peluang.
              </p>
              <button
                onClick={() => {
                  setTypeFilter("ALL");
                  setEduFilter("SEMUA");
                  setSearch("");
                }}
                className="rounded-full bg-stone-950 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-600 cursor-pointer"
              >
                RESET FILTER
              </button>
            </div>
          )}
        </section>
      </div>

      {/* 4. Talent Spec Audit Modal (Diagnosis) */}
      {diagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <h3 className="font-mono text-sm font-black uppercase tracking-wider text-stone-950">
                  AI TALENT SPEC AUDIT // {activeOpp?.organization}
                </h3>
              </div>
              <button
                onClick={() => setDiagModalOpen(false)}
                className="font-mono text-xs text-stone-400 hover:text-stone-900"
              >
                TUTUP [ESC]
              </button>
            </div>

            {diagLoading ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent mx-auto"></div>
                <p className="font-mono text-xs text-stone-500 font-bold uppercase tracking-wider">
                  Menganalisis prasyarat dengan portofolio & asesmenmu...
                </p>
              </div>
            ) : diagnosis ? (
              <div className="space-y-4">
                {/* Match HUD Box */}
                <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-4 border border-stone-200">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                      STATUS KELAYAKAN RADAR:
                    </span>
                    <span
                      className={`inline-block mt-1 font-mono text-xs font-black px-3 py-1 rounded-full border ${
                        diagnosis.status === "ELIGIBLE"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : diagnosis.status === "POTENTIAL_MATCH"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-red-100 text-red-800 border-red-200"
                      }`}
                    >
                      {diagnosis.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
                      SKOR FIT:
                    </span>
                    <span className="text-3xl font-black text-stone-950 font-mono">
                      {diagnosis.matchPercentage}%
                    </span>
                  </div>
                </div>

                {/* Fulfilled */}
                <div className="space-y-2">
                  <h4 className="font-mono text-[11px] font-black uppercase text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Prasyarat Terpenuhi:
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {diagnosis.fulfilledRequirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2 rounded-xl">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </li>
                    ))}
                    {diagnosis.fulfilledRequirements.length === 0 && (
                      <li className="text-stone-400 italic text-xs">Belum ada prasyarat yang terverifikasi di profilmu.</li>
                    )}
                  </ul>
                </div>

                {/* Unfulfilled */}
                <div className="space-y-2">
                  <h4 className="font-mono text-[11px] font-black uppercase text-amber-700 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> Gap Kebutuhan / Perlu Dilengkapi:
                  </h4>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {diagnosis.unfulfilledRequirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-2 rounded-xl">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                    {diagnosis.unfulfilledRequirements.length === 0 && (
                      <li className="text-emerald-700 font-bold text-xs">Semua prasyarat telah terpenuhi secara lengkap!</li>
                    )}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-2xl bg-stone-100 p-3.5 text-xs text-stone-700 border border-stone-200">
                  <span className="font-mono text-[10px] uppercase font-black text-stone-950 block mb-1">
                    REKOMENDASI AKSI DARI AI MENTOR:
                  </span>
                  <p className="leading-relaxed text-stone-700">{diagnosis.actionableRecommendations}</p>
                </div>
              </div>
            ) : null}

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setDiagModalOpen(false)}
                className="rounded-full border border-stone-200 bg-white px-5 py-2 font-mono text-xs font-bold text-stone-800 hover:border-stone-900 cursor-pointer"
              >
                TUTUP AUDIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

