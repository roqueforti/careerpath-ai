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

export interface GrandDesignResult {
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
      portfolioEvidences?: Array<{
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
    aiMentor: {
      provider?: string;
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

export default function CareerSimulator({
  initialTab = "assess",
}: {
  initialTab?: "overview" | "assess" | "idp" | "passport" | "match" | "mentor";
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "assess" | "idp" | "passport" | "match" | "mentor">(initialTab);

  // User Profile Form State - Starts CLEAN and EMPTY for authentic usage
  const [fullName, setFullName] = useState("");
  const [educationLevel, setEducationLevel] = useState("MAHASISWA");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [targetCareerWish, setTargetCareerWish] = useState("");

  // Result state
  const [result, setResult] = useState<GrandDesignResult | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Check if current user is logged in to pre-fill their name
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.authenticated && data?.user?.fullName) {
            setFullName(data.user.fullName);
            if (data.user.educationLevel) {
              setEducationLevel(data.user.educationLevel);
            }
          }
        }
      } catch {
        // Guest user
      }
    }

    loadCurrentUser();

    // Check if user has previously saved an analysis
    try {
      const stored = localStorage.getItem("careerpath_grand_design_result");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.success && parsed?.modules?.map?.primaryCareer) {
          setResult(parsed);
          if (initialTab === "overview") {
            setActiveTab("overview");
          }
        }
      }
    } catch {
      // Storage empty
    }
  }, [initialTab]);

  function handleLoadSampleData() {
    setFullName("Budi Pratama");
    setEducationLevel("MAHASISWA_AKHIR");
    setSelectedInterests([
      "Teknologi Informasi & Rekayasa Perangkat Lunak",
      "Desain Produk, UI/UX & Interaksi Visual",
    ]);
    setSelectedSkills([
      "Next.js & React.js",
      "TypeScript & JavaScript",
      "Laravel & PHP",
      "Tailwind CSS",
      "PostgreSQL",
      "Figma UI/UX",
      "Git & GitHub Workflow",
    ]);
    setSelectedTraits(["I", "E", "R"]);
    setTargetCareerWish("Full-Stack Web Developer & Tech Lead");
    setValidationError(null);
  }

  function handleResetForm() {
    setFullName("");
    setEducationLevel("MAHASISWA");
    setSelectedInterests([]);
    setSelectedSkills([]);
    setSelectedTraits([]);
    setTargetCareerWish("");
    setValidationError(null);
    setResult(null);
    localStorage.removeItem("careerpath_grand_design_result");
    setActiveTab("assess");
  }

  async function handleUpdateAssessment(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    if (selectedInterests.length === 0 && selectedSkills.length === 0) {
      setValidationError("Silakan pilih minimal 1 bidang minat atau 1 keahlian teknis untuk memulai pemetaan.");
      return;
    }

    setIsUpdating(true);
    setSaveSuccessNotice(false);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim() || "Calon Profesional Muda",
          educationLevel,
          interests: selectedInterests,
          skills: selectedSkills,
          personalityTraits: selectedTraits.map((t) => {
            const match = PERSONALITY_TRAITS.find((p) => p.code === t);
            return match ? `${match.name} (${match.desc})` : t;
          }),
          targetCareerWish: targetCareerWish.trim() || "Eksplorasi Jalur Terbaik",
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui analisis karier.");
      }

      const data: GrandDesignResult = await response.json();
      setResult(data);
      localStorage.setItem("careerpath_grand_design_result", JSON.stringify(data));
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3500);
      setActiveTab("overview");
    } catch (err: any) {
      console.error("Update error:", err);
      setValidationError(err?.message || "Gagal memproses data asesmen.");
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
    <div className="w-full font-sans">
      {/* Tab Navigation Header */}
      <section className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-[57px] z-30 shadow-xs">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab("assess")}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "assess"
                  ? "bg-red-600 text-white shadow-xs font-black"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Target className="h-3.5 w-3.5" />
              <span>Formulir Asesmen & Input Kompetensi</span>
            </button>

            {result && (
              <>
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
                  <span>Skill Passport & Bukti Portofolio</span>
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
                  <span>Peluang Industri Terkurasi</span>
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
                  <span>AI Career Mentor</span>
                </button>
              </>
            )}

            {result && (
              <button
                type="button"
                onClick={handleResetForm}
                className="ml-auto px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Mulai Ulang Asesmen Bersih"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Asesmen</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Success alert notice */}
      {saveSuccessNotice && (
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Analisis berhasil disinkronkan dengan Taksonomi O*NET v31.0 & KBJI 2026!</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* ========================================================= */}
        {/* TAB 0: FORMULIR ASESMEN INPUT (DEFAULT)                   */}
        {/* ========================================================= */}
        {activeTab === "assess" && (
          <div className="rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-9 shadow-xs space-y-7 animate-fadeIn max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2">
                  <Target className="h-3.5 w-3.5" />
                  Modul 01 ASSESS · Input Minat & Kompetensi
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
                  Formulir Pemetaan Karier Presisi
                </h1>
                <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                  Masukkan profil pendidikan, minat industri, dan keahlian untuk memetakan keselarasan okupasi O*NET dan IDP Anda.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5 text-red-600" />
                  <span>Isi Sampel Vokasi</span>
                </button>
              </div>
            </div>

            {validationError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateAssessment} className="space-y-6">
              {/* Field 1: Nama & Jenjang */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Nama Lengkap Anda:
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Budi Pratama"
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3.5 text-xs sm:text-sm text-zinc-900 font-semibold focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Jenjang Perjalanan Karier:
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
                    Minat Sektor Industri / Bidang Kejuruan:
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
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected ? "bg-red-600 text-white border-red-600 font-black text-xs" : "border-zinc-300 bg-zinc-50"
                          }`}
                        >
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
                    Keahlian Teknis yang Anda Kuasai:
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
                    onClick={addCustomSkill}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold transition-colors cursor-pointer hover:bg-zinc-800"
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
                          <span
                            className={`inline-flex items-center justify-center h-6 w-6 rounded-md font-black text-xs shrink-0 mt-0.5 ${
                              isSelected ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-700 border border-zinc-300"
                            }`}
                          >
                            {trait.code}
                          </span>
                          <div>
                            <div className="font-bold text-zinc-900 dark:text-white">{trait.name}</div>
                            <div className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{trait.desc}</div>
                          </div>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 ml-2 mt-0.5 border ${
                            isSelected ? "bg-red-600 text-white border-red-600 font-black text-xs" : "border-zinc-300 bg-zinc-50"
                          }`}
                        >
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
                  Aspirasi / Target Profesi Impian:
                </label>
                <input
                  type="text"
                  value={targetCareerWish}
                  onChange={(e) => setTargetCareerWish(e.target.value)}
                  placeholder="Contoh: Software Engineer, Data Scientist, UI/UX Designer, Cybersecurity..."
                  className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 px-3.5 text-xs sm:text-sm text-zinc-900 font-medium focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-zinc-400">
                  Data diproses secara deterministik menggunakan Taksonomi O*NET v31.0, KBJI 2026 & AI Gemini.
                </span>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 text-sm font-bold shadow-md shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isUpdating ? "Menganalisis Kecocokan..." : "Jalankan Analisis Karier Presisi"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & PETA KARIER O*NET                       */}
        {/* ========================================================= */}
        {activeTab === "overview" && result && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Hasil Analisis Terverifikasi</span>
                <h2 className="text-xl font-black text-zinc-950 dark:text-white">
                  Profil Karier: {result.userProfile.fullName}
                </h2>
                <p className="text-xs text-zinc-500">
                  Status Kematangan: <strong>{result.careerJourney.title}</strong> (Skor: {result.careerJourney.readinessScore}/100)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
                </button>
                <button
                  onClick={() => setActiveTab("assess")}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>Edit Parameter</span>
                </button>
              </div>
            </div>

            {/* Visual Interactive Career Roadmap */}
            <CareerExplorerGraph
              candidateName={result.userProfile.fullName}
              candidateLevel={result.careerJourney.level}
              candidateRole={result.userProfile.educationLevel}
              targetCareer={result.modules.map.primaryCareer.title}
            />

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
                      <span className="text-xs text-zinc-400 font-mono">Standar O*NET v31.0 · KBJI 2026</span>
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
                    <strong>Analisis Keselarasan Profil: </strong>
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

              {/* Right 1/3 (col-span-4): Labor Market Insights & IDP Preview */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Wawasan Pasar Kerja Terkait
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                      Aktif
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="text-[11px] text-zinc-400">Kebutuhan Sektoral Industri:</div>
                      <div className="font-bold text-zinc-900 dark:text-white mt-0.5">
                        {result.modules.map.primaryCareer.category}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-zinc-400">Modal Keahlian Terdeteksi:</div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {result.modules.prove.matchedSkills.slice(0, 4).map((sk) => (
                          <span key={sk} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 font-semibold text-[11px]">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/80 text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      Profil Anda telah memenuhi <strong>{result.modules.map.primaryCareer.fitPercentage}% prasyarat teknis</strong> untuk posisi ini.
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-600" />
                      <span className="text-xs font-bold text-zinc-950 dark:text-white uppercase tracking-wider">
                        Rencana Aksi IDP
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
                      3 Fase
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {result.modules.develop.planTitle}
                  </p>

                  <button
                    onClick={() => setActiveTab("idp")}
                    className="w-full text-center py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Buka Rencana Aksi Lengkap ➔
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
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
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
                {result.modules.prove.passportStatus.claimed} Keahlian Terklaim
              </span>
            </div>

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
                  <span>Kesenjangan Keahlian (Skill Gap to Close):</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.modules.prove.gapSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-200"
                    >
                      <span>⚡</span>
                      <span>{sk}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <FileCheck className="h-4 w-4" />
                <span>Buka Manajemen Portofolio Lengkap</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: CURATED OPPORTUNITIES                              */}
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
                  Peluang Magang & Karier Selaras
                </h2>
              </div>
              <Link
                href="/opportunities"
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <span>Lihat Semua Peluang</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {result.modules.match.curatedOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                      {opp.type} · {opp.location}
                    </span>
                    <h3 className="font-black text-sm text-zinc-950 dark:text-white leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">{opp.organization}</p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {opp.description}
                    </p>
                  </div>

                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:border-red-600 hover:text-red-600 transition-colors"
                  >
                    <span>Lamar / Kunjungi Situs</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: AI CAREER MENTOR                                   */}
        {/* ========================================================= */}
        {activeTab === "mentor" && result && (
          <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI & Human Mentoring Ecosystem
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white">
                  Pendampingan Karier AI & Mentor Manusia
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-red-600" />
                  <h3 className="font-black text-sm text-zinc-950 dark:text-white">
                    {result.mentoring.aiMentor.role}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.mentoring.aiMentor.guidance}
                </p>
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-red-200/60 text-xs text-zinc-600 dark:text-zinc-300 italic">
                  💡 {result.mentoring.aiMentor.reflectionPrompt}
                </div>
                <Link
                  href="/ai-mentor"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
                >
                  <span>Mulai Chat dengan AI Mentor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-750 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
                  <h3 className="font-black text-sm text-zinc-950 dark:text-white">
                    {result.mentoring.humanMentor.role}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {result.mentoring.humanMentor.inTheLoopNote}
                </p>
                <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 text-xs text-zinc-700 dark:text-zinc-300 font-semibold">
                  📌 Tugas: {result.mentoring.humanMentor.actionableTask}
                </div>
                <Link
                  href="/mentoring"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs"
                >
                  <span>Buka Forum Diskusi Mentor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
