"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  Activity,
  Layers,
  Zap,
  TrendingUp,
  Compass,
  Check,
  Flame,
  Award,
} from "lucide-react";

interface IdpActivity {
  id: string;
  planId: string;
  competencyId?: string | null;
  competencyName?: string | null;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  targetDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  successIndicators: string;
}

interface DevelopmentPlanDetail {
  id: string;
  userId: string;
  targetCareerId: string;
  targetCareerTitle: string;
  title: string;
  rationale: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  progressPercentage: number;
  targetEndDate: string;
  createdAt: string;
  activities: IdpActivity[];
}

export default function DevelopmentPlansPage() {
  const [idp, setIdp] = useState<DevelopmentPlanDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [updatingActId, setUpdatingActId] = useState<string | null>(null);

  // New manual activity state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [newDate, setNewDate] = useState("2026-12-31");
  const [newIndicator, setNewIndicator] = useState("");

  useEffect(() => {
    fetchIdp();
  }, []);

  async function fetchIdp() {
    try {
      const res = await fetch("/api/idp");
      if (res.ok) {
        const json = await res.json();
        setIdp(json.idp);
      }
    } catch (err) {
      console.error("Failed to load IDP:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(activityId: string, newStatus: IdpActivity["status"]) {
    setUpdatingActId(activityId);
    try {
      const res = await fetch(`/api/idp/activities/${activityId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await fetchIdp();
      }
    } catch (err) {
      console.error("Update activity error:", err);
    } finally {
      setUpdatingActId(null);
    }
  }

  async function handleGenerateAiDraft() {
    setAiDraftLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Bantu susun draft IDP terstruktur untuk target karier saya beserta 3 aktivitas konkret.",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        let draftObj;
        try {
          draftObj = JSON.parse(json.response);
        } catch {
          draftObj = {
            title: "Roadmap Pengembangan Mandiri (AI Assisted)",
            rationale: "Fokus menutup kesenjangan kompetensi teknis dan membangun portofolio proyek terverifikasi.",
            target_end_date: "2026-12-31",
            activities: [
              {
                title: "Kuasai Dasar Kompetensi Prasyarat",
                description: "Pelajari materi fundamental melalui kurikulum mandiri dan kursus online terakreditasi.",
                priority: "HIGH",
                target_weeks: 4,
                success_indicators: "Sertifikat penyelesaian kursus dan laporan ringkas",
              },
              {
                title: "Kembangkan Proyek Portofolio Terbuka",
                description: "Bangun proyek mandiri dan publikasikan di repositori publik dengan dokumentasi lengkap.",
                priority: "HIGH",
                target_weeks: 6,
                success_indicators: "Tautan repositori publik dengan README komprehensif",
              },
              {
                title: "Validasi Hasil Karya dengan Praktisi Mentor",
                description: "Jadwalkan sesi bimbingan bersama mentor industri untuk review kode dan umpan balik.",
                priority: "MEDIUM",
                target_weeks: 2,
                success_indicators: "Lembar validasi bukti kompetensi tingkat L3",
              },
            ],
          };
        }

        // Create new IDP with draft
        const createRes = await fetch("/api/idp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetCareerId: idp?.targetCareerId || "occ-ds-002",
            title: draftObj.title || "Roadmap AI Generated",
            rationale: draftObj.rationale || "Rencana terarah menutup skill gap.",
            targetEndDate: draftObj.target_end_date || "2026-12-31",
            activities: (draftObj.activities || []).map((a: Record<string, unknown>) => ({
              title: a.title,
              description: a.description,
              priority: a.priority || "HIGH",
              targetDate: "2026-12-31",
              successIndicators: a.success_indicators || "Bukti artefak portofolio",
            })),
          }),
        });

        if (createRes.ok) {
          await fetchIdp();
        }
      }
    } catch (err) {
      console.error("AI Draft error:", err);
    } finally {
      setAiDraftLoading(false);
    }
  }

  async function handleAddManualActivity() {
    if (!idp || !newTitle || !newDesc) return;
    try {
      const existingActs = idp.activities.map((a) => ({
        title: a.title,
        description: a.description,
        priority: a.priority,
        targetDate: a.targetDate,
        competencyId: a.competencyId,
        successIndicators: a.successIndicators,
      }));

      existingActs.push({
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        targetDate: newDate,
        competencyId: null,
        successIndicators: newIndicator || "Bukti hasil kerja selesai",
      });

      const res = await fetch("/api/idp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetCareerId: idp.targetCareerId,
          title: idp.title,
          rationale: idp.rationale,
          targetEndDate: idp.targetEndDate,
          activities: existingActs,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle("");
        setNewDesc("");
        setNewIndicator("");
        await fetchIdp();
      }
    } catch (err) {
      console.error("Add activity error:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold">
            Synchronizing IDP Telemetry...
          </span>
        </div>
      </div>
    );
  }

  const completedCount = idp?.activities.filter((a) => a.status === "COMPLETED").length || 0;
  const inProgressCount = idp?.activities.filter((a) => a.status === "IN_PROGRESS").length || 0;
  const totalCount = idp?.activities.length || 0;

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 selection:bg-red-600 selection:text-white pb-24 font-sans">
      {/* 1. Kinetic Top Marquee Ticker */}
      <div className="border-b border-stone-200 bg-white overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-[marquee_24s_linear_infinite] gap-10 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-600 items-center">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> SPRINT CADENCE 2026 // SEMESTER EXECUTION
          </span>
          <span className="text-stone-300">/</span>
          <span className="flex items-center gap-1 text-red-600">
            <Zap className="h-3.5 w-3.5" /> COMPETENCY DEFICIT TRACKER ACTIVE
          </span>
          <span className="text-stone-300">/</span>
          <span>AUTONOMOUS MILESTONE VALIDATION</span>
          <span className="text-stone-300">/</span>
          <span>DATA SCIENTIST & CLOUD ARCHITECT ACCELERATION</span>
          <span className="text-stone-300">/</span>
          <span className="flex items-center gap-1 text-stone-900">
            <CheckCircle2 className="h-3.5 w-3.5 text-red-600" /> L1-L3 VERIFIED EVIDENCE
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Asymmetrical Editorial Masthead */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Bold Kinetic Typography & Control HUD */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-stone-900 text-white px-2.5 py-1 rounded">
                  SPRINT // TRACK ID #2026
                </span>
                <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                  INDIVIDUAL DEVELOPMENT PLAN
                </span>
                <span className="font-mono text-[10px] font-bold text-stone-500 px-2">
                  VER: 2.4.0
                </span>
              </div>

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-stone-950 leading-[0.92]">
                  SPRINT YOUR <br />
                  <span className="text-red-600 underline decoration-red-200 underline-offset-8">FUTURE.</span>
                </h1>
                <p className="mt-5 text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                  Rencana akselerasi karier individual terukur. Hubungkan gap kompetensi hasil asesmen dengan target karya, portofolio nyata, dan sertifikasi industri.
                </p>
              </div>

              {idp && (
                <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-stone-500 border-b border-stone-100 pb-2">
                    <span className="flex items-center gap-1.5 font-bold text-stone-900">
                      <Target className="h-4 w-4 text-red-600" /> TARGET KARIR: {idp.targetCareerTitle}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> TENGGAT: {idp.targetEndDate}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-950">{idp.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{idp.rationale}</p>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-stone-200">
              <button
                onClick={() => handleGenerateAiDraft()}
                disabled={aiDraftLoading}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-xs font-black tracking-wide uppercase text-white shadow-sm hover:bg-red-700 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {aiDraftLoading ? "MENYUSUN DRAFT..." : "BANTU DRAFT DENGAN AI"}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-5 py-2.5 text-xs font-bold text-stone-900 shadow-2xs hover:border-stone-900 transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4 text-red-600" />
                TAMBAH AKTIVITAS
              </button>
              <Link
                href="/career-map"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors px-3 py-2"
              >
                Ganti Target <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Authentic Youth Student Imagery & Floating Telemetry */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl group">
              <img
                src="/students_collaborating_floor.jpg"
                alt="Young university students collaborating on development roadmap"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>

              {/* Floating Top Pill */}
              <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE SPRINT CYCLE
              </div>

              {/* Floating Bottom Telemetry Console */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-lg flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    ROADMAP PROGRESS
                  </span>
                  <div className="text-3xl font-black text-stone-950 flex items-baseline gap-1">
                    {idp?.progressPercentage || 0}%
                    <span className="text-xs font-bold text-emerald-600">
                      ({completedCount}/{totalCount} COMPLETED)
                    </span>
                  </div>
                </div>

                <div className="w-32 bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-700"
                    style={{ width: `${idp?.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Micro-stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 bg-white border border-stone-200/80 rounded-2xl">
                <span className="font-mono text-[10px] text-stone-500 block uppercase">IN PROGRESS</span>
                <span className="text-xl font-black text-stone-900">{inProgressCount}</span>
              </div>
              <div className="p-3 bg-white border border-stone-200/80 rounded-2xl">
                <span className="font-mono text-[10px] text-emerald-600 block uppercase">SELESAI</span>
                <span className="text-xl font-black text-emerald-600">{completedCount}</span>
              </div>
              <div className="p-3 bg-white border border-stone-200/80 rounded-2xl">
                <span className="font-mono text-[10px] text-stone-500 block uppercase">TOTAL TUGAS</span>
                <span className="text-xl font-black text-stone-900">{totalCount}</span>
              </div>
            </div>
          </div>
        </section>

        {idp ? (
          <>
            {/* 3. Interactive Metro Subway Roadmap Track (Breaking the grid!) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-red-600 rounded-full"></span>
                  <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                    SUBWAY TRACK // SEQUENTIAL MILESTONES
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-stone-500">
                  CHRONOLOGICAL EXECUTION PIPELINE
                </span>
              </div>

              <div className="bg-white border border-stone-200/90 rounded-3xl p-6 overflow-x-auto shadow-2xs">
                <div className="flex items-center min-w-[700px] justify-between relative py-4">
                  {/* Metro Central Rail Line */}
                  <div className="absolute top-1/2 left-8 right-8 h-1 bg-stone-200 -translate-y-1/2 z-0"></div>

                  {idp.activities.map((act, idx) => {
                    const isDone = act.status === "COMPLETED";
                    const isCurrent = act.status === "IN_PROGRESS";
                    return (
                      <div key={act.id} className="relative z-10 flex flex-col items-center group cursor-pointer max-w-[180px] text-center">
                        {/* Node circle */}
                        <div
                          className={`h-11 w-11 rounded-full flex items-center justify-center font-mono font-black text-xs transition-transform group-hover:scale-110 shadow-sm ${
                            isDone
                              ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                              : isCurrent
                              ? "bg-red-600 text-white ring-4 ring-red-100 animate-pulse"
                              : "bg-white text-stone-700 border-2 border-stone-300"
                          }`}
                        >
                          {isDone ? <Check className="h-5 w-5" /> : `0${idx + 1}`}
                        </div>

                        {/* Node Label */}
                        <div className="mt-3">
                          <span
                            className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : isCurrent
                                ? "bg-red-100 text-red-800"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {act.status.replace("_", " ")}
                          </span>
                          <p className="mt-1 text-xs font-bold text-stone-900 line-clamp-2 leading-tight">
                            {act.title}
                          </p>
                          <span className="font-mono text-[10px] text-stone-400 block mt-0.5">
                            {act.targetDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. Editorial Sprint Ticket Ledger (Tactile, Non-Card Layout) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-red-600" />
                  <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                    SPRINT TICKETS & ARTIFACT REQUISITIONS ({idp.activities.length})
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-stone-500">
                  REAL-TIME PROOF CHECKPOINTS
                </span>
              </div>

              <div className="space-y-3">
                {idp.activities.map((act, index) => {
                  const isCompleted = act.status === "COMPLETED";
                  const isInProgress = act.status === "IN_PROGRESS";
                  const isUpdating = updatingActId === act.id;

                  return (
                    <div
                      key={act.id}
                      className={`rounded-3xl border transition-all relative overflow-hidden bg-white shadow-2xs hover:shadow-md ${
                        isCompleted
                          ? "border-emerald-200 bg-emerald-50/15"
                          : isInProgress
                          ? "border-red-300/80 ring-1 ring-red-100"
                          : "border-stone-200/90"
                      }`}
                    >
                      {/* Left color bar stamp */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-2 ${
                          isCompleted ? "bg-emerald-500" : isInProgress ? "bg-red-600" : "bg-stone-300"
                        }`}
                      ></div>

                      <div className="p-5 sm:p-6 pl-6 sm:pl-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                        {/* Ticket metadata & title */}
                        <div className="space-y-2.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] font-black uppercase tracking-wider text-stone-400">
                              SPRINT // #{String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                                act.priority === "HIGH"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : act.priority === "MEDIUM"
                                  ? "bg-stone-100 text-stone-700"
                                  : "bg-stone-50 text-stone-600"
                              }`}
                            >
                              PRIORITY: {act.priority}
                            </span>
                            {act.competencyName && (
                              <span className="font-mono text-[10px] font-bold text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full">
                                {act.competencyName}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-stone-500 flex items-center gap-1 ml-auto sm:ml-0">
                              <Calendar className="h-3 w-3 text-stone-400" /> TENGGAT: {act.targetDate}
                            </span>
                          </div>

                          <h3
                            className={`text-lg font-black tracking-tight ${
                              isCompleted ? "line-through text-stone-400" : "text-stone-950"
                            }`}
                          >
                            {act.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
                            {act.description}
                          </p>

                          {/* Artifact Verification Stamp */}
                          <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-3 flex items-start gap-2.5 text-xs text-stone-700">
                            <FileText className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-mono text-[10px] font-black uppercase text-stone-500 block">
                                KRITERIA BUKTI KARYA / INDIKATOR SUKSES:
                              </span>
                              <span className="font-medium text-stone-900">{act.successIndicators}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Status Punch-Out Actions */}
                        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                          {isCompleted ? (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 font-mono text-xs font-black uppercase tracking-wider text-emerald-800">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                TUNTAS // L1 VERIFIED
                              </span>
                              <button
                                onClick={() => handleUpdateStatus(act.id, "IN_PROGRESS")}
                                disabled={isUpdating}
                                className="font-mono text-[11px] text-stone-500 hover:text-stone-900 underline underline-offset-4 cursor-pointer"
                              >
                                Koreksi
                              </button>
                            </div>
                          ) : isInProgress ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateStatus(act.id, "COMPLETED")}
                                disabled={isUpdating}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
                              >
                                <Check className="h-4 w-4" />
                                TANDAI TUNTAS
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(act.id, "NOT_STARTED")}
                                disabled={isUpdating}
                                className="rounded-full border border-stone-200 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                              >
                                Tunda
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(act.id, "IN_PROGRESS")}
                              disabled={isUpdating}
                              className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-red-600 transition-colors cursor-pointer"
                            >
                              EKSEKUSI SEKARANG <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          /* Empty State Editorial Blueprint */
          <div className="rounded-3xl border-2 border-dashed border-stone-300 p-12 sm:p-16 text-center bg-white space-y-4">
            <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Target className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-stone-950">
              BELUM ADA SPRINT IDP YANG TERJADWAL
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Pilih karier impianmu di Peta Karier, lalu generate blueprint rencana pengembangan otomatis bersama AI.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleGenerateAiDraft()}
                disabled={aiDraftLoading}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-white hover:bg-red-700 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                GENERATE SPRINT DENGAN AI
              </button>
              <Link
                href="/career-map"
                className="rounded-full border border-stone-300 bg-white px-6 py-3 font-mono text-xs font-black uppercase tracking-wider text-stone-900 hover:border-stone-900"
              >
                EKSPLOR PETA KARIER
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Manual Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <h3 className="font-mono text-sm font-black uppercase tracking-wider text-stone-950">
                  INPUT SPRINT ITEM // IDP
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="font-mono text-xs text-stone-400 hover:text-stone-900"
              >
                TUTUP [ESC]
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  JUDUL AKTIVITAS TARGET
                </label>
                <input
                  type="text"
                  placeholder="Misal: Menyelesaikan Proyek Full-Stack Analytics"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs focus:border-red-600 focus:outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  DESKRIPSI LANGKAH EKSEKUSI
                </label>
                <textarea
                  placeholder="Rincian modul pembelajaran, tools yang digunakan, repositori..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs focus:border-red-600 focus:outline-none bg-stone-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                    TINGKAT PRIORITAS
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as "HIGH" | "MEDIUM" | "LOW")}
                    className="w-full rounded-2xl border border-stone-200 p-3 text-xs focus:border-red-600 focus:outline-none bg-stone-50/50"
                  >
                    <option value="HIGH">HIGH (Mendesak)</option>
                    <option value="MEDIUM">MEDIUM (Standar)</option>
                    <option value="LOW">LOW (Elektif)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                    TARGET SELESAI
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-2xl border border-stone-200 p-3 text-xs focus:border-red-600 focus:outline-none bg-stone-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  INDIKATOR ARTEFAK / BUKTI NYATA
                </label>
                <input
                  type="text"
                  placeholder="Misal: Repositori GitHub terpublikasi atau sertifikat kursus resmi"
                  value={newIndicator}
                  onChange={(e) => setNewIndicator(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs focus:border-red-600 focus:outline-none bg-stone-50/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full border border-stone-200 px-4 py-2 font-mono text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={handleAddManualActivity}
                className="rounded-full bg-red-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                SIMPAN SPRINT ITEM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

