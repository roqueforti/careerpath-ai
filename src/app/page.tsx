"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase,
  Layers,
  Printer,
  Copy,
  Check,
  Server,
  Zap,
  Compass,
  User,
  X,
  Target,
  Clock,
  ShieldCheck,
  GraduationCap,
  FileCheck,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Building2,
  CheckCircle,
  BarChart3,
  Globe,
  Info,
  Calendar,
  Save,
  RefreshCw,
  Database,
  Workflow,
} from "lucide-react";
import CareerExplorerGraph from "@/components/CareerExplorerGraph";
import { CuteStudentAvatar } from "@/components/CustomIcons";

interface GrandDesignResult {
  success: boolean;
  execution: {
    status: string;
    statusCode: number;
    processingTimeMs: number;
    processedAt: string;
    engineVersion: string;
  };
  careerJourney: {
    level: string;
    title: string;
    readinessScore: number;
    ruleExplanation: string;
  };
  userProfile: {
    fullName: string;
    educationLevel: string;
    interests: string[];
    skills: string[];
    personalityTraits: string[];
    targetCareerWish: string;
  };
  modules: {
    assess: {
      title: string;
      hollandCode: string;
      dimensions: string;
      summary: string;
    };
    map: {
      title: string;
      primaryCareer: {
        id: string;
        title: string;
        slug: string;
        category: string;
        hollandCode: string;
        fitPercentage: number;
        salaryRange: string;
        outlook: string;
        description: string;
        whyFit: string;
        educationPaths: string;
        explorationActivities: string;
      };
      alternativeCareers: Array<{
        id: string;
        title: string;
        slug: string;
        category: string;
        fitPercentage: number;
        salaryRange?: string;
        outlook?: string;
        description: string;
        hollandCode: string;
      }>;
    };
    develop: {
      title: string;
      planTitle: string;
      idpRoadmap: Array<{
        phase: string;
        period: string;
        focus: string;
        tasks: string[];
      }>;
      recommendedCertifications: string[];
    };
    prove: {
      title: string;
      passportStatus: {
        claimed: number;
        evidenceBacked: number;
        mentorValidated: number;
      };
      matchedSkills: string[];
      gapSkills: string[];
      portfolioEvidences: Array<{
        title: string;
        type: string;
        organization: string;
        verificationStatus: string;
        projectUrl: string;
        role: string;
      }>;
    };
    match: {
      title: string;
      curatedOpportunities: Array<{
        id: string;
        title: string;
        type: string;
        organization: string;
        location: string;
        salaryRange?: string;
        eligibility: string;
        url: string;
        description: string;
      }>;
    };
  };
  mentoring: {
    title: string;
    aiMentor: {
      provider: string;
      role: string;
      guidance: string;
      reflectionPrompt: string;
    };
    humanMentor: {
      role: string;
      inTheLoopNote: string;
      actionableTask: string;
    };
  };
  principles: string[];
}

const INTEREST_OPTIONS = [
  "Teknologi Informasi & Rekayasa Perangkat Lunak",
  "Sains Data, AI & Big Data Analytics",
  "Desain Produk, UI/UX & Interaksi Visual",
  "Infrastruktur Cloud, DevOps & Keamanan Siber",
  "Manajemen Sistem Informasi & Bisnis Digital",
  "Robotika, Mekatronika & Manufaktur Presisi",
  "Keuangan Kuantitatif & Sistem Perbankan",
  "Pendidikan Digital & Pelatihan Vokasi",
];

const SKILL_CATEGORIES = [
  {
    category: "Web & Frontend",
    skills: ["Next.js & React.js", "TypeScript & JavaScript", "Tailwind CSS", "Vue.js", "HTML5/CSS3"],
  },
  {
    category: "Backend & Systems",
    skills: ["Laravel & PHP", "Node.js & Express", "Python & Django", "RESTful API Architecture", "Docker & Linux"],
  },
  {
    category: "Database & Data",
    skills: ["PostgreSQL", "MySQL", "Prisma ORM", "Redis", "Database Optimization"],
  },
  {
    category: "Design & Professional",
    skills: ["Figma UI/UX", "Problem Solving", "Git & GitHub Workflow", "Scrum / Agile", "Technical Documentation"],
  },
];

