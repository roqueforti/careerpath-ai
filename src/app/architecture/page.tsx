"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  Cpu,
  Target,
  GraduationCap,
  FileCheck,
  Briefcase,
  ShieldCheck,
  Award,
  CheckCircle2,
  TrendingUp,
  Building2,
  Sliders,
  Code2,
  Workflow,
  Search,
  BookOpen,
  Printer,
  ChevronRight,
  ExternalLink,
  Lock,
  BarChart3,
  Check,
  Globe,
} from "lucide-react";
import {
  CuteStudentAvatar,
  CuteMentorAvatar,
  CuteBotMascot,
  IconCoolRocket,
  IconCoolCompass,
  IconCoolShip,
  IconCoolPassport,
  IconCoolTarget,
  IconCoolAI,
} from "@/components/CustomIcons";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function ArchitecturePage() {
  const { language, setLanguage, t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: t("Input & Profiling", "Input & Profiling"),
      icon: CuteStudentAvatar,
      desc: t("Asesmen Minat, Holland & Modal Awal", "Interest, Holland RIASEC & Prior Skills"),
    },
    {
      num: 2,
      title: t("Sumber Data Master", "Master Data Sources"),
      icon: Database,
      desc: t("Taksonomi O*NET, KBJI, KBLI & SKKNI", "O*NET, KBJI, KBLI & SKKNI Taxonomies"),
    },
    {
      num: 3,
      title: t("Algoritma Pencocokan", "Matching Algorithm"),
      icon: Cpu,
      desc: t("Multi-Criteria Matching & Skill Gap", "Multi-Criteria Fit & Mathematical Skill Gap"),
    },
    {
      num: 4,
      title: t("Reasoning AI Gemini", "Gemini AI Reasoning"),
      icon: IconCoolAI,
      desc: t("Sintesis Rekomendasi & Explainability", "Recommendation Synthesis & Explainability"),
    },
    {
      num: 5,
      title: t("5 Pilar Grand Design", "5 Grand Design Pillars"),
      icon: Workflow,
      desc: t("Assess, Map, Develop, Prove, Match", "Assess, Map, Develop, Prove, Match"),
    },
    {
      num: 6,
      title: t("Evaluasi Confusion Matrix", "Confusion Matrix Evaluation"),
      icon: BarChart3,
      desc: t("Metrik Akurasi, F1-Score & Penelitian", "Accuracy, Precision, Recall & F1-Score"),
    },
    {
      num: 7,
      title: t("Tata Kelola & Keamanan", "Governance & Security"),
      icon: ShieldCheck,
      desc: t("Audit Log & Human-in-the-Loop", "Immutable Audit Logs & Human-in-the-Loop"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-zinc-900 font-sans pb-32">
      {/* ========================================================= */}
      {/* 1. PRESENTATION HERO MASTHEAD                             */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-white via-red-50/20 to-[#f8fafc] border-b border-zinc-200/90 pt-10 pb-12">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {t(
                    "Dokumen Presentasi Arsitektur Sistem & Metodologi AI",
                    "System Architecture & AI Methodology Presentation Document"
                  )}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-950 leading-tight">
                {language === "en" ? (
                  <>
                    How <span className="text-red-600">CareerPath AI</span> Maps Vocational Careers End-to-End
                  </>
                ) : (
                  <>
                    Bagaimana <span className="text-red-600">CareerPath AI</span> Memetakan Karier dari Hulu ke Hilir
                  </>
                )}
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-medium">
                {t(
                  "Alur pemrosesan menyeluruh berbasis data baku O*NET v31.0, KBJI 2026, kurikulum SKKNI, algoritma kalkulasi Skill Gap, hingga orkestrasi Reasoning AI untuk integrasi industri nasional dan global.",
                  "Comprehensive processing pipeline grounded in official O*NET v31.0, KBJI 2026, SKKNI national curricula, mathematical Skill Gap formulation, and Gemini AI Reasoning orchestrated for multi-sectoral national and global industry integration."
                )}
              </p>
            </div>

            {/* Presenter Card & Language Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-4 rounded-3xl bg-white border border-zinc-200 shadow-sm flex items-center gap-4 shrink-0">
                <CuteStudentAvatar className="w-14 h-14" showBadge={true} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
                    {t("Presenter & Peneliti", "Presenter & Lead Researcher")}
                  </div>
                  <div className="font-extrabold text-sm text-zinc-950">
                    Hilman Zahrawa Budiarto
                  </div>
                  <div className="text-xs text-zinc-500">
                    D4 Sistem Informasi Bisnis (Polinema)
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{t("Kemitraan: Pendidikan Tinggi Vokasi & Industri", "Partnership: Higher Vocational Education & Industry")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Jump Timeline Navigation & Controls */}
          <div className="pt-6 border-t border-zinc-200/80">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
              {steps.map((s) => (
                <a
                  key={s.num}
                  href={`#step-${s.num}`}
                  onClick={() => setActiveStep(s.num)}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                    activeStep === s.num
                      ? "bg-red-600 text-white shadow-xs font-black"
                      : "bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    0{s.num}
                  </span>
                  <span>{s.title}</span>
                </a>
              ))}

              <div className="flex items-center gap-2 ml-auto shrink-0">
                {/* Language Switch Pill in Presentation Masthead */}
                <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 border border-zinc-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setLanguage("id")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      language === "id"
                        ? "bg-white text-red-600 shadow-xs font-black"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <span>🇮🇩</span>
                    <span>Indonesia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      language === "en"
                        ? "bg-white text-red-600 shadow-xs font-black"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{t("Cetak PDF", "Print PDF")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PROGRESSIVE SCROLL-DOWN ARCHITECTURE WALKTHROUGH        */}
      {/* ========================================================= */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* --------------------------------------------------------- */}
        {/* STEP 01: INGESTION DATA & PROFILING                       */}
        {/* --------------------------------------------------------- */}
        <section id="step-1" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              01
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Pertama // Input & Ingestion", "Phase 1 // Input & Ingestion")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Input Data Profil, Minat, dan Psikometri Holland RIASEC",
                  "User Profiling, Vocational Interests & Holland RIASEC Psychometrics"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Sistem tidak memulai dari asumsi kosong, melainkan mengumpulkan parameter multi-dimensi peserta didik berdasarkan kerangka kematangan karier vokasi.",
                  "The engine avoids arbitrary cold starts by ingesting multi-dimensional student parameters anchored in recognized vocational maturity benchmarks."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
                <Target className="h-5 w-5" />
                <span>{t("1. Jenjang & Kematangan (L1 - L4)", "1. Maturity Level Framework (L1 - L4)")}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t("Mengidentifikasi tahap perkembangan peserta:", "Categorizes candidate maturity into targeted developmental stages:")}
              </p>
              <ul className="text-xs text-zinc-700 space-y-1.5 pl-2 border-l-2 border-red-500">
                <li>
                  <strong>L1: EXPLORE (SMP/MTs)</strong> – {t("Eksplorasi minat dasar.", "Foundational interest exploration.")}
                </li>
                <li>
                  <strong>L2: PLAN (SMA/SMK/MA)</strong> – {t("Pemilihan peminatan studi & vokasi.", "High school / vocational major planning.")}
                </li>
                <li>
                  <strong>L3: DEVELOP (Mahasiswa Awal)</strong> – {t("Portofolio, magang awal & proyek.", "Early collegiate project & portfolio building.")}
                </li>
                <li>
                  <strong>L4: READY (Mahasiswa Akhir)</strong> – {t("Kesiapan seleksi rekrutmen industri (Trainee & Associate).", "Final-year industry recruitment readiness (Trainee & Associate).")}
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
                <Sparkles className="h-5 w-5" />
                <span>{t("2. Vektor Holland RIASEC (6 Dimensi)", "2. Holland RIASEC Hexagonal Vector (6D)")}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Asesmen minat vokasional terstandar John Holland dengan scoring 1-100:",
                  "Standardized vocational personality profiling scored along 6 vectors (1-100):"
                )}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-zinc-700">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(R)</strong> Realistic
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(I)</strong> Investigative
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(A)</strong> Artistic
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(S)</strong> Social
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(E)</strong> Enterprising
                </div>
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                  <strong>(C)</strong> Conventional
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
                <Code2 className="h-5 w-5" />
                <span>{t("3. Modal Keahlian & Portofolio Awal", "3. Prior Technical Competencies & Evidence")}</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Inventarisasi keahlian teknis nyata yang telah dibuktikan melalui karya nyata:",
                  "Cataloging candidate verified proficiencies and artifact evidence:"
                )}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">Next.js & React</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">TypeScript</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">Laravel & PHP</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">PostgreSQL</span>
                <span className="px-2 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-bold">Docker</span>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                {t(
                  "Disertai bukti link repositori GitHub & sertifikat kompetensi.",
                  "Backed by live GitHub repositories and accredited BNSP competency credentials."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 02: SUMBER DATA MASTER RESMI                         */}
        {/* --------------------------------------------------------- */}
        <section id="step-2" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              02
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Kedua // Knowledge Base", "Phase 2 // Knowledge Base")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Basis Data Taksonomi Baku: O*NET, KBJI, KBLI & SKKNI",
                  "Standardized Taxonomy Knowledge Base: O*NET, KBJI, KBLI & SKKNI"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Sistem tidak menggunakan label karier acak, melainkan mereferensikan standar ketenagakerjaan resmi internasional dan nasional di PostgreSQL.",
                  "The platform rejects unverified job labels, anchoring each occupation to rigorous international and Indonesian statutory labor codes in PostgreSQL."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Global Standard
                </span>
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-black text-zinc-950 text-base">O*NET v31.0 Database</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Diterbitkan oleh U.S. Department of Labor (USDOL/ETA). Memuat 1.016+ okupasi terstandar, skor empiris Holland RIASEC, dan 35 keahlian generik.",
                  "Published by the U.S. Department of Labor. Features 1,016+ standardized occupations, empirical RIASEC vectors, and 35 generic skills."
                )}
              </p>
              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                SOC 15-1252.00 (Software Developers)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  {t("Nasional RI", "National Standard")}
                </span>
                <Building2 className="h-4 w-4 text-red-600" />
              </div>
              <h3 className="font-black text-zinc-950 text-base">KBJI 2026 & 2014</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Klasifikasi Baku Jabatan Indonesia (BPS & Kemenaker RI, turunan ILO ISCO-08). Memastikan legalitas profesi di sistem nasional.",
                  "Indonesian Standard Classification of Occupations (BPS & MoM, ILO ISCO-08 compliant), ensuring statutory recognition in Indonesia."
                )}
              </p>
              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                KBJI 2512 (Pengembang Perangkat Lunak)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("Standar Kompetensi", "Competency Units")}
                </span>
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <h3 className="font-black text-zinc-950 text-base">SKKNI & DigComp 2.2</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Standar Kompetensi Kerja Nasional Indonesia (BNSP) dan European DigComp 2.2 untuk kurasi unit uji kompetensi vokasi.",
                  "National Work Competency Standards (BNSP) & European DigComp 2.2, governing vocational qualification examination units."
                )}
              </p>
              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                SKKNI J.620100.004.01 (Menulis Kode)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                  {t("Sektor Industri", "Industry Sectors")}
                </span>
                <Building2 className="h-4 w-4 text-cyan-600" />
              </div>
              <h3 className="font-black text-zinc-950 text-base">KBLI 2020 & Standar Industri</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Klasifikasi Baku Lapangan Usaha Indonesia (KBLI 6201: Pemrograman Web, KBLI 6202: Konsultasi TI, KBLI 6209: Layanan Teknologi Informasi Lainnya).",
                  "Standard Industrial Classification (KBLI 6201: Software Programming, KBLI 6202: IT Consultancy, KBLI 6209: Advanced Tech Services)."
                )}
              </p>
              <div className="text-[11px] font-mono text-zinc-500 bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                KBLI 6201 (Aktivitas Pemrograman Komputer)
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 03: ALGORITMA PENCOCOKAN & SKILL GAP                 */}
        {/* --------------------------------------------------------- */}
        <section id="step-3" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              03
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Ketiga // Scoring Engine", "Phase 3 // Multi-Criteria Scoring Engine")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Algoritma Multi-Kriteria & Perhitungan Skill Gap",
                  "Multi-Criteria Scoring Algorithm & Mathematical Skill Gap"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Matematika di balik perhitungan skor kesesuaian (Fit Percentage) dan identifikasi keahlian yang belum terpenuhi (Skill Gap).",
                  "Mathematical formulation powering candidate compatibility scores (Fit %) and rigorous set-difference Skill Gap identification."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Left Formula Card */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  {t("Fungsi Objektif Rekomendasi Terbobot", "Weighted Compatibility Objective Function")}
                </span>
                <div className="p-4 rounded-2xl bg-zinc-900 text-white font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
                  S_fit(j) = (w1 × Holland_Match) + (w2 × Interest_Affinity) + (w3 × Skill_Overlap) + (w4 × Target_Alignment)
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <strong className="text-zinc-900">
                    1. Holland RIASEC Alignment (w1 = 25%):
                  </strong>
                  <p className="text-zinc-600 mt-0.5">
                    {t(
                      "Kecocokan kode 3 huruf psikometri (contoh: I-E-R pada calon vs I-R-C pada okupasi O*NET). Dihitung dengan jarak indeks kesamaan heksagonal.",
                      "3-letter Holland RIASEC psychometric alignment (e.g., candidate I-E-R vs O*NET SOC occupational benchmark) via hexagonal distance."
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <strong className="text-zinc-900">
                    2. Interest & Industry Affinity (w2 = 25%):
                  </strong>
                  <p className="text-zinc-600 mt-0.5">
                    {t(
                      "Kesesuaian minat terhadap sektor industri prioritas nasional (Enterprise Software, Digital Banking, Telecommunications, Smart Manufacturing).",
                      "Affinity to strategic industrial sectors (Enterprise Software, Digital Banking, Telecommunications, Smart Manufacturing)."
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <strong className="text-zinc-900">
                    3. Skill Set Overlap (w3 = 35%):
                  </strong>
                  <p className="text-zinc-600 mt-0.5">
                    {t(
                      "Irisan keahlian aktual peserta terhadap keahlian esensial okupasi O*NET: Jaccard Index |User_Skills ∩ Job_Skills| / |Job_Skills|.",
                      "Normalized intersection over target requirements: Jaccard Index |User_Skills ∩ Job_Skills| / |Job_Skills|."
                    )}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <strong className="text-zinc-900">
                    4. Target Career Alignment (w4 = 15%):
                  </strong>
                  <p className="text-zinc-600 mt-0.5">
                    {t(
                      "Pencocokan semantik aspirasi karier peserta dengan deskripsi okupasi resmi.",
                      "Semantic vector matching between student career aspirations and official occupational descriptions."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Skill Gap Card */}
            <div className="lg:col-span-5 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <Sliders className="h-5 w-5" />
                  <span>{t("Formulasi Matematika Skill Gap", "Mathematical Skill Gap Formulation")}</span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {t(
                    "Identifikasi keahlian yang belum dikuasai peserta dilakukan dengan operasi selisih himpunan (Set Difference):",
                    "Identifies missing competencies using formal set difference theory:"
                  )}
                </p>

                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 font-mono text-xs text-red-950 space-y-2">
                  <div className="font-bold">
                    Skill_Gap = S_required(j) \ S_matched(u)
                  </div>
                  <div className="text-[11px] text-zinc-600 font-sans">
                    {t(
                      "Dimana S_required adalah himpunan keahlian wajib okupasi O*NET dan S_matched adalah keahlian yang terbukti telah dimiliki calon.",
                      "Where S_required is the set of required O*NET competencies, and S_matched represents verified candidate competencies."
                    )}
                  </div>
                </div>

                {/* Example applied to Software Engineering Student */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                  <div className="text-[10px] font-black uppercase text-zinc-500">
                    {t("Contoh Kasus: Calon Software Engineer (D4 SIB)", "Case Study: Software Engineer Candidate (D4 SIB)")}
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-emerald-700 font-bold">
                      ✓ {t("Keahlian Cocok (94%):", "Matched Skills (94%):")} Next.js, TypeScript, Laravel, PostgreSQL, Git
                    </div>
                    <div className="text-red-700 font-bold">
                      ⚠ {t("Skill Gap Terdeteksi:", "Identified Skill Gap:")} Docker, Microservices, CI/CD Pipeline
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {t(
                      "Skill Gap ini secara otomatis menjadi bahan baku modul 03 DEVELOP (IDP) untuk dijadwalkan dalam 6 bulan ke depan.",
                      "This gap is fed into Pillar 03 DEVELOP (IDP) to generate prioritized 6-month milestones."
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-100 text-[11px] text-zinc-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{t("Perhitungan tervalidasi 100% deterministik dan dapat diaudit.", "Formulas are 100% deterministic and auditable.")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 04: REASONING AI GOOGLE GEMINI 3.5 PRO               */}
        {/* --------------------------------------------------------- */}
        <section id="step-4" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              04
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Keempat // Generative Reasoning", "Phase 4 // Generative Reasoning")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Orkestrasi Reasoning AI Google Gemini 3.5 Pro",
                  "Google Gemini 3.5 Pro Generative AI Reasoning"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Bagaimana model AI disematkan dalam arsitektur untuk menghasilkan penjelasan yang manusiawi tanpa mengubah validitas data deterministik.",
                  "How the neural engine orchestrates actionable counselor narratives without altering verified deterministic metrics."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            <div className="lg:col-span-7 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="font-black text-base text-zinc-950">
                {t("Prinsip Pemisahan Determinisme & Generasi Teks", "Dual-Layer Engine Architecture: Deterministic Core vs Generative Synthesis")}
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {t(
                  "Sistem kami menolak pendekatan AI hitam (black box) yang rentan halusinasi. Skor kecocokan dihitung oleh algoritma deterministik PostgreSQL & TypeScript, sedangkan Google Gemini 3.5 Pro bertugas sebagai Counselor Engine:",
                  "The platform rejects black-box models prone to hallucinations. Fit percentages are calculated deterministically in PostgreSQL/TypeScript, while Google Gemini 3.5 Pro functions purely as the Counselor Reasoning Layer:"
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="font-bold text-zinc-900 flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-600" />
                    <span>{t("1. Konversi Data ke Narasi", "1. Metrics to Contextual Narrative")}</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    {t(
                      "Mengubah angka abstrak (contoh: 94% fit) menjadi penjelasan kontekstual berbasis realitas kompetensi industri nasional.",
                      "Translates numeric scores (e.g. 94% fit) into actionable vocational roadmaps tailored to national industry competencies."
                    )}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <div className="font-bold text-zinc-900 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-red-600" />
                    <span>{t("2. Explainable Reasoning", "2. Transparent Explainability")}</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">
                    {t(
                      "Model AI menguraikan alasan 'mengapa karier ini cocok' dan 'tindakan apa yang harus diambil 6 bulan ke depan' secara terstruktur.",
                      "Articulates why specific paths fit and details precise 6-month developmental milestones."
                    )}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                <div className="font-bold text-zinc-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-red-600" />
                  <span>{t("3. Catatan Khusus Human-in-the-Loop", "3. Human-in-the-Loop Advisory Notes")}</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  {t(
                    "AI menghasilkan catatan evaluasi khusus untuk konselor akademik dan mentor industri mitra untuk divalidasi dalam sesi pendampingan.",
                    "Generates tailored advisory dossiers for faculty counselors and industry mentors prior to final sign-off."
                  )}
                </p>
              </div>
            </div>

            {/* Prompt Architecture Diagram Box */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-900 text-zinc-200 font-mono text-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">
                  {t("Alur Orkestrasi Prompt Engine (/api/process & /api/ai/chat)", "Prompt Orchestration Pipeline (/api/process & /api/ai/chat)")}
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-emerald-400">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">[SYSTEM PROMPT]</span>
                  &quot;You are an accredited Vocational AI Counselor aligned with O*NET v31.0 and KBJI 2026 standards.&quot;
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sky-300">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">[CONTEXT INGESTION]</span>
                  Candidate = Talenta Vokasi (D4 SIB Polinema), GPA = 3.63, RIASEC = I-E-R, Matched = [Next.js, TS, Laravel, Postgres], Target = Software Engineer & Tech Lead.
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-amber-300">
                  <span className="text-[10px] uppercase text-zinc-500 font-bold block mb-1">[STRUCTURED OUTPUT]</span>
                  Synthesize 3-Phase Action Plan + BNSP Exam References + Curated MSIB BUMN Opportunities.
                </div>
              </div>

              <div className="text-[10px] text-zinc-500 pt-3 border-t border-zinc-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>{t("Didukung oleh Google Gemini 3.5 Pro API", "Powered by Google Gemini 3.5 Pro API")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 05: 5 PILAR GRAND DESIGN IMPLEMENTASI                */}
        {/* --------------------------------------------------------- */}
        <section id="step-5" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              05
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Kelima // Output Platform", "Phase 5 // Grand Design Architecture")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Implementasi 5 Pilar Grand Design Terintegrasi",
                  "Implementation of the 5 Grand Design Integrated Pillars"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Seluruh hasil kalkulasi disalurkan ke dalam 5 modul fungsional yang dapat diakses oleh mahasiswa, konselor, dan mitra industri.",
                  "All computation outputs feed into 5 coordinated modules accessible to students, academic counselors, and industrial partners."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                01
              </div>
              <h3 className="font-black text-sm text-zinc-950">01 ASSESS</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                {t(
                  "Asesmen minat, Holland RIASEC, dan pemetaan keahlian teknis peserta.",
                  "Vocational profiling, RIASEC psychometrics, and baseline skill inventory."
                )}
              </p>
              <div className="text-[10px] font-bold text-red-600 font-mono">/input</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                02
              </div>
              <h3 className="font-black text-sm text-zinc-950">02 MAP</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                {t(
                  "Peta visual cabang karier (Visual Tree) dan perbandingan O*NET v31.0.",
                  "Interactive career branching tree and O*NET comparative benchmarks."
                )}
              </p>
              <div className="text-[10px] font-bold text-red-600 font-mono">/output</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                03
              </div>
              <h3 className="font-black text-sm text-zinc-950">03 DEVELOP</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                {t(
                  "Individual Development Plan (IDP) 3 fase aksi sistematis dan target waktu.",
                  "Individual Development Plan (IDP) with structured 3-phase milestones."
                )}
              </p>
              <div className="text-[10px] font-bold text-red-600 font-mono">/development-plans</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                04
              </div>
              <h3 className="font-black text-sm text-zinc-950">04 PROVE</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                {t(
                  "Digital Skill Passport 3 tier: Claimed, Evidence-Backed, Mentor-Validated.",
                  "3-Tier Digital Skill Passport: Claimed, Artifact-Backed, Mentor-Validated."
                )}
              </p>
              <div className="text-[10px] font-bold text-red-600 font-mono">/portfolio</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">
                05
              </div>
              <h3 className="font-black text-sm text-zinc-950">05 MATCH</h3>
              <p className="text-xs text-zinc-500 leading-snug">
                {t(
                  "Pencocokan langsung ke lowongan kerja bursa industri & program magang bersertifikat nasional.",
                  "Direct pipeline matching to accredited industry job boards & certified national internships."
                )}
              </p>
              <div className="text-[10px] font-bold text-red-600 font-mono">/opportunities</div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 06: METODOLOGI PENELITIAN & CONFUSION MATRIX         */}
        {/* --------------------------------------------------------- */}
        <section id="step-6" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              06
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Keenam // Evaluasi Ilmiah", "Phase 6 // Scientific Empirical Validation")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Validasi Ilmiah dengan Confusion Matrix & Metrik Akurasi",
                  "Scientific Validation via Confusion Matrix & Performance Metrics"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Kerangka penelitian untuk pengujian akurasi sistem terhadap dataset aktual (Ground Truth) mahasiswa dan alumni vokasi.",
                  "Research evaluation framework validating recommendation accuracy against empirical Ground Truth from vocational cohorts and alumni."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Confusion Matrix Table */}
            <div className="lg:col-span-6 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-black text-base text-zinc-950">
                {t("Matriks Kontingensi (Confusion Matrix OvR)", "Contingency Matrix (One-vs-Rest Confusion Matrix)")}
              </h3>
              <p className="text-xs text-zinc-500">
                {t(
                  "Evaluasi keputusan sistem terhadap label pakar/data historis rekrutmen industri.",
                  "Evaluation of engine recommendations vs human expert labels and industry recruitment data."
                )}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border border-zinc-200 bg-zinc-50"></th>
                      <th className="p-2.5 border border-zinc-200 bg-emerald-50 text-emerald-800 font-bold">
                        {t("Ground Truth: POSITIF (Cocok)", "Ground Truth: POSITIVE (Match)")}
                      </th>
                      <th className="p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-700 font-bold">
                        {t("Ground Truth: NEGATIF (Tak Cocok)", "Ground Truth: NEGATIVE (No Match)")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 border border-zinc-200 bg-red-50 text-red-800 font-bold text-left">
                        {t("Prediksi AI: POSITIF", "AI Prediction: POSITIVE")}
                      </td>
                      <td className="p-4 border border-zinc-200 bg-emerald-100/70 font-black text-emerald-950">
                        True Positive (TP)
                        <div className="text-[10px] font-normal text-emerald-800 mt-0.5">
                          {t("Rekomendasi akurat & valid", "Accurate & valid match")}
                        </div>
                      </td>
                      <td className="p-4 border border-zinc-200 bg-rose-50 font-bold text-rose-900">
                        False Positive (FP)
                        <div className="text-[10px] font-normal text-rose-700 mt-0.5">
                          {t("Tipe I Error (Over-recommend)", "Type I Error (Over-recommendation)")}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 border border-zinc-200 bg-zinc-50 text-zinc-700 font-bold text-left">
                        {t("Prediksi AI: NEGATIF", "AI Prediction: NEGATIVE")}
                      </td>
                      <td className="p-4 border border-zinc-200 bg-amber-50 font-bold text-amber-900">
                        False Negative (FN)
                        <div className="text-[10px] font-normal text-amber-700 mt-0.5">
                          {t("Tipe II Error (Karier terlewatkan)", "Type II Error (Missed match)")}
                        </div>
                      </td>
                      <td className="p-4 border border-zinc-200 bg-zinc-100 font-black text-zinc-800">
                        True Negative (TN)
                        <div className="text-[10px] font-normal text-zinc-600 mt-0.5">
                          {t("Tepat menolak jalur tak relevan", "Correctly rejected unfit career")}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Evaluation Formula Cards */}
            <div className="lg:col-span-6 rounded-3xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="font-black text-base text-zinc-950">
                {t("Metrik Pengujian Ilmiah", "Scientific Performance Metrics")}
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">{t("Akurasi (Accuracy)", "Accuracy")}</div>
                  <div className="font-mono text-[11px] text-red-600">
                    (TP + TN) / Total
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {t(
                      "Persentase klasifikasi yang benar dari seluruh populasi uji.",
                      "Overall percentage of correct recommendations across test dataset."
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">{t("Presisi (Precision)", "Precision")}</div>
                  <div className="font-mono text-[11px] text-red-600">
                    TP / (TP + FP)
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {t(
                      "Kebenaran rekomendasi ketika sistem menyarankan suatu jalur.",
                      "Reliability of positive recommendation signals."
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">{t("Recall / Sensitivitas", "Recall / Sensitivity")}</div>
                  <div className="font-mono text-[11px] text-red-600">
                    TP / (TP + FN)
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {t(
                      "Kemampuan AI mendeteksi seluruh karier yang sesungguhnya cocok.",
                      "Ability to retrieve all genuinely compatible career pathways."
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="font-bold text-zinc-900">F1-Score</div>
                  <div className="font-mono text-[11px] text-red-600">
                    2 × (P × R) / (P + R)
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    {t(
                      "Harmonic mean keseimbangan antara presisi dan recall.",
                      "Harmonic balance between precision and recall on imbalanced datasets."
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>{t("Top-3 Recommendation Hit Rate:", "Top-3 Recommendation Hit Rate Target:")}</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  {t(
                    "Dalam implementasi sistem ini, karier yang tepat dipastikan masuk dalam Top-3 Rekomendasi Utama dengan target keberhasilan >90%.",
                    "The system architecture ensures the candidate's optimal trajectory falls within the Top-3 primary recommendations with an empirical hit-rate target >90%."
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* STEP 07: TATA KELOLA & HUMAN-IN-THE-LOOP                  */}
        {/* --------------------------------------------------------- */}
        <section id="step-7" className="scroll-mt-24 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white font-black text-lg shadow-sm shadow-red-500/25 shrink-0">
              07
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-600">
                {t("Tahap Ketujuh // Governance & Security", "Phase 7 // Governance & Security")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 mt-0.5">
                {t(
                  "Tata Kelola Bertanggung Jawab & Human-in-the-Loop",
                  "Responsible AI Governance & Human-in-the-Loop Safeguards"
                )}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-3xl">
                {t(
                  "Menjamin privasi data mahasiswa, kepatuhan audit log tanpa celah manipulasi, dan peran wajib konselor manusia sebelum keputusan penempatan kerja.",
                  "Enforces student data privacy, immutable audit logging, and mandatory human counselor validation prior to employment routing."
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <ShieldCheck className="h-5 w-5 text-red-600" />
                <span>Immutable Audit Logs</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                {t(
                  "Setiap mutasi data (perubahan minat, hasil asesmen, pengayaan O*NET, validasi portofolio) dicatat permanen di tabel audit_logs dengan timestamp ISO, ID aktor, dan IP address.",
                  "Every mutation (assessment results, O*NET enrichments, portfolio validation) is recorded permanently in PostgreSQL audit_logs with ISO timestamp and actor attribution."
                )}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <Lock className="h-5 w-5 text-red-600" />
                <span>{t("Privasi Data & Kepatuhan UU PDP", "Data Privacy & Statutory Compliance")}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                {t(
                  "Portofolio siswa dilindungi hak izin persetujuan (User Consent). Data tidak dipublikasikan ke mitra industri sebelum disetujui secara eksplisit oleh mahasiswa.",
                  "Student portfolios are protected by granular User Consent controls under Indonesian PDP Law. Records are never disclosed to industrial recruiters without explicit student authorization."
                )}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-zinc-950 text-sm">
                <CuteMentorAvatar className="w-8 h-8" />
                <span>{t("Prinsip Human-in-the-Loop", "Human-in-the-Loop Protocol")}</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">
                {t(
                  "Rekomendasi AI bersifat pendukung (decision support), bukan penentu mutlak. Penetapan akhir IDP dan validasi portofolio tetap berada di bawah wewenang Dosen Wali dan Mentor Industri.",
                  "AI outputs serve purely as Decision Support Systems (DSS). Final IDP endorsement and portfolio credentialing remain strictly under the authority of faculty advisors and certified industry mentors."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- */}
        {/* BOTTOM NAVIGATION CTA                                     */}
        {/* --------------------------------------------------------- */}
        <section className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-500">
            {t(
              "CareerPath AI Architecture · Diterbitkan untuk Sidang Akademik & Presentasi Standar Industri Nasional",
              "CareerPath AI Architecture · Published for Academic Defense & National Industry Standards Presentation"
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-bold text-zinc-800 transition-all flex items-center gap-2"
            >
              <IconCoolCompass className="h-4 w-4 text-red-600" />
              <span>{t("Eksplorasi Peta Karier", "Explore Career Map")}</span>
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{t("Pusat Kendali Admin", "Admin Control Center")}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
