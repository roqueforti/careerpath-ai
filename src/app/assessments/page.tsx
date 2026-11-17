"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Clock, ArrowRight, BookOpen, Sparkles, CheckCircle2, Zap } from "lucide-react";

interface AssessmentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  assessmentType: string;
  instruction: string;
  minEducationLevel: string;
  questionCount: number;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/assessments");
        if (res.ok) {
          const data = await res.json();
          setAssessments(data.assessments || []);
        }
      } catch (err) {
        console.error("Failed to load assessments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const riasecDimensions = [
    { code: "R", name: "Realistic", label: "Praktis & Fisik", color: "bg-stone-900 text-white" },
    { code: "I", name: "Investigative", label: "Analitis & Riset", color: "bg-blue-600 text-white" },
    { code: "A", name: "Artistic", label: "Kreatif & Ekspresif", color: "bg-purple-600 text-white" },
    { code: "S", name: "Social", label: "Edukasi & Relasi", color: "bg-emerald-600 text-white" },
    { code: "E", name: "Enterprising", label: "Kepemimpinan & Bisnis", color: "bg-red-600 text-white" },
    { code: "C", name: "Conventional", label: "Struktur & Data", color: "bg-stone-700 text-white" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#18181b] dark:text-[#fafafa] font-sans pb-24 selection:bg-red-600 selection:text-white">
      {/* 1. Kinetic Marquee Ticker */}
      <div className="w-full bg-stone-950 text-white overflow-hidden py-2 border-b border-stone-850">
        <div className="flex items-center gap-8 whitespace-nowrap text-[11px] font-mono tracking-wider animate-pulse">
          <span>✦ PSYCHOMETRIC ENGINE</span>
          <span>HOLLAND CODE RIASEC</span>
          <span>DETERMINISTIC EVALUATION</span>
          <span>6 DIMENSIONS</span>
          <span>TOTAL ASSESSMENTS: {assessments.length}</span>
          <span>✦ DECODE YOUR CAREER DNA</span>
          <span>✦ PSYCHOMETRIC ENGINE</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12">
        {/* 2. Editorial Split Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Title & RIASEC Breakdown (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950/60 dark:text-red-300 px-2.5 py-1 rounded-full border border-red-200/60 dark:border-red-900/50">
                  MODUL ASSESS // HOLLAND CODE RIASEC
                </span>
                <span className="text-[11px] font-mono text-stone-400">·</span>
                <span className="text-xs font-semibold text-stone-500">
                  Psychometric Profiling Engine
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-950 dark:text-white leading-[0.98]">
                DECODE YOUR <br />
                <span className="text-red-600">CAREER DNA.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-xl leading-relaxed">
                Asesmen minat terstandar dengan algoritma pemetaan psikometrik deterministik. Hasil asesmen menjadi fondasi rekomendasi profesi pada modul Peta Karier (MAP) dan rencana aksi semester (IDP).
              </p>
            </div>

            {/* 6 RIASEC Dimension Badge Clusters */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
                6 DIMENSI RIASEC HOLLAND CODE
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {riasecDimensions.map((dim) => (
                  <div
                    key={dim.code}
                    className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-2.5 shadow-2xs"
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-black ${dim.color}`}
                    >
                      {dim.code}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-950 dark:text-white truncate">
                        {dim.name}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">{dim.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Featured Banner Exhibit (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="rounded-[32px] border border-stone-200/90 bg-white p-3 shadow-xs dark:border-stone-800 dark:bg-stone-900 h-full flex flex-col">
              <div className="relative flex-1 min-h-[380px] lg:min-h-[440px] rounded-[24px] overflow-hidden border border-stone-100 dark:border-stone-800">
                <img
                  src="/hero_editorial_overhead.jpg"
                  alt="Young College Students Exploring Assessments and Career Roadmaps"
                  className="w-full h-full object-cover object-center"
                />

                <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-white/95 text-stone-900 backdrop-blur-md px-3.5 py-1 text-xs font-semibold shadow-xs border border-stone-200/80 dark:bg-stone-900/95 dark:text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  <span>Deterministic Engine</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-stone-100 dark:border-stone-700 shadow-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-400">
                      STANDAR PSIKOMETRIK
                    </span>
                    <span className="font-mono text-xs font-bold text-red-600">60 PERTANYAAN</span>
                  </div>
                  <p className="text-xs font-bold text-stone-950 dark:text-white">
                    Objektif & Tanpa Manipulasi AI
                  </p>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Setiap opsi bernilai tetap sesuai metodologi psikologi kejuruan Dr. John Holland, memastikan hasilmu valid dan dapat dipertanggungjawabkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Assessment Launch Pad (Breaking the box!) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200/90 pb-4 dark:border-stone-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600">
              AVAILABLE ASSESSMENT INSTRUMENTS ({assessments.length} INSTRUMENTS)
            </span>
            <span className="text-xs font-mono text-stone-400">FREE & DIRECT ACCESS</span>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Memuat Instrumen Asesmen...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assessments.map((a, idx) => (
                <div
                  key={a.id}
                  className="rounded-[32px] border border-stone-200/90 bg-white p-7 sm:p-9 shadow-xs hover:border-stone-950 transition-all dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between space-y-6 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-stone-400 group-hover:text-red-600 transition-colors">
                        INSTRUMENT // {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="rounded-full bg-stone-100 dark:bg-stone-800 px-3 py-0.5 text-[11px] font-bold text-stone-800 dark:text-stone-200">
                        {a.assessmentType}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black tracking-tight text-stone-950 dark:text-white leading-tight">
                      {a.title}
                    </h2>

                    <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                      {a.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500 pt-1">
                      <span className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-200 font-sans">
                        <BookOpen className="h-4 w-4 text-red-600" />
                        {a.questionCount} Butir Pertanyaan
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5 font-bold text-stone-700 dark:text-stone-300 font-sans">
                        <Clock className="h-4 w-4 text-stone-400" />
                        ~10 Menit
                      </span>
                      <span>·</span>
                      <span className="text-[11px] text-stone-400 font-sans">
                        Min: {a.minEducationLevel}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
                    <Link
                      href={`/assessments/${a.slug}`}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-red-600 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Mulai Kerjakan Asesmen Sekarang</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
