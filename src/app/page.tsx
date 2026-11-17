"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Compass,
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
  CheckCircle2,
  BarChart3,
  Globe,
  Database,
  Workflow,
  Cpu,
  Check,
} from "lucide-react";
import CareerExplorerGraph from "@/components/CareerExplorerGraph";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans pb-24 selection:bg-red-600 selection:text-white">
      {/* ========================================================= */}
      {/* 1. PUBLIC LANDING PAGE HERO SECTION                       */}
      {/* ========================================================= */}
      <section className="bg-gradient-to-b from-white via-red-50/20 to-[#f8fafc] border-b border-zinc-200/90 py-12 sm:py-16 lg:py-20">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="max-w-4xl space-y-5">
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
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-3">
              <Link
                href="/assessments"
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer group"
              >
                <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Mulai Asesmen Minat (RIASEC)</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>

              <Link
                href="/input"
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-800 font-bold text-sm border border-zinc-200 shadow-xs hover:border-zinc-300 transition-all flex items-center gap-2"
              >
                <Target className="h-4 w-4 text-red-600" />
                <span>Simulasi Keselarasan Karier</span>
              </Link>

              <a
                href="#explorer"
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-sm transition-all flex items-center gap-2"
              >
                <Compass className="h-4 w-4 text-red-600" />
                <span>Jelajahi Peta Karier</span>
              </a>

              <Link
                href="/architecture"
                className="w-full sm:w-auto justify-center px-5 sm:px-6 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-xs transition-all flex items-center gap-2"
              >
                <Layers className="h-4 w-4 text-red-400" />
                <span>Arsitektur Sistem (Presentasi)</span>
              </Link>
            </div>
          </div>

          {/* 4 Quantitative Platform Metric Badges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Taksonomi Baku</span>
                <Database className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950">1.016+ Okupasi</div>
              <p className="text-[11px] text-zinc-500">Terstandar O*NET v31.0 & KBJI 2026</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Framework Vokasi</span>
                <Workflow className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950">5 Pilar Terpadu</div>
              <p className="text-[11px] text-zinc-500">Assess, Map, Develop, Prove, Match</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 sm:p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Presisi Rekomendasi</span>
                <Target className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-zinc-950">&gt;90% Hit Rate</div>
              <p className="text-[11px] text-emerald-600 font-semibold">Target Akurasi Top-3 Rekomendasi</p>
            </div>

            <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-zinc-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tata Kelola AI</span>
                <ShieldCheck className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-2xl font-black text-zinc-950">100% Auditable</div>
              <p className="text-[11px] text-zinc-500">Human-in-the-Loop & Formula Deterministik</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. INTERACTIVE CAREER EXPLORER PREVIEW                    */}
      {/* ========================================================= */}
      <section id="explorer" className="w-full max-w-full overflow-hidden max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6 sm:space-y-8 scroll-mt-20">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Visual Career Pathways</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
            Visualisasi Peta Karier & Standar Industri
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-3xl leading-relaxed">
            Klik dan eksplorasi bagaimana profil minat psikometri dan modal keahlian teknis terhubung secara matematis ke jalur profesi standar O*NET v31.0, sertifikasi BNSP, serta kebutuhan industri digital modern.
          </p>
        </div>

        <CareerExplorerGraph />
      </section>

      {/* ========================================================= */}
      {/* 3. THE 5 VOCATIONAL PILLARS (GRAND DESIGN)                */}
      {/* ========================================================= */}
      <section className="bg-white border-y border-zinc-200/90 py-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold uppercase tracking-wider">
              <Workflow className="h-3.5 w-3.5 text-red-600" />
              <span>Arsitektur Holistik 5 Pilar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Ekosistem Pengembangan Karier Berbasis Bukti
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed font-medium">
              Dirancang untuk mengatasi kesenjangan antara kurikulum pendidikan vokasi dengan tuntutan riil bursa kerja industri melalui 5 pilar terpadu:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Pilar 1 */}
            <div className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  01 // ASSESS
                </span>
                <Target className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">Holland RIASEC Psychometric Inventory</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Asesmen 6 dimensi (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) untuk mengidentifikasi kecenderungan orientasi kerja peserta secara objektif.
              </p>
              <Link
                href="/assessments"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Buka Katalog Asesmen</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Pilar 2 */}
            <div className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  02 // MAP
                </span>
                <Compass className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">Taksonomi O*NET & KBJI 2026</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pencocokan multi-kriteria matematis menghitung skor kecocokan (Fit Percentage) dan menganalisis kesenjangan keahlian (Skill Gap) dengan formula set difference.
              </p>
              <Link
                href="/career-map"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Jelajahi Peta Okupasi</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Pilar 3 */}
            <div className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  03 // DEVELOP
                </span>
                <GraduationCap className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">Individual Development Plan (IDP) 3 Fase</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Peta jalan pengembangan diri terstruktur: Fase 1 (Fondasi & Skill Gap), Fase 2 (Portofolio Proyek Terapan), dan Fase 3 (Sertifikasi BNSP & Kesiapan Rekrutmen).
              </p>
              <Link
                href="/input"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Simulasi Rencana Aksi</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Pilar 4 */}
            <div className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  04 // PROVE
                </span>
                <FileCheck className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">Digital Skill Passport & Bukti Riil</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Dokumentasi artefak proyek, tautan repositori kode, sertifikat resmi, dan validasi kompetensi oleh guru BK, dosen pembimbing, maupun mentor praktisi.
              </p>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Pelajari Skill Passport</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Pilar 5 */}
            <div className="p-7 rounded-3xl bg-zinc-50/70 border border-zinc-200/90 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                  05 // MATCH
                </span>
                <Briefcase className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">Kurasi Peluang Industri & Magang</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Pencocokan peluang magang bersertifikat industri, lowongan pekerjaan fresh graduate, serta program beasiswa yang relevan dengan kesiapan kompetensi Anda.
              </p>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Daftar Peluang Aktif</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Tata Kelola AI */}
            <div className="p-7 rounded-3xl bg-red-50/50 border border-red-200/70 hover:border-red-500/50 transition-all space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-red-700 bg-red-100 px-2.5 py-1 rounded-lg">
                  AI + HUMAN
                </span>
                <Sparkles className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-black text-zinc-950">AI Career Mentor & Human-in-the-Loop</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Didukung Google Gemini 3.5 Pro untuk sintesis reasoning kontekstual 24/7, dengan tetap menempatkan konselor guru/dosen sebagai pengambil keputusan validasi akhir.
              </p>
              <Link
                href="/ai-mentor"
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline pt-2"
              >
                <span>Konsultasi AI Mentor</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. HOW IT WORKS (4 STEPS)                                 */}
      {/* ========================================================= */}
      <section className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold uppercase tracking-wider">
            <span>Alur Sistem Terstruktur</span>
          </div>
          <h2 className="text-3xl font-black text-zinc-950 tracking-tight">
            4 Langkah Mudah Memetakan Kariermu
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Mulai dari evaluasi kepribadian hingga siap terjun ke industri impian.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-red-600/30">01</span>
            <h3 className="font-bold text-base text-zinc-950">Input Minat & Skill</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Jawab inventori Holland RIASEC atau masukkan modal keahlian teknis yang telah Anda pelajari di bangku sekolah / kuliah.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-red-600/30">02</span>
            <h3 className="font-bold text-base text-zinc-950">Analisis Kecocokan</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Algoritma memetakan profil Anda ke 1.016+ okupasi O*NET & KBJI untuk menghasilkan skor kesesuaian dan daftar skill gap.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-red-600/30">03</span>
            <h3 className="font-bold text-base text-zinc-950">Jalankan Rencana IDP</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Ikuti peta jalan 3 fase untuk menutup kesenjangan kompetensi, membangun portofolio proyek, dan mempersiapkan sertifikasi BNSP.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3 relative">
            <span className="text-3xl font-black text-red-600/30">04</span>
            <h3 className="font-bold text-base text-zinc-950">Raih Peluang Industri</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Lamar posisi magang bersertifikat atau rekrutmen industri dengan bukti digital skill passport yang telah divalidasi mentor.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FEATURED OCCUPATIONS PREVIEW                           */}
      {/* ========================================================= */}
      <section className="bg-zinc-50 border-t border-zinc-200/90 py-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">Taksonomi Baku Nasional & Global</span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
                Katalog Profesi Terpopuler
              </h2>
            </div>
            <Link
              href="/career-map"
              className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Jelajahi Seluruh 1.016+ Okupasi</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              href="/career-map/software-engineer"
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  O*NET 15-1252.00
                </span>
                <span className="text-xs font-bold text-emerald-600">High Growth</span>
              </div>
              <h3 className="font-black text-base text-zinc-950 group-hover:text-red-600 transition-colors">
                Software Engineer
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2">
                Merancang, membangun, dan memelihara sistem perangkat lunak berskala tinggi dan arsitektur enterprise.
              </p>
              <div className="pt-1 text-[11px] font-bold text-zinc-700">
                Gaji Pasar: Rp 8.000.000 - Rp 25.000.000
              </div>
            </Link>

            <Link
              href="/career-map/data-scientist"
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  O*NET 15-2051.00
                </span>
                <span className="text-xs font-bold text-emerald-600">Very High</span>
              </div>
              <h3 className="font-black text-base text-zinc-950 group-hover:text-red-600 transition-colors">
                Data Scientist
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2">
                Menganalisis kumpulan data besar, merancang model machine learning prediktif, dan menerjemahkan pola data.
              </p>
              <div className="pt-1 text-[11px] font-bold text-zinc-700">
                Gaji Pasar: Rp 9.000.000 - Rp 28.000.000
              </div>
            </Link>

            <Link
              href="/career-map/ui-ux-designer"
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  O*NET 27-1024.00
                </span>
                <span className="text-xs font-bold text-emerald-600">High Growth</span>
              </div>
              <h3 className="font-black text-base text-zinc-950 group-hover:text-red-600 transition-colors">
                UI/UX Designer
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2">
                Mempelajari kebutuhan pengguna melalui riset, wireframe interaktif, dan desain visual aplikasi intuitif.
              </p>
              <div className="pt-1 text-[11px] font-bold text-zinc-700">
                Gaji Pasar: Rp 7.000.000 - Rp 20.000.000
              </div>
            </Link>

            <Link
              href="/career-map/cybersecurity-analyst"
              className="p-5 rounded-2xl bg-white border border-zinc-200 hover:border-red-600 hover:shadow-md transition-all group space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                  O*NET 15-1212.00
                </span>
                <span className="text-xs font-bold text-emerald-600">Very High</span>
              </div>
              <h3 className="font-black text-base text-zinc-950 group-hover:text-red-600 transition-colors">
                Cybersecurity Analyst
              </h3>
              <p className="text-xs text-zinc-500 line-clamp-2">
                Melindungi infrastruktur digital dari ancaman siber, memantau kerentanan jaringan, dan menerapkan standar enkripsi.
              </p>
              <div className="pt-1 text-[11px] font-bold text-zinc-700">
                Gaji Pasar: Rp 8.500.000 - Rp 26.000.000
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CALL TO ACTION BANNER                                  */}
      {/* ========================================================= */}
      <section className="max-w-[1720px] mx-auto px-3.5 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 sm:p-12 text-white shadow-xl shadow-red-500/20 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Siap Memetakan Kariermu Secara Terukur?
            </h2>
            <p className="text-xs sm:text-sm text-red-100 leading-relaxed font-medium">
              Bergabunglah dengan ribuan talenta vokasi dan mahasiswa yang telah menemukan arah karier terbaik berbasis data riil O*NET dan KBJI.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <Link
              href="/assessments"
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-red-600 font-black text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Mulai Asesmen Minat (RIASEC)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/input"
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3.5 rounded-2xl bg-red-800/60 hover:bg-red-800 text-white font-bold text-sm border border-red-400/40 transition-all flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              <span>Simulasi Cepat</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto justify-center px-6 sm:px-7 py-3.5 rounded-2xl bg-zinc-950/40 hover:bg-zinc-950/60 text-white font-bold text-sm border border-white/20 transition-all"
            >
              <span>Masuk Akun</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