const PERSONALITY_TRAITS = [
  { code: "I", name: "Investigative", desc: "Berpikir analitis, riset empiris, memecahkan arsitektur algoritma kompleks." },
  { code: "R", name: "Realistic", desc: "Praktek teknik nyata, rekayasa perangkat lunak, perakitan dan konfigurasi sistem." },
  { code: "E", name: "Enterprising", desc: "Kepemimpinan teknis (Tech Lead), inisiatif inovasi, presentasi dan persuasi proyek." },
  { code: "C", name: "Conventional", desc: "Ketertiban kode, standarisasi arsitektur, kepatuhan dokumentasi dan QA." },
  { code: "A", name: "Artistic", desc: "Kreativitas visual, user-centric design, inovasi pengalaman antarmuka." },
  { code: "S", name: "Social", desc: "Kolaborasi tim lintas disiplin, mentoring rekan sejawat, komunikasi empati." },
];

export default function CareerDashboardPage({
  initialTab = "overview",
}: {
  initialTab?: "overview" | "assess" | "idp" | "passport" | "match" | "mentor";
} = {}) {
  const [activeTab, setActiveTab] = useState<"overview" | "assess" | "idp" | "passport" | "match" | "mentor">(initialTab);

  // User Profile Form State
  const [fullName, setFullName] = useState("Hilman Zahrawa Budiarto");
  const [educationLevel, setEducationLevel] = useState("MAHASISWA_AKHIR");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Teknologi Informasi & Rekayasa Perangkat Lunak",
    "Desain Produk, UI/UX & Interaksi Visual",
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Next.js & React.js",
    "TypeScript & JavaScript",
    "Laravel & PHP",
    "Tailwind CSS",
    "PostgreSQL",
    "Figma UI/UX",
    "Problem Solving",
    "Git & GitHub Workflow",
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>(["I", "E", "R"]);
  const [targetCareerWish, setTargetCareerWish] = useState("Full-Stack Web Developer & Tech Lead (Enterprise Software)");

  // State
  const [result, setResult] = useState<GrandDesignResult | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Auto-load or initialize Hilman's career analysis on mount
  useEffect(() => {
    async function initDashboard() {
      try {
        const stored = localStorage.getItem("careerpath_grand_design_result");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.success && parsed?.modules?.map?.primaryCareer) {
            setResult(parsed);
            return;
          }
        }

        // If not in storage, fetch real analysis from API
        const response = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: "Hilman Zahrawa Budiarto",
            educationLevel: "MAHASISWA_AKHIR",
            interests: selectedInterests,
            skills: selectedSkills,
            personalityTraits: ["Investigative", "Enterprising", "Realistic"],
            targetCareerWish: "Full-Stack Web Developer & Tech Lead (Enterprise Software)",
          }),
        });

        if (response.ok) {
          const data: GrandDesignResult = await response.json();
          setResult(data);
          localStorage.setItem("careerpath_grand_design_result", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Dashboard initialization error:", err);
      }
    }

    initDashboard();
  }, []);

  async function handleUpdateAssessment(e: React.FormEvent) {
    e.preventDefault();
    setIsUpdating(true);
    setSaveSuccessNotice(false);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          educationLevel,
          interests: selectedInterests,
          skills: selectedSkills,
          personalityTraits: selectedTraits.map((t) => {
            const match = PERSONALITY_TRAITS.find((p) => p.code === t);
            return match ? `${match.name} (${match.desc})` : t;
          }),
          targetCareerWish,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui analisis");
      }

      const data: GrandDesignResult = await response.json();
      setResult(data);
      localStorage.setItem("careerpath_grand_design_result", JSON.stringify(data));
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
      setActiveTab("overview");
    } catch (err) {
      console.error("Update error:", err);
      alert("Gagal memperbarui analisis karier.");
    } finally {
      setIsUpdating(false);
    }
  }

  function toggleInterest(interest: string) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  }

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function addCustomSkill() {
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput("");
    }
  }

  function toggleTrait(code: string) {
    if (selectedTraits.includes(code)) {
      setSelectedTraits(selectedTraits.filter((t) => t !== code));
    } else {
      setSelectedTraits([...selectedTraits, code]);
    }
  }

  function handleCopySummary() {
    if (!result) return;
    const summaryText = `CAREERPATH AI - HASIL REKOMENDASI KARIER
Peserta: ${result.userProfile.fullName} (${result.careerJourney.level})
Kematangan Karier: ${result.careerJourney.readinessScore}/100
Rekomendasi Profesi: ${result.modules.map.primaryCareer.title} (${result.modules.map.primaryCareer.fitPercentage}% Match)
Kategori O*NET: ${result.modules.map.primaryCareer.category} | Gaji Pasar: ${result.modules.map.primaryCareer.salaryRange}
IDP Rencana Aksi: ${result.modules.develop.planTitle}
Keahlian Dikuasai: ${result.modules.prove.matchedSkills.join(", ")}
Skill Gaps: ${result.modules.prove.gapSkills.join(", ")}
Peluang Terkurasi: ${result.modules.match.curatedOpportunities.map((o) => o.title).join("; ")}
Catatan AI Mentor: ${result.mentoring.aiMentor.guidance}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
      {/* ========================================================= */}
      {/* 1. PUBLIC LANDING PAGE HERO SECTION                       */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-white via-red-50/20 to-[#f8fafc] border-b border-zinc-200/90 py-10 sm:py-14 lg:py-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sistem Bimbingan & Akselerasi Karier Nasional · O*NET v31.0 & KBJI 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.08]">
              Petakan Masa Depan Kariermu Secara <span className="text-red-600">Presisi</span> Berbasis Data & AI
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-3xl leading-relaxed font-medium">
              Platform bimbingan cerdas yang memetakan minat psikometri <strong>Holland RIASEC</strong>, taksonomi standar internasional <strong>O*NET v31.0</strong> dan nasional <strong>KBJI 2026</strong>, rencana aksi individu (IDP), hingga validasi portofolio ke bursa kerja industri.
            </p>

            {/* Public Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/input"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Mulai Asesmen Minat & Skill</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>

              <a
                href="#explorer"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all flex items-center gap-2"
              >
                <Compass className="h-4 w-4 text-red-600" />
                <span>Jelajahi Peta Karier</span>
              </a>

              <Link
                href="/architecture"
                className="px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
              >
                <Layers className="h-4 w-4 text-red-400" />
                <span>Arsitektur Sistem (Presentasi)</span>
              </Link>
            </div>
          </div>

          {/* 4 Quantitative Platform Metric Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Taksonomi Baku</span>
                <Database className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-950">1.016+ Okupasi</div>
              <p className="text-[11px] text-zinc-500">Terstandar O*NET v31.0 & KBJI 2026</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Framework Vokasi</span>
                <Workflow className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-950">5 Pilar Terpadu</div>
              <p className="text-[11px] text-zinc-500">Assess, Map, Develop, Prove, Match</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Presisi Rekomendasi</span>
                <Target className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-950">&gt;90% Hit Rate</div>
              <p className="text-[11px] text-emerald-600 font-semibold">Target Akurasi Top-3 Rekomendasi</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tata Kelola AI</span>
                <ShieldCheck className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-950">100% Auditable</div>
              <p className="text-[11px] text-zinc-500">Human-in-the-Loop & Deterministic Core</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PRODUCTION TAB NAVIGATION (Full Width)                 */}
      {/* ========================================================= */}
      <section id="explorer" className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-[57px] z-30 shadow-xs scroll-mt-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Ringkasan & Peta Karier O*NET</span>
            </button>

            <button
              onClick={() => setActiveTab("idp")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "idp"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Rencana Aksi (IDP 3 Fase)</span>
            </button>

            <button
              onClick={() => setActiveTab("passport")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "passport"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>Skill Passport & Portofolio Riil</span>
            </button>

            <button
              onClick={() => setActiveTab("match")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "match"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Peluang Rekrutmen Industri</span>
            </button>

            <button
              onClick={() => setActiveTab("mentor")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "mentor"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Career Mentor (Gemini 3.5)</span>
            </button>

            <button
              onClick={() => setActiveTab("assess")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ml-auto ${
                activeTab === "assess"
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-250"
              }`}
            >
              <Target className="h-3.5 w-3.5 text-red-600" />
              <span>Edit Formulir Asesmen</span>
            </button>
          </div>
        </div>
      </section>

      {/* Success alert notice */}
      {saveSuccessNotice && (
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>Data kompetensi berhasil disinkronkan dengan Taksonomi O*NET & Model AI Gemini!</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN DASHBOARD CONTENT AREA                            */}
      {/* ========================================================= */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-7">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & PETA KARIER O*NET (DEFAULT)             */}
        {/* ========================================================= */}
        {activeTab === "overview" && result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Visual Interactive Career Roadmap (Reference UI) */}
            <CareerExplorerGraph />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 pt-4">
            {/* Left 2/3 (col-span-8): Primary Career Card & Alternative Paths */}
            <div className="lg:col-span-8 space-y-6">
              {/* Primary Career Hero Card */}
              <div className="rounded-2xl border-2 border-red-600 bg-white dark:bg-zinc-900 p-6 sm:p-7 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider">
                      <Compass className="h-3.5 w-3.5" />
                      Rekomendasi Jalur Karier Utama
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">O*NET 15-1252.00 · KBJI 2512</span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 px-3 py-1 rounded-xl border border-red-200 dark:border-red-800">
                    <span className="text-xl font-black text-red-600">{result.modules.map.primaryCareer.fitPercentage}%</span>
                    <span className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase">Kesesuaian</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
                    {result.modules.map.primaryCareer.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                    Kategori: {result.modules.map.primaryCareer.category} · Kode Holland RIASEC:{" "}
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">{result.modules.map.primaryCareer.hollandCode}</span>
                  </p>
                </div>

                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.modules.map.primaryCareer.description}
                </p>

                <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs sm:text-sm text-red-900 dark:text-red-200 leading-relaxed">
                  <strong>Analisis Keselarasan Profil Hilman: </strong>
                  {result.modules.map.primaryCareer.whyFit}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estimasi Kompensasi Industri:</div>
                    <div className="text-sm sm:text-base font-black text-zinc-950 dark:text-white mt-0.5">
                      {result.modules.map.primaryCareer.salaryRange}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Prospek Pasar Kerja:</div>
                    <div className="text-sm sm:text-base font-black text-emerald-600 mt-0.5 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" />
                      <span>Pertumbuhan Sangat Tinggi (+24% YoY)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Careers Grid */}
              <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                    Jalur Alternatif Terkait (Taksonomi O*NET)
                  </h3>
                  <span className="text-xs text-zinc-400">Pilihan Profesi Sejenis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.modules.map.alternativeCareers.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-750 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase">{alt.category}</span>
                          <span className="text-xs font-black text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
                            {alt.fitPercentage}% Match
                          </span>
                        </div>
                        <div className="font-bold text-sm text-zinc-900 dark:text-white mt-1">{alt.title}</div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {alt.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1/3 (col-span-4): Labor Market Insights & Quick IDP Snapshot */}
            <div className="lg:col-span-4 space-y-6">
              {/* Labor Market Live Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Wawasan Pasar Kerja (Industri Maritim & IT)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    Aktif
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[11px] text-zinc-400">Kebutuhan Sektoral Industri Enterprise:</div>
                    <div className="font-bold text-zinc-900 dark:text-white mt-0.5">
                      Pengembangan Web HRIS, ERP Perusahaan & Dashboard Analitik Bisnis
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-zinc-400">Kemampuan Paling Dibutuhkan:</div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px]">Next.js</span>
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px]">Laravel</span>
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px]">PostgreSQL</span>
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px]">Docker</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    Profil Mas Hilman telah memenuhi <strong>85% prasyarat teknis</strong> untuk posisi Software Engineer / Web Developer di industri enterprise digital.
                  </div>
                </div>
              </div>

              {/* Verified Portfolios Card */}
              <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-red-600" />
                    <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                      Portofolio Riil Terverifikasi
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                    5 Proyek Valid
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80">
                    <div className="font-bold text-zinc-900 dark:text-white">Enterprise HRIS & Workforce Platform</div>
                    <div className="text-[11px] text-zinc-500">Sistem HRIS / Absensi Magang & Shift</div>
                    <span className="text-[10px] font-bold text-red-600 mt-1 inline-block">Full-Stack Web Developer</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80">
                    <div className="font-bold text-zinc-900 dark:text-white">BrewTech LMS Platform</div>
                    <div className="text-[11px] text-zinc-500">Juara 1 Innovillage & Djarum Beasiswa Plus</div>
                    <span className="text-[10px] font-bold text-red-600 mt-1 inline-block">Tech Lead & Web Developer</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80">
                    <div className="font-bold text-zinc-900 dark:text-white">Disnakertrans Jawa Timur</div>
                    <div className="text-[11px] text-zinc-500">Profile Image Studio & Sistem Kepegawaian</div>
                    <span className="text-[10px] font-bold text-red-600 mt-1 inline-block">Web Developer</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("passport")}
                  className="w-full text-center py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                >
                  Buka Skill Passport Lengkap ➔
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INDIVIDUAL DEVELOPMENT PLAN (IDP 3 FASE)           */}
        {/* ========================================================= */}
        {activeTab === "idp" && result && (
          <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2">
                  <Target className="h-3.5 w-3.5" />
                  Modul 03 DEVELOP · Rencana Aksi Pengembangan Diri
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                  Individual Development Plan (IDP) 3 Fase
                </h2>
                <p className="text-xs text-zinc-500">
                  Peta jalan aksi terstruktur untuk persiapan karier dan seleksi rekrutmen industri.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  Cetak PDF IDP
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.modules.develop.idpRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-extrabold text-red-600 uppercase tracking-wider text-xs">
                        {item.phase}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[11px] font-bold border border-zinc-200/80">
                        <Clock className="h-3 w-3" />
                        {item.period}
                      </span>
                    </div>

                    <div className="text-sm font-black text-zinc-900 dark:text-white mb-3">
                      Fokus: {item.focus}
                    </div>

                    <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                      {item.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-2">
                          <span className="text-red-600 font-bold">•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 text-xs space-y-2">
              <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-red-600" />
                Rekomendasi Sertifikasi Kompetensi Terakreditasi:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.modules.develop.recommendedCertifications.map((cert) => (
                  <span key={cert} className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                    🏅 {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: DIGITAL SKILL PASSPORT & BUKTI RIIL                */}
        {/* ========================================================= */}
        {activeTab === "passport" && result && (
          <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2">
                  <FileCheck className="h-3.5 w-3.5" />
                  Modul 04 PROVE · Digital Skill Passport
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                  Kompilasi Bukti Portofolio & Keahlian Teruji
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-md border border-emerald-200">
                5 Portofolio Tervalidasi
              </span>
            </div>

            {/* Matched vs Gap Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Keahlian Dikuasai (Matched Skills):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.modules.prove.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200"
                    >
                      <span>✓</span>
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  <span>Kesenjangan Keahlian (Skill Gaps):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.modules.prove.gapSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-200"
                    >
                      <span>+</span>
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence items */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Daftar Portofolio Riil Tersimpan di Database:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">Enterprise HRIS & Workforce Platform</div>
                  <div className="text-xs text-zinc-500">Sistem HRIS / Absensi Magang & Shift</div>
                  <div className="text-[11px] text-zinc-400">Teknologi: Next.js, Laravel, PostgreSQL</div>
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Status: Verified Mentor</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">BrewTech LMS Platform</div>
                  <div className="text-xs text-zinc-500">Juara 1 Innovillage & Djarum Beasiswa Plus</div>
                  <div className="text-[11px] text-zinc-400">Teknologi: React, PHP, MySQL, Figma</div>
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Status: Verified Mentor</span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <div className="font-bold text-sm text-zinc-900 dark:text-white">Disnakertrans Jawa Timur</div>
                  <div className="text-xs text-zinc-500">Profile Image Studio & Sistem Kepegawaian</div>
                  <div className="text-[11px] text-zinc-400">Teknologi: Laravel, Tailwind CSS</div>
                  <span className="inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Status: Verified Mentor</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PELUANG REKRUTMEN INDUSTRI & MAGANG                */}
        {/* ========================================================= */}
        {activeTab === "match" && result && (
          <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  Modul 05 MATCH · Kurasi Peluang Industri
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                  Peluang Magang & Karier Relevan
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.modules.match.curatedOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-md border border-red-200">
                        {opp.type}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600">
                        {opp.eligibility}
                      </span>
                    </div>
                    <div className="font-extrabold text-base text-zinc-900 dark:text-white">{opp.title}</div>
                    <div className="text-xs text-zinc-500 font-semibold mt-1">{opp.organization}</div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-3">
                      {opp.description}
                    </p>
                  </div>

                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Lamar / Buka Detail</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: AI CAREER MENTOR & MENTOR MANUSIA                  */}
        {/* ========================================================= */}
        {activeTab === "mentor" && result && (
          <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <Sparkles className="h-5 w-5 text-red-600" />
              <div>
                <h2 className="text-xl font-black text-zinc-950 dark:text-white">
                  AI-Assisted Mentoring & Sinergi Dosen Wali (Human-in-the-Loop)
                </h2>
                <p className="text-xs text-zinc-500">
                  Konsultasi sintesis Google Gemini 3.5 Flash dan arahan dosen pembimbing akademik.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Guidance Box */}
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-3">
                <div className="flex items-center gap-2 text-red-600 font-extrabold text-xs uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Career Mentor (Google Gemini 3.5 Flash)</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.mentoring.aiMentor.guidance}
                </p>
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs italic text-zinc-600 dark:text-zinc-300">
                  "{result.mentoring.aiMentor.reflectionPrompt}"
                </div>
              </div>

              {/* Human Mentor Box */}
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-3">
                <div className="flex items-center gap-2 text-blue-600 font-extrabold text-xs uppercase tracking-wider">
                  <Users className="h-4 w-4" />
                  <span>Dosen Pembimbing / Mentor Manusia</span>
                </div>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.mentoring.humanMentor.inTheLoopNote}
                </p>
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">Instruksi:</span>
                  <span>{result.mentoring.humanMentor.actionableTask}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: FORMULIR ASESMEN & EDIT KOMPETENSI (01 ASSESS)     */}
        {/* ========================================================= */}
        {activeTab === "assess" && (
          <form
            onSubmit={handleUpdateAssessment}
            className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-7 animate-fadeIn"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                  <Compass className="h-3.5 w-3.5" />
                  <span>Pembaruan Data Asesmen & Profil Kompetensi</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white mt-2">
                  Sesuaikan Minat, Keahlian Teknis & Target Karier
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                ✕ Kembali ke Dashboard
              </button>
            </div>

            {/* Field 1: Biodata & Jenjang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Nama Lengkap Mahasiswa:
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap..."
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-3.5 text-xs sm:text-sm text-zinc-900 font-medium focus:border-red-600 focus:ring-2 focus:ring-red-600/20 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Tingkat Perjalanan Karier:
                </label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3.5 text-xs sm:text-sm font-semibold text-zinc-900 focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer"
                >
                  <option value="SMP">Level 1: SMP / MTs (L1: EXPLORE - Eksplorasi Minat)</option>
                  <option value="SMA">Level 2: SMA / SMK / MA (L2: PLAN - Pilihan Penjurusan)</option>
                  <option value="MAHASISWA">Level 3: Mahasiswa (L3: DEVELOP - Skill Gap & Magang)</option>
                  <option value="MAHASISWA_AKHIR">Level 4: Mahasiswa Akhir / Freshgrad (L4: READY - Portofolio & Kerja)</option>
                </select>
              </div>
            </div>

            {/* Field 2: Sektor Industri */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Minat Sektor Industri / Bidang Kejuruan (Pilih Kotak):
                </label>
                <span className="text-[11px] text-red-600 font-bold">{selectedInterests.length} Terpilih</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`text-left p-3 rounded-xl border-2 text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-red-50/90 dark:bg-red-950/60 border-red-600 text-red-900 dark:text-red-100 font-bold shadow-xs"
                          : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-750 text-zinc-700 dark:text-zinc-300 hover:border-red-400"
                      }`}
                    >
                      <span className="line-clamp-2 pr-2">{interest}</span>
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? "bg-red-600 text-white border-red-600 font-black text-xs"
                          : "border-zinc-300 bg-zinc-50"
                      }`}>
                        {isSelected ? "✓" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 3: Keahlian Teknis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Keahlian Teknis Dikuasai (Klik Chip untuk Mengubah):
                </label>
                <span className="text-[11px] text-red-600 font-bold">{selectedSkills.length} Aktif</span>
              </div>

              <div className="space-y-3">
                {SKILL_CATEGORIES.map((cat) => (
                  <div key={cat.category} className="space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{cat.category}:</div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
                                ? "bg-red-600 text-white border-red-700 shadow-xs"
                                : "bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 hover:border-red-400"
                            }`}
                          >
                            <span>{isSelected ? "✓" : "+"}</span>
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="Ketik keahlian spesifik lain lalu tekan Enter..."
                  className="flex-1 rounded-xl border border-zinc-300 bg-white py-2 px-3.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => addCustomSkill()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  + Tambah
                </button>
              </div>
            </div>

            {/* Field 4: Holland RIASEC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Dimensi Karakter Kerja Holland RIASEC (Pilih Yang Dominan):
                </label>
                <span className="text-[11px] text-zinc-400">{selectedTraits.length} Dimensi Terpilih</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PERSONALITY_TRAITS.map((trait) => {
                  const isSelected = selectedTraits.includes(trait.code);
                  return (
                    <button
                      key={trait.code}
                      type="button"
                      onClick={() => toggleTrait(trait.code)}
                      className={`text-left p-3 rounded-xl border-2 text-xs leading-relaxed transition-all flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? "bg-red-50/90 dark:bg-red-950/60 border-red-600 text-zinc-950 dark:text-white font-medium shadow-xs"
                          : "bg-white dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-750 text-zinc-600 dark:text-zinc-300 hover:border-red-400"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-md font-black text-xs shrink-0 mt-0.5 ${
                          isSelected ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                        }`}>
                          {trait.code}
                        </span>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">{trait.name}</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{trait.desc}</div>
                        </div>
                      </div>
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ml-2 mt-0.5 border ${
                        isSelected ? "bg-red-600 text-white border-red-600 font-black text-xs" : "border-zinc-300 bg-zinc-50"
                      }`}>
                        {isSelected ? "✓" : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 5: Aspirasi Karier */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Aspirasi / Target Karier Impian:
              </label>
              <input
                type="text"
                value={targetCareerWish}
                onChange={(e) => setTargetCareerWish(e.target.value)}
                placeholder="Contoh: Full-Stack Web Developer, Cloud Solutions Architect, Data Scientist..."
                className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3.5 text-xs sm:text-sm text-zinc-900 font-medium focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                Data akan diproses ulang oleh O*NET Matching Engine & model Google Gemini 3.5.
              </span>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-sm font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isUpdating ? "Memproses Data..." : "Simpan & Sinkronisasi O*NET"}</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
