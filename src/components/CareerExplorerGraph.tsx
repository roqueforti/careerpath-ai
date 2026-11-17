"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Building2,
  GraduationCap,
  Briefcase,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Zap,
  Target,
  X,
} from "lucide-react";
import {
  CuteStudentAvatar,
  IconCoolRocket,
  IconCoolShip,
  IconCoolPassport,
  IconCoolAI,
} from "@/components/CustomIcons";

interface CareerNodeDetail {
  id: string;
  title: string;
  category: string;
  organization: string;
  onetCode: string;
  kbjiCode: string;
  fitPercentage: number;
  salaryRange: string;
  timeToAchieve: string;
  popularityText: string;
  description: string;
  whyFit: string;
  badges: string[];
  matchedSkills: string[];
  gapSkills: string[];
  idpPhases: Array<{ phase: string; title: string; tasks: string[] }>;
  recommendedCertifications: string[];
}

interface CareerExplorerGraphProps {
  candidateName?: string;
  candidateRole?: string;
  candidateLevel?: string;
  candidateTrack?: string;
  targetCareer?: string;
}

export default function CareerExplorerGraph({
  candidateName = "Profil Talenta Digital",
  candidateRole = "Mahasiswa / Lulusan Vokasi",
  candidateLevel = "Tingkat 4: READY",
  candidateTrack = "Pendidikan Vokasi & Rekayasa TI",
  targetCareer = "Software Engineer & Tech Lead",
}: CareerExplorerGraphProps = {}) {
  const [filter, setFilter] = useState<"all" | "job" | "education" | "featured">("all");
  const [selectedNode, setSelectedNode] = useState<CareerNodeDetail | null>(null);
  const [activeBranch, setActiveBranch] = useState<string>("se");

  const CAREER_NODES: Record<string, CareerNodeDetail> = {
    se: {
      id: "se",
      title: "Software Engineer & Tech Lead",
      category: "Rekayasa Perangkat Lunak & Sistem Enterprise",
      organization: "Industri Perangkat Lunak & Sistem Enterprise",
      onetCode: "15-1252.00 (Software Developers)",
      kbjiCode: "2512 (Pengembang Perangkat Lunak)",
      fitPercentage: 94,
      salaryRange: "Rp 12.000.000 - Rp 22.000.000 / bln",
      timeToAchieve: "6 - 12 Bulan (3 Fase IDP)",
      popularityText: "94% talenta dengan profil RIASEC I-E-R sukses di jalur ini",
      description:
        "Merancang, mengembangkan, dan memimpin arsitektur sistem informasi enterprise modern. Bertanggung jawab atas skalabilitas aplikasi, arsitektur microservices, keandalan basis data, dan kepatuhan standar rekayasa perangkat lunak internasional.",
      whyFit:
        "Sangat selaras dengan keahlian Full-Stack modern (Next.js, TypeScript, Laravel, PostgreSQL) dan dimensi Holland Investigative-Enterprising (analisis teknis + kepemimpinan tim).",
      badges: ["Gaji Tertinggi", "Paling Direkomendasikan", "High Growth Tech"],
      matchedSkills: [
        "Next.js & React.js",
        "TypeScript",
        "Laravel & PHP",
        "PostgreSQL",
        "RESTful API",
        "Git Workflow",
      ],
      gapSkills: [
        "Docker & Containerization",
        "Microservices Architecture",
        "Security & CI/CD Pipeline",
      ],
      idpPhases: [
        {
          phase: "Fase 1 (Bulan 1-3)",
          title: "Fondasi & Sertifikasi Kompetensi Nasional",
          tasks: [
            "Penyelesaian Sertifikasi BNSP Rekayasa Perangkat Lunak",
            "Deep dive Docker & containerization untuk backend sistem enterprise",
          ],
        },
        {
          phase: "Fase 2 (Bulan 4-6)",
          title: "Penguatan Portofolio Industri Enterprise",
          tasks: [
            "Pengembangan modul analitik sistem monitoring berskala enterprise",
            "Audit performa kueri basis data PostgreSQL dan optimasi indexing",
          ],
        },
        {
          phase: "Fase 3 (Bulan 7-12)",
          title: "Kesiapan Seleksi Rekrutmen Profesional & Lead",
          tasks: [
            "Simulasi technical interview & live coding arsitektur sistem",
            "Validasi portofolio dengan praktisi industri & asesor kompetensi",
          ],
        },
      ],
      recommendedCertifications: [
        "BNSP Rekayasa Perangkat Lunak (Software Development)",
        "AWS Certified Solutions Architect / Cloud Practitioner",
        "PostgreSQL Certified Professional",
      ],
    },
    fswd: {
      id: "fswd",
      title: "Full-Stack Web Developer",
      category: "Teknologi Informasi & Aplikasi Web Modern",
      organization: "Industri Teknologi & Web Enterprise Nasional",
      onetCode: "15-1254.00 (Web Developers)",
      kbjiCode: "2512 (Pengembang Web)",
      fitPercentage: 92,
      salaryRange: "Rp 10.000.000 - Rp 15.000.000 / bln",
      timeToAchieve: "3 - 6 Bulan (Fastest Path)",
      popularityText: "Jalur tercepat dengan 92% kesesuaian kurikulum vokasi teknologi informasi",
      description:
        "Membangun antarmuka interaktif responsif berbasis Next.js/Tailwind CSS dan backend modular berkecepatan tinggi dengan integrasi API enterprise.",
      whyFit:
        "Mengoptimalkan keahlian inti pengembangan web modern yang terverifikasi (Next.js, Laravel, Tailwind CSS).",
      badges: ["Fastest Path", "In-Demand"],
      matchedSkills: [
        "Next.js & React.js",
        "Tailwind CSS",
        "Laravel",
        "REST API",
        "Figma UI/UX",
      ],
      gapSkills: ["Automated Testing (Jest / Playwright)", "Redis Caching"],
      idpPhases: [
        {
          phase: "Fase 1",
          title: "Peningkatan Standar Codebase",
          tasks: ["Implementasi E2E testing dan CI/CD workflow pada repositori GitHub."],
        },
      ],
      recommendedCertifications: ["BNSP Pemrograman Web (Web Developer)"],
    },
    devops: {
      id: "devops",
      title: "Cloud & DevOps Systems Engineer",
      category: "Infrastruktur & Cloud Automation",
      organization: "Infrastruktur Sistem & Server Enterprise",
      onetCode: "15-1251.00 (Computer Programmers & DevOps)",
      kbjiCode: "2513 (Teknisi Jaringan & Sistem)",
      fitPercentage: 88,
      salaryRange: "Rp 13.000.000 - Rp 19.000.000 / bln",
      timeToAchieve: "6 - 9 Bulan",
      popularityText: "Permintaan tinggi untuk otomatisasi deployment sistem maritim",
      description:
        "Mengelola deployment pipeline, orchestrasi container Docker/Kubernetes, monitoring performa server, dan keandalan sistem galangan kapal 24/7.",
      whyFit:
        "Didukung kemampuan analitis tinggi dan pengalaman mengelola basis data PostgreSQL.",
      badges: ["Emerging Tech", "High Salary"],
      matchedSkills: ["Linux Basics", "PostgreSQL", "Git Workflow"],
      gapSkills: ["Docker & Kubernetes", "CI/CD Pipeline (GitHub Actions)", "Nginx Reverse Proxy"],
      idpPhases: [
        {
          phase: "Fase 1",
          title: "Containerization & Server Hardening",
          tasks: ["Konfigurasi container Docker untuk aplikasi web multi-service."],
        },
      ],
      recommendedCertifications: ["Certified Kubernetes Administrator (CKA)", "Linux Professional Institute (LPIC-1)"],
    },
    data: {
      id: "data",
      title: "Data & Systems Architect",
      category: "Manajemen Data & Analisis Bisnis",
      organization: "Enterprise Big Data & Maritime Intelligence",
      onetCode: "15-1242.00 (Database Administrators)",
      kbjiCode: "2521 (Desainer & Administrator Basis Data)",
      fitPercentage: 85,
      salaryRange: "Rp 14.000.000 - Rp 20.000.000 / bln",
      timeToAchieve: "9 - 14 Bulan",
      popularityText: "Kebutuhan transformasi digital sistem logistik maritim",
      description:
        "Merancang skema basis data terdistribusi, optimasi query berkecepatan tinggi, integrasi data manufaktur kapal, dan pelaporan intelijen eksekutif.",
      whyFit:
        "Sesuai latar belakang Sistem Informasi Bisnis (SIB) yang menggabungkan analisis proses bisnis dan basis data teknis.",
      badges: ["High Strategic Value"],
      matchedSkills: ["PostgreSQL", "Database Design", "Business Process Modeling"],
      gapSkills: ["Data Warehousing", "ETL Pipelines", "Big Data Analytics"],
      idpPhases: [
        {
          phase: "Fase 1",
          title: "Database Optimization & Indexing",
          tasks: ["Optimasi struktur relasi tabel dan analisis performa query log."],
        },
      ],
      recommendedCertifications: ["Oracle / PostgreSQL Certified Professional"],
    },
  };

  return (
    <div className="w-full space-y-6">
      {/* ========================================================= */}
      {/* 1. HEADER & FILTER SECTION (Matching Reference Image)    */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950">
            Start exploring career paths!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-medium">
            Suggestions based on your preferences · Holland RIASEC:{" "}
            <span className="font-bold text-red-600">Investigative (I) · Enterprising (E) · Realistic (R)</span>
          </p>
        </div>

        {/* Filter Pills (All, By Job, By Education, Featured Track) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === "all"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("job")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === "job"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            By Job (O*NET)
          </button>
          <button
            onClick={() => setFilter("education")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === "education"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            By Education (Vokasi)
          </button>
          <button
            onClick={() => setFilter("featured")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === "featured"
                ? "bg-red-600 text-white shadow-xs"
                : "bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            Peluang Unggulan (Featured)
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2A. MOBILE-OPTIMIZED RESPONSIVE VIEW (md:hidden)          */}
      {/* ========================================================= */}
      <div className="md:hidden space-y-4">
        {/* Candidate Profile Card */}
        <div className="rounded-3xl border-2 border-red-500/20 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <CuteStudentAvatar className="w-12 h-12" showBadge={true} />
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block">
                {candidateLevel}
              </div>
              <h3 className="font-extrabold text-zinc-950 text-sm mt-0.5">
                {candidateName}
              </h3>
            </div>
          </div>
          <div className="border-t border-zinc-100 pt-2.5 space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Target Jangka Panjang:
            </span>
            <p className="font-black text-zinc-900 text-sm">{targetCareer}</p>
            <p className="text-[11px] text-zinc-500">{candidateRole} · {candidateTrack}</p>
          </div>
        </div>

        {/* Sector Target Snapshot */}
        <div className="rounded-2xl bg-amber-50/95 border border-amber-200/90 p-4 text-amber-950 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Sektor Target:</span>
            </div>
            <span className="font-black text-amber-950">Enterprise Software</span>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-amber-200/60 pt-2">
            <span className="text-amber-800">Estimasi Gaji Pasar:</span>
            <span className="font-black text-amber-950">Rp 12jt - Rp 22jt / bln</span>
          </div>
        </div>

        {/* 4 Career Pathway Destination Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Rekomendasi Jalur Okupasi ({Object.keys(CAREER_NODES).length})
            </span>
            <span className="text-[10px] font-semibold text-zinc-400">Ketuk untuk detail</span>
          </div>

          {Object.values(CAREER_NODES).map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className="p-4 rounded-2xl bg-white border border-zinc-200 hover:border-red-500 shadow-xs transition-all cursor-pointer space-y-2.5 active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-black text-sm text-zinc-950">{node.title}</h4>
                  <p className="text-[11px] text-zinc-500 font-medium">{node.category}</p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{node.onetCode}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-red-600 text-white shrink-0">
                  {node.fitPercentage}% Fit
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {node.badges.map((b) => (
                  <span key={b} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {b}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="w-full py-2 px-3 rounded-xl bg-zinc-50 hover:bg-red-50 text-zinc-800 hover:text-red-600 border border-zinc-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Lihat Analisis Kecocokan & IDP</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2B. INTERACTIVE DESKTOP VISUAL CANVAS (hidden md:block)   */}
      {/* ========================================================= */}
      <div className="hidden md:block w-full max-w-full overflow-hidden">
        <div className="relative w-full rounded-3xl border border-zinc-200/90 bg-gradient-to-br from-[#f8fafc] via-white to-[#f1f5f9] p-6 sm:p-8 shadow-xs overflow-x-auto min-h-[660px]">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none rounded-3xl"
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Ribbon Curves Connection Layer */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary Red Gradient for Software Engineer Path */}
            <linearGradient id="curveGradientRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#6366f1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="1" />
            </linearGradient>

            {/* Indigo/Violet Gradient for Alternative Paths */}
            <linearGradient id="curveGradientIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.7" />
            </linearGradient>

            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#dc2626" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Ribbon 1: Origin Card -> Primary Path (Software Engineer & Tech Lead - Top) */}
          <path
            d="M 280 230 C 440 230, 480 90, 720 90"
            stroke="url(#curveGradientRed)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            filter="url(#glowEffect)"
            className="transition-all duration-500 opacity-90"
          />

          {/* Ribbon 2: Origin Card -> Full-Stack Web Developer (Middle) */}
          <path
            d="M 280 250 C 460 250, 520 290, 720 290"
            stroke="url(#curveGradientIndigo)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500 opacity-60"
          />

          {/* Ribbon 3: Origin Card -> Cloud & DevOps Engineer (Bottom) */}
          <path
            d="M 280 270 C 460 270, 540 450, 720 450"
            stroke="#cbd5e1"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500 opacity-70"
          />

          {/* Ribbon 4: Origin Card -> Data Architect (Far Bottom) */}
          <path
            d="M 280 280 C 440 280, 560 570, 750 570"
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500 opacity-50"
          />
        </svg>

        {/* Content Flow Container */}
        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-8 min-w-[980px]">
          {/* ===================================================== */}
          {/* LEFT: CANDIDATE / STUDENT ORIGIN NODE                 */}
          {/* ===================================================== */}
          <div className="w-64 shrink-0 space-y-4">
            <div className="rounded-3xl border-2 border-red-500/20 bg-white p-5 shadow-lg shadow-red-500/5 relative space-y-4 hover:border-red-500/40 transition-all">
              {/* Avatar & Level Tag */}
              <div className="flex items-center gap-3">
                <CuteStudentAvatar className="w-13 h-13" showBadge={true} />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-full inline-block">
                    {candidateLevel}
                  </div>
                  <h3 className="font-extrabold text-zinc-950 text-sm mt-0.5">
                    {candidateName}
                  </h3>
                </div>
              </div>

              {/* Goal Description */}
              <div className="border-t border-zinc-100 pt-3 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Target Jangka Panjang:
                </span>
                <p className="font-black text-zinc-900 text-sm leading-snug">
                  {targetCareer}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {candidateRole} · {candidateTrack}
                </p>
              </div>

              {/* Actions Inside Card */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    setActiveBranch("se");
                    setSelectedNode(CAREER_NODES.se);
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-zinc-200 hover:border-red-600 hover:text-red-600 bg-zinc-50 hover:bg-red-50/50 text-zinc-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <IconCoolRocket className="w-3.5 h-3.5" />
                  <span>Eksplorasi Jalur Terkait</span>
                </button>
                <div className="text-center">
                  <button
                    onClick={() => setSelectedNode(CAREER_NODES.se)}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <IconCoolAI className="w-3 h-3" />
                    <span>Konsultasi AI Mentor?</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Stepping Stone 1: Certification Milestones */}
            <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3.5 shadow-xs space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <IconCoolPassport className="w-4 h-4" />
                  <span>Sertifikasi BNSP</span>
                </div>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md">
                  Fastest Path
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Bidang: Rekayasa Perangkat Lunak (Kurikulum Vokasi)
              </p>
              <button
                onClick={() => setSelectedNode(CAREER_NODES.se)}
                className="text-[10px] font-bold text-red-600 hover:underline pt-0.5 flex items-center gap-1"
              >
                <span>Lihat Detail Modul</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* MIDDLE: FLOATING YELLOW/AMBER INFO CARD               */}
          {/* (Exact counterpart to Delhi University card in image) */}
          {/* ===================================================== */}
          <div className="w-64 shrink-0 pt-4 md:pt-14 space-y-5">
            {/* The Sticky Amber Tooltip Card */}
            <div className="rounded-2xl bg-amber-50/95 border border-amber-200/90 p-4 shadow-md shadow-amber-500/5 text-amber-950 space-y-3 transition-transform hover:-translate-y-1">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Sektor Target:</span>
                </div>
                <div className="font-black text-xs text-amber-950 pl-5">
                  Enterprise Software & Digital Industry
                </div>
              </div>

              <div className="space-y-1 border-t border-amber-200/60 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <Award className="h-3.5 w-3.5 text-amber-600" />
                  <span>Estimasi Gaji Pasar:</span>
                </div>
                <div className="font-black text-xs text-amber-950 pl-5">
                  Rp 12.000.000 - Rp 22.000.000
                </div>
              </div>

              <div className="space-y-1 border-t border-amber-200/60 pt-2">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                  <span>Waktu Capai Target:</span>
                </div>
                <div className="font-black text-xs text-amber-950 pl-5">
                  6 - 12 Bulan (3 Fase IDP)
                </div>
              </div>

              <div className="space-y-1 border-t border-amber-200/60 pt-2 text-[11px]">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <TrendingUp className="h-3.5 w-3.5 text-amber-600" />
                  <span>Popularitas & Fit:</span>
                </div>
                <p className="text-[10px] text-amber-900 leading-tight pl-5">
                  94% lulusan dengan Holland RIASEC I-E-R sukses di jalur rekayasa sistem enterprise & software.
                </p>
              </div>
            </div>

            {/* Stepping Stone 2: Internship Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white/90 p-3.5 shadow-xs space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Magang MSIB Bersertifikat</span>
                </div>
                <span className="text-[9px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md">
                  In-Demand
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Unit Bisnis: Transformasi Digital & Rekayasa Sistem
              </p>
              <button
                onClick={() => setSelectedNode(CAREER_NODES.se)}
                className="text-[10px] font-bold text-red-600 hover:underline pt-0.5 flex items-center gap-1"
              >
                <span>Lihat Panduan Seleksi</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT: DESTINATION CAREER NODES (Branching Tree)      */}
          {/* ===================================================== */}
          <div className="flex-1 w-full max-w-md space-y-4">
            {/* Destination 1 (Primary - Top): Software Engineer */}
            <div className="relative group">
              <div className="rounded-3xl border-2 border-red-500 bg-white p-5 shadow-lg shadow-red-500/10 space-y-3 transition-all hover:shadow-xl">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-zinc-950">
                      Software Engineer & Tech Lead
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                        94% Fit
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">
                    Industri Perangkat Lunak & Sistem Enterprise
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    O*NET 15-1252.00 · KBJI 2512
                  </p>
                </div>

                {/* Badges (Highest Paid, Most Popular, Recommended) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Highest Paid
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Most Popular
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-extrabold">
                    Recommended
                  </span>
                </div>

                {/* Primary CTA */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedNode(CAREER_NODES.se)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-sm shadow-red-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>More Details & IDP</span>
                  </button>

                  {/* "What's Next? ->" pill badge from screenshot */}
                  <Link
                    href="/development-plans"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 text-white text-xs font-bold transition-all shrink-0 shadow-xs group"
                  >
                    <IconCoolRocket className="w-3.5 h-3.5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>What's Next?</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Destination 2: Full-Stack Web Developer */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-2 hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-zinc-950">
                    Full-Stack Web Developer
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Ekosistem Web & Aplikasi Enterprise Nasional
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                  92% Fit
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700">
                  Fastest Path
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                  KBJI 2512
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(CAREER_NODES.fswd)}
                className="w-full mt-1 py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                More Details
              </button>
            </div>

            {/* Destination 3: Cloud & DevOps Systems Engineer */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-2 hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-zinc-950">
                    Cloud & DevOps Systems Engineer
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Infrastruktur & Deployment Enterprise
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                  88% Fit
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                  In-Demand
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600">
                  O*NET 15-1251.00
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(CAREER_NODES.devops)}
                className="w-full mt-1 py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                More Details
              </button>
            </div>

            {/* Destination 4: Data & Systems Architect */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-2 hover:border-zinc-300 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-zinc-950">
                    Data & Systems Architect
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Enterprise Big Data & Maritime Intelligence
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  85% Fit
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(CAREER_NODES.data)}
                className="w-full mt-1 py-1.5 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                More Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE DETAIL DRAWER / MODAL                      */}
      {/* ========================================================= */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-zinc-200 p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-600 text-white">
                    {selectedNode.fitPercentage}% Match
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {selectedNode.onetCode}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mt-1">
                  {selectedNode.title}
                </h2>
                <p className="text-xs text-zinc-500 font-medium">
                  {selectedNode.organization}
                </p>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Rentang Gaji</div>
                <div className="text-xs font-black text-zinc-900 mt-0.5">{selectedNode.salaryRange}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Waktu Capai</div>
                <div className="text-xs font-black text-zinc-900 mt-0.5">{selectedNode.timeToAchieve}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-zinc-400 uppercase">Standar Baku</div>
                <div className="text-xs font-black text-zinc-900 mt-0.5">{selectedNode.kbjiCode}</div>
              </div>
            </div>

            {/* Description & Alignment */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <div className="font-bold text-zinc-900 mb-1">Deskripsi Peran Industri:</div>
                <p className="text-zinc-600">{selectedNode.description}</p>
              </div>
              <div className="rounded-2xl bg-red-50/60 border border-red-100 p-3.5 space-y-1">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-red-600" />
                  <span>Mengapa Anda Sangat Cocok (Analisis Kecocokan):</span>
                </div>
                <p className="text-red-800">{selectedNode.whyFit}</p>
              </div>
            </div>

            {/* Matched vs Gap Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2">
                <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Keahlian Dikuasai (Matched):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.matchedSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 p-4 space-y-2">
                <div className="font-bold text-amber-700 flex items-center gap-1.5">
                  <Target className="h-4 w-4" />
                  <span>Keahlian Perlu Dikembangkan (Gap):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.gapSkills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-medium">
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3-Phase IDP Roadmap Preview */}
            <div className="border-t border-zinc-100 pt-4 space-y-3">
              <div className="font-bold text-zinc-900 text-xs flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-red-600" />
                <span>Rencana Aksi Individu (IDP) Terkurasi:</span>
              </div>
              <div className="space-y-2">
                {selectedNode.idpPhases.map((phase) => (
                  <div key={phase.phase} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                    <div className="font-bold text-zinc-900">{phase.phase}: {phase.title}</div>
                    <ul className="list-disc list-inside text-zinc-600 text-[11px] space-y-0.5 pl-1">
                      {phase.tasks.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100"
              >
                Tutup
              </button>
              <Link
                href="/development-plans"
                onClick={() => setSelectedNode(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/25 transition-all"
              >
                <span>Buka Rencana Aksi IDP Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

