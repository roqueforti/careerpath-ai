"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  Plus,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  MessageSquare,
  Send,
  X,
  Briefcase,
  ArrowRight,
  Zap,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  role?: string | null;
  projectUrl?: string | null;
  toolsUsed: string[];
  isPublic: boolean;
  createdAt: string;
  evidence: Array<{
    id: string;
    title: string;
    fileUrl: string;
    validationStatus: string;
    reviewFeedback?: string | null;
  }>;
}

interface SkillPassport {
  claimedCompetencies: Array<{ id: string; name: string; code: string; category: string }>;
  evidenceBackedCompetencies: Array<{ id: string; name: string; code: string; category: string; evidenceTitle: string }>;
  mentorValidatedCompetencies: Array<{ id: string; name: string; code: string; category: string; validatedAt: string; mentorName?: string }>;
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<{ title: string; summary: string; items: PortfolioItem[] } | null>(null);
  const [passport, setPassport] = useState<SkillPassport | null>(null);
  const [loading, setLoading] = useState(true);

  // New item modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("PROJECT");
  const [newDesc, setNewDesc] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newTools, setNewTools] = useState("");
  const [newEvidenceTitle, setNewEvidenceTitle] = useState("");

  // AI Interview Simulator State
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewFeedback, setInterviewFeedback] = useState<string | null>(null);
  const [interviewLoading, setInterviewLoading] = useState(false);

  // AI Portfolio Review State
  const [aiReviewResult, setAiReviewResult] = useState<string | null>(null);
  const [aiReviewLoading, setAiReviewLoading] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  async function loadPortfolioData() {
    setLoading(true);
    try {
      const [portRes, passRes] = await Promise.all([
        fetch("/api/portfolio"),
        fetch("/api/portfolio/skill-passport"),
      ]);

      if (portRes.ok) {
        const portJson = await portRes.json();
        setPortfolio(portJson.portfolio);
      }
      if (passRes.ok) {
        const passJson = await passRes.json();
        setPassport(passJson.passport);
      }
    } catch (err) {
      console.error("Failed to load portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateItem() {
    if (!newTitle || !newDesc) return;
    try {
      const res = await fetch("/api/portfolio/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          role: newRole,
          projectUrl: newUrl,
          toolsUsed: newTools,
          evidenceTitle: newEvidenceTitle || newTitle,
          evidenceUrl: newUrl || "https://github.com",
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle("");
        setNewDesc("");
        setNewRole("");
        setNewUrl("");
        setNewTools("");
        await loadPortfolioData();
      }
    } catch (err) {
      console.error("Error creating item:", err);
    }
  }

  async function handleAiReviewPortfolio() {
    setAiReviewLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Berikan review profesional dan objektif terhadap deskripsi proyek portofolio saya: '${
            portfolio?.items[0]?.title || "Proyek Analisis Data"
          }' - ${portfolio?.items[0]?.description || "Analisis data pelanggan"}.`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setAiReviewResult(json.response);
      }
    } catch (err) {
      console.error("Error AI Review:", err);
    } finally {
      setAiReviewLoading(false);
    }
  }

  async function handleInterviewSubmit() {
    if (!interviewAnswer.trim()) return;
    setInterviewLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Evaluasi jawaban wawancara teks saya untuk profesi target. Jawaban: "${interviewAnswer}"`,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setInterviewFeedback(json.response);
      }
    } catch (err) {
      console.error("Error interview simulation:", err);
    } finally {
      setInterviewLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center font-sans">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-4" />
        <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Sinkronisasi Bukti Karya & Paspor Kompetensi...
        </p>
      </div>
    );
  }

  const totalCompetencies =
    (passport?.claimedCompetencies.length || 0) +
    (passport?.evidenceBackedCompetencies.length || 0) +
    (passport?.mentorValidatedCompetencies.length || 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans pb-24 selection:bg-red-600 selection:text-white">
      {/* 1. Kinetic Marquee Ticker */}
      <div className="w-full bg-stone-950 text-white overflow-hidden py-2 border-b border-stone-850">
        <div className="flex items-center gap-8 whitespace-nowrap text-[11px] font-mono tracking-wider animate-pulse">
          <span>✦ PROOF OF WORK</span>
          <span>PASSPORT ID: CP-PASS-2026-ID</span>
          <span>TOTAL CREDENTIALS: {totalCompetencies}</span>
          <span>MENTOR VALIDATED: {passport?.mentorValidatedCompetencies.length || 0}</span>
          <span>VERIFIED ARTIFACTS: {portfolio?.items.length || 0} EXHIBITS</span>
          <span>✦ PROOF OVER PROMISES</span>
          <span>✦ PROOF OF WORK</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* 2. Editorial Split Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Title & Actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 dark:text-red-300 px-2.5 py-1 rounded-full border border-red-200/60 dark:border-red-900/50">
                  MODUL PROVE // VERIFIED CREDENTIALS
                </span>
                <span className="text-[11px] font-mono text-stone-400">·</span>
                <span className="text-xs font-semibold text-stone-500">
                  Skill Passport & Proof Gallery
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-950 dark:text-white leading-[0.98]">
                PROVE YOUR <br />
                <span className="text-red-600">CRAFT.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                Kredensial karier generasi baru yang transparan. Validasi bukti karya riil, repositori terbuka, dan pengesahan kuratorial dari mentor BK dan praktisi industri.
              </p>
            </div>

            {/* Gen Z Action Cluster */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Upload Bukti Karya</span>
              </button>
              <button
                onClick={handleAiReviewPortfolio}
                disabled={aiReviewLoading}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-5 py-2.5 text-xs font-bold text-stone-850 hover:border-stone-900 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-red-600" />
                <span>{aiReviewLoading ? "Menganalisis AI..." : "AI Review Portofolio"}</span>
              </button>
              <button
                onClick={() => setShowInterviewModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white px-5 py-2.5 text-xs font-bold text-stone-850 hover:border-stone-900 shadow-2xs dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 transition-all cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-stone-500" />
                <span>Simulasi Wawancara AI</span>
              </button>
            </div>
          </div>

          {/* Right Official Passbook Credo Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-[32px] border border-stone-200/90 bg-stone-950 text-white p-6 sm:p-7 shadow-xl h-full flex flex-col justify-between space-y-6 relative overflow-hidden">
              {/* Background watermark badge */}
              <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                <Award className="h-48 w-48 text-white" />
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <span className="font-mono text-xs font-bold tracking-widest text-stone-300">
                      OFFICIAL SKILL PASSPORT
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-red-500 font-bold">
                    VERIFIED // 2026
                  </span>
                </div>

                <div className="mt-5 space-y-1">
                  <p className="text-[11px] font-mono text-stone-400">PASSPORT HOLDER</p>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {portfolio?.title || "CareerPath Candidate"}
                  </p>
                  <p className="text-xs text-stone-400 leading-relaxed pt-1">
                    {portfolio?.summary || "Rekam jejak kompetensi terverifikasi untuk rekruter & perguruan tinggi."}
                  </p>
                </div>
              </div>

              {/* 3 Metrics Counter inside the Passbook */}
              <div className="grid grid-cols-3 gap-3 border-t border-stone-800 pt-5">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
                    TIER 1 (KLAIM)
                  </span>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {passport?.claimedCompetencies.length || 0}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">
                    TIER 2 (BUKTI)
                  </span>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {passport?.evidenceBackedCompetencies.length || 0}
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-red-400">
                    TIER 3 (MENTOR)
                  </span>
                  <p className="text-2xl font-black text-red-500 mt-0.5">
                    {passport?.mentorValidatedCompetencies.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Review Result Banner (If active) */}
        {aiReviewResult && (
          <div className="rounded-[28px] border border-red-200/90 bg-red-50/70 p-6 sm:p-7 dark:border-red-900/50 dark:bg-red-950/40 animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-bold text-red-950 dark:text-red-200">
                <Sparkles className="h-4 w-4 text-red-600" />
                Hasil Evaluasi AI Mentor Terhadap Kualitas Artefak Portofolio
              </span>
              <button
                onClick={() => setAiReviewResult(null)}
                className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-red-900 dark:text-red-200 leading-relaxed whitespace-pre-line">
              {aiReviewResult}
            </div>
          </div>
        )}

        {/* 3. Three-Tier Skill Progression Ladder (Breaking the box!) */}
        <div className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                MULTI-TIER VALIDATION LADDER
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-white mt-1">
                Paspor Kompetensi Berjenjang
              </h2>
            </div>
            <span className="font-mono text-xs font-bold text-stone-500">
              TOTAL: {totalCompetencies} KOMPETENSI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Tier 1: Klaim */}
            <div className="rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-500">
                    TIER 01 // KLAIM
                  </span>
                  <span className="rounded-full bg-stone-200 text-stone-800 dark:bg-stone-700 dark:text-stone-200 px-2 py-0.5 text-xs font-black">
                    {passport?.claimedCompetencies.length || 0}
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-900 dark:text-white mt-2">
                  Deklarasi Mandiri
                </p>
                <p className="text-[11px] text-stone-500 mb-3">
                  Kompetensi yang dinyatakan pengguna tanpa artefak dokumen.
                </p>

                <div className="space-y-1.5">
                  {passport?.claimedCompetencies.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-white dark:bg-stone-900 p-2.5 border border-stone-200/80 dark:border-stone-800 text-xs shadow-2xs"
                    >
                      <p className="font-bold text-stone-950 dark:text-white">{c.name}</p>
                      <p className="text-[10px] text-stone-400">{c.category}</p>
                    </div>
                  ))}
                  {(!passport?.claimedCompetencies || passport.claimedCompetencies.length === 0) && (
                    <p className="text-xs text-stone-400 italic py-2">Tidak ada klaim tanpa bukti.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tier 2: Bukti Karya */}
            <div className="rounded-2xl bg-stone-50/80 dark:bg-stone-850 p-5 border border-stone-200/80 dark:border-stone-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-800 dark:text-stone-200">
                    TIER 02 // BUKTI KARYA
                  </span>
                  <span className="rounded-full bg-stone-950 text-white dark:bg-white dark:text-stone-950 px-2 py-0.5 text-xs font-black">
                    {passport?.evidenceBackedCompetencies.length || 0}
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-900 dark:text-white mt-2">
                  Artefak Nyata Terlampir
                </p>
                <p className="text-[11px] text-stone-500 mb-3">
                  Memiliki repositori proyek, tautan live, atau sertifikat.
                </p>

                <div className="space-y-1.5">
                  {passport?.evidenceBackedCompetencies.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-white dark:bg-stone-900 p-2.5 border border-stone-200/80 dark:border-stone-800 text-xs shadow-2xs"
                    >
                      <p className="font-bold text-stone-950 dark:text-white">{c.name}</p>
                      <p className="text-[10px] text-red-600 font-medium">Bukti: {c.evidenceTitle}</p>
                    </div>
                  ))}
                  {(!passport?.evidenceBackedCompetencies || passport.evidenceBackedCompetencies.length === 0) && (
                    <p className="text-xs text-stone-400 italic py-2">Belum ada karya terlampir.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tier 3: Validasi Mentor */}
            <div className="rounded-2xl bg-red-50/40 dark:bg-red-950/20 p-5 border border-red-200/80 dark:border-red-900/50 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-red-600 dark:text-red-300">
                    TIER 03 // MENTOR VALIDATED
                  </span>
                  <span className="rounded-full bg-red-600 text-white px-2 py-0.5 text-xs font-black">
                    {passport?.mentorValidatedCompetencies.length || 0}
                  </span>
                </div>
                <p className="text-xs font-bold text-stone-950 dark:text-white mt-2">
                  Disahkan Pendidik / Mentor
                </p>
                <p className="text-[11px] text-stone-500 mb-3">
                  Diverifikasi dan dinilai langsung oleh mentor BK / dosen pembimbing.
                </p>

                <div className="space-y-1.5">
                  {passport?.mentorValidatedCompetencies.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl bg-white dark:bg-stone-900 p-2.5 border border-stone-200/80 dark:border-stone-800 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-stone-950 dark:text-white">{c.name}</p>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-[10px] text-stone-400">
                        Mentor: <span className="text-stone-800 dark:text-stone-200 font-semibold">{c.mentorName || "Sarah Wulandari, M.Psi."}</span>
                      </p>
                    </div>
                  ))}
                  {(!passport?.mentorValidatedCompetencies || passport.mentorValidatedCompetencies.length === 0) && (
                    <p className="text-xs text-stone-400 italic py-2">Belum ada validasi mentor.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Exhibition Project Gallery (Editorial Magazine Spread) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/90 pb-5 dark:border-stone-800">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
                CURATED EXHIBITION // PROOF GALLERY
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-white mt-1">
                Galeri Karya & Artefak Portofolio ({portfolio?.items.length || 0})
              </h2>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-full bg-stone-950 hover:bg-black text-white px-4 py-2 text-xs font-bold self-start transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Bukti Baru
            </button>
          </div>

          {portfolio?.items && portfolio.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs hover:border-stone-900 transition-all dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-3.5">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600 transition-colors">
                        EXHIBIT // {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-0.5 text-[11px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-stone-950 dark:text-white leading-tight">
                      {item.title}
                    </h3>

                    {item.role && (
                      <p className="text-xs font-semibold text-red-600">
                        Peran: {item.role}
                      </p>
                    )}

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tech Stack Pills */}
                    {item.toolsUsed.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.toolsUsed.map((tool) => (
                          <span
                            key={tool}
                            className="font-mono text-[10px] font-semibold text-stone-600 bg-stone-100 dark:bg-stone-800 dark:text-stone-300 px-2 py-0.5 rounded-full"
                          >
                            #{tool}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Evidence & Mentor Feedback Callout */}
                    {item.evidence.length > 0 && (
                      <div className="rounded-2xl border border-stone-100 bg-stone-50/80 p-3.5 text-xs dark:border-stone-800 dark:bg-stone-850 space-y-2">
                        {item.evidence.map((ev) => (
                          <div key={ev.id}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 dark:text-stone-200">{ev.title}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                  ev.validationStatus === "VALIDATED"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                    : "border-stone-300 bg-stone-100 text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
                                }`}
                              >
                                {ev.validationStatus}
                              </span>
                            </div>
                            {ev.reviewFeedback && (
                              <p className="text-[11px] text-stone-500 italic mt-1 leading-relaxed">
                                Catatan Mentor: &ldquo;{ev.reviewFeedback}&rdquo;
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project URL Link */}
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    {item.projectUrl ? (
                      <a
                        href={item.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                      >
                        Buka Repositori / Tautan Karya <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-stone-400 font-mono">Dokumentasi Terlampir</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-stone-200 dark:border-stone-800 p-12 text-center space-y-3">
              <FileCheck className="h-10 w-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-900 dark:text-stone-200">
                Belum ada karya atau artefak portofolio
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Unggah proyek kelas, repositori GitHub, atau sertifikat untuk memulai validasi paspor kompetensimu.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Unggah Karya Pertamamu
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Tambah Bukti Karya */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-lg rounded-[28px] border border-stone-200 bg-white p-7 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <h3 className="text-base font-black text-stone-950 dark:text-white">
                Dokumentasi Bukti Karya Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Judul Karya / Proyek</label>
                <input
                  type="text"
                  placeholder="Contoh: Aplikasi Analisis Prediksi Sentimen Media Sosial"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white cursor-pointer"
                  >
                    <option value="PROJECT">Proyek Mandiri / Tim</option>
                    <option value="CERTIFICATION">Sertifikasi & Lisensi</option>
                    <option value="INTERNSHIP">Pengalaman Magang</option>
                    <option value="COMPETITION">Lomba / Kompetisi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Peran dalam Karya</label>
                  <input
                    type="text"
                    placeholder="Contoh: Lead Frontend Developer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Deskripsi & Dampak Karya</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan masalah yang dipecahkan, metodologi, dan hasil yang diperoleh..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 bg-stone-50/80 p-3 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Tools / Teknologi (Pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="Contoh: React, TypeScript, Python, Figma"
                  value={newTools}
                  onChange={(e) => setNewTools(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-900 dark:text-stone-200 mb-1">Tautan GitHub / Dokumen Karya</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50/80 px-4 py-2.5 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-full border border-stone-200 px-5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateItem}
                className="rounded-full bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs cursor-pointer"
              >
                Simpan ke Passport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Simulasi Wawancara AI */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-lg rounded-[28px] border border-stone-200 bg-white p-7 shadow-2xl dark:border-stone-800 dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-600" />
                <h3 className="text-base font-black text-stone-950 dark:text-white">
                  Simulasi Pertanyaan Wawancara AI
                </h3>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="text-stone-400 hover:text-stone-950 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs dark:bg-stone-800 dark:border-stone-700">
              <p className="font-bold text-stone-900 dark:text-white mb-1">Pertanyaan Simulasi:</p>
              <p className="text-stone-600 dark:text-stone-300 italic">
                &ldquo;Ceritakan salah satu tantangan teknis terbesar yang Anda hadapi saat mengerjakan proyek portofolio Anda, dan bagaimana Anda mengatasinya?&rdquo;
              </p>
            </div>

            <textarea
              rows={4}
              placeholder="Tuliskan jawaban Anda secara lugas dan terstruktur..."
              value={interviewAnswer}
              onChange={(e) => setInterviewAnswer(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/80 p-3 text-xs text-stone-900 focus:border-red-600 focus:bg-white focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
            />

            {interviewFeedback && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200 leading-relaxed whitespace-pre-line">
                <p className="font-bold mb-1">Evaluasi AI Mentor:</p>
                {interviewFeedback}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="rounded-full border border-stone-200 px-5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300 cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleInterviewSubmit}
                disabled={interviewLoading || !interviewAnswer.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {interviewLoading ? "Mengevaluasi..." : "Kirim Jawaban"}
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
