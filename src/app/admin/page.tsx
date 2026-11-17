"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  Briefcase,
  BookOpen,
  Compass,
  FileCheck2,
  Bot,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Building2,
  Database,
  Key,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalMentors: number;
  totalInstitutions: number;
  totalOccupations: number;
  totalCompetencies: number;
  totalAssessments: number;
  totalOpportunities: number;
  totalIdps: number;
  totalEvidences: number;
  totalAiMessages: number;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  action: string;
  resource: string;
  resource_id: string | null;
  details_json: string | null;
  ip_address: string | null;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function loadData() {
    setIsRefreshing(true);
    try {
      const [statsRes, logsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/audit-logs"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      }

      if (logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.success) {
          setLogs(logsData.logs || []);
        }
      }
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.action && log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.resource && log.resource.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.user_name && log.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.user_email && log.user_email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesAction =
      selectedAction === "ALL" || log.action.toUpperCase().includes(selectedAction);

    return matchesSearch && matchesAction;
  });

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 font-sans">
      {/* Top Header Full-Width */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-zinc-200/90 pb-6 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200/80 bg-red-50/80 px-3 py-1 text-xs font-bold text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300 mb-2.5">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            Platform Admin Control Center · Tata Kelola & Keamanan Sistem
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            Pusat Kendali & Audit Integritas Data Nasional
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 max-w-4xl leading-relaxed dark:text-zinc-400">
            Pemantauan kepatuhan privasi, otorisasi RBAC berjenjang, rekam jejak operasi sistem immutable, dan manajemen katalog profesi O*NET.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Perbarui Data Real-Time</span>
          </button>
        </div>
      </div>

      {/* System Security & Integrity Grid (3 Cards Full-Width) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
              Otorisasi Server-Side (RBAC Least-Privilege)
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed dark:text-zinc-400">
              Penegakan izin akses di layer API route dan relasi PostgreSQL. Dosen & Mentor hanya memiliki hak baca pada mentee yang ditugaskan secara sah.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex items-start gap-4">
          <div className="rounded-xl bg-zinc-100 p-3 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 shrink-0">
            <Database className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
              Penyimpanan Relasional Persisten
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed dark:text-zinc-400">
              34 tabel PostgreSQL ternormalisasi dengan foreign keys, audit logs terenkripsi, dan akun mahasiswa terdaftar.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
              AI Inferensi Multi-Provider & Fallback
            </h4>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed dark:text-zinc-400">
              Integrasi langsung Google Gemini 3.5 Flash dengan sistem fail-safe diagnostik deterministik untuk menjamin ketersediaan 99.9% tanpa downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Quantitative Metric Grid (6 Large Metrics Across Widescreen) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Pengguna</span>
            <Users className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalUsers : 7}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            {stats ? stats.totalStudents : 4} Siswa · {stats ? stats.totalMentors : 1} Mentor
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Katalog Profesi</span>
            <Compass className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalOccupations : 10}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            {stats ? stats.totalCompetencies : 15} Kompetensi O*NET
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Asesmen Aktif</span>
            <BookOpen className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalAssessments : 1}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Holland RIASEC v1.0</div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Peluang Loker</span>
            <Briefcase className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalOpportunities : 6}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Lowongan Industri, Magang & Beasiswa</div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">IDP & Bukti</span>
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalIdps : 4}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">
            {stats ? stats.totalEvidences : 4} Evidence Aktif
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Interaksi AI</span>
            <Bot className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white">
            {stats ? stats.totalAiMessages : 8}
          </div>
          <div className="mt-1 text-[11px] text-zinc-400">Sesi AI Mentor Sukses</div>
        </div>
      </div>

      {/* Catalog & Module Governance Links (4 Widescreen Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/career-map"
          className="group rounded-2xl border border-zinc-200/90 bg-white p-5 hover:border-red-600 hover:shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Compass className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Katalog Profesi & Jalur O*NET</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Kelola taksonomi 10 profesi acuan, prasyarat kompetensi, dan matriks level keahlian.
          </p>
        </a>

        <a
          href="/assessments"
          className="group rounded-2xl border border-zinc-200/90 bg-white p-5 hover:border-red-600 hover:shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-900 dark:bg-zinc-800 dark:text-white">
              <BookOpen className="h-4 w-4 text-red-600" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Definisi & Instrumen Asesmen</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Instrumen terstandar Holland RIASEC, 24 item pertanyaan Likert, dan formula pembobotan.
          </p>
        </a>

        <a
          href="/opportunities"
          className="group rounded-2xl border border-zinc-200/90 bg-white p-5 hover:border-red-600 hover:shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Katalog Peluang Magang/Studi</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Kurasi bursa kerja industri, program magang nasional, dan kriteria diagnosis eligibility.
          </p>
        </a>

        <a
          href="/institution"
          className="group rounded-2xl border border-zinc-200/90 bg-white p-5 hover:border-red-600 hover:shadow-sm transition-all dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-900 dark:bg-zinc-800 dark:text-white">
              <Building2 className="h-4 w-4 text-red-600" />
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-sm font-bold text-zinc-950 dark:text-white">Institusi Mitra (Polinema & ITB)</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
            Pantau perguruan tinggi mitra vokasi, keanggotaan mahasiswa, dan penugasan mentor.
          </p>
        </a>
      </div>

      {/* Audit Log Table Section (Full Width Table) */}
      <div className="rounded-2xl border border-zinc-200/90 bg-white shadow-xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-900">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              <h2 className="text-base font-extrabold tracking-tight text-zinc-950 dark:text-white">
                Log Audit & Rekam Jejak Sistem Immutable
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Catatan operasi sensitif (autentikasi, perubahan IDP, asesmen Holland, verifikasi portofolio mentor, seed)
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari aksi, user, resource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-zinc-200 bg-zinc-50/70 py-1.5 pl-8 pr-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-600 focus:bg-white focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-white transition-all w-64"
              />
            </div>

            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50/70 py-1.5 px-3 text-xs font-bold text-zinc-700 focus:border-red-600 focus:outline-hidden dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <option value="ALL">Semua Aksi</option>
              <option value="LOGIN">LOGIN</option>
              <option value="REGISTER">REGISTER</option>
              <option value="ASSESSMENT">ASSESSMENT</option>
              <option value="IDP">IDP</option>
              <option value="EVIDENCE">EVIDENCE</option>
              <option value="MENTOR">MENTOR</option>
              <option value="SEED">SEED</option>
            </select>
          </div>
        </div>

        {/* Table Across Full Width */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50/90 text-zinc-500 border-b border-zinc-200/90 dark:bg-zinc-950/60 dark:border-zinc-800 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-5">Waktu & IP Address</th>
                <th className="py-3 px-5">Aktor / User</th>
                <th className="py-3 px-5">Aksi Sistem</th>
                <th className="py-3 px-5">Resource Target</th>
                <th className="py-3 px-5">Detail Parameter Operasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const actionUpper = log.action.toUpperCase();
                  const badgeColor = actionUpper.includes("LOGIN") || actionUpper.includes("AUTH")
                    ? "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                    : actionUpper.includes("CREATE") || actionUpper.includes("SEED")
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                    : actionUpper.includes("UPDATE") || actionUpper.includes("REVIEW")
                    ? "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800"
                    : "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700";

                  return (
                    <tr key={log.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="font-mono text-[11px] font-bold text-zinc-900 dark:text-white">
                          {new Date(log.created_at).toLocaleString("id-ID", {
                            dateStyle: "short",
                            timeStyle: "medium",
                          })}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {log.ip_address || "127.0.0.1"}
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="font-bold text-zinc-950 dark:text-white">
                          {log.user_name || "System"}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {log.user_email || log.user_id || "SYSTEM_DAEMON"}
                        </div>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <span className="font-mono text-zinc-800 dark:text-zinc-200 font-medium">
                          {log.resource}
                        </span>
                        {log.resource_id && (
                          <div className="text-[10px] text-zinc-400 font-mono">
                            ID: {log.resource_id.substring(0, 16)}...
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-5 max-w-md truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                        {log.details_json ? log.details_json : "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-zinc-400 text-xs">
                    Tidak ada catatan audit yang cocok dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
