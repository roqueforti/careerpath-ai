"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  UserCheck,
  BarChart3,
  Plus,
} from "lucide-react";
import { UserActivityLineChart, CareerInterestDonutChart } from "@/components/AdminAnalyticsCharts";

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
    <div className="w-full space-y-6">
      
      {/* 1. Main Admin Overview Card Matching View 4 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Ringkasan data dan aktivitas platform CareerPath AI
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl border border-[#e8ebf8] bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#5452e6] ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Perbarui</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                👥
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Pengguna</span>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalUsers ? stats.totalUsers.toLocaleString() : "12.480"}
            </div>
            <div className="text-xs font-bold text-emerald-600">&uarr; 12% dari bulan lalu</div>
          </div>

          <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
                👤
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mentor Aktif</span>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalMentors ? stats.totalMentors : "42"}
            </div>
            <div className="text-xs font-bold text-emerald-600">&uarr; 8% pembimbing terverifikasi</div>
          </div>

          <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">
                📊
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aktivitas Platform</span>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-tight">86%</div>
            <div className="text-xs font-bold text-emerald-600">&uarr; 5% tingkat interaksi</div>
          </div>

          <div className="bg-[#fafbff] rounded-2xl p-4 sm:p-5 border border-[#e8ebf8] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-bold">
                💼
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lowongan Aktif</span>
            </div>
            <div className="text-2xl font-black text-slate-900 leading-tight">
              {stats?.totalOpportunities ? stats.totalOpportunities : "128"}
            </div>
            <div className="text-xs font-bold text-emerald-600">&uarr; 10% terkurasi nasional</div>
          </div>

        </div>

        {/* 2 Middle Charts: Tren Aktivitas & Distribusi Minat */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Tren Aktivitas Pengguna (Line Chart) */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Tren Aktivitas Pengguna
            </span>
            <UserActivityLineChart />
          </div>

          {/* Distribusi Minat Karier (Donut Chart) */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              Distribusi Minat Karier
            </span>
            <div className="py-2">
              <CareerInterestDonutChart />
            </div>
          </div>

        </div>

        {/* Bottom Row: Quick Management & System Update */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Manajemen Cepat */}
          <div className="bg-[#fafbff] rounded-2xl p-5 border border-[#e8ebf8] space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Manajemen Cepat</span>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="#audit"
                className="p-3 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#5452e6]" />
                <span>Tambah Pengguna</span>
              </a>

              <a
                href="#audit"
                className="p-3 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
              >
                <UserCheck className="w-4 h-4 text-[#5452e6]" />
                <span>Kelola Mentor</span>
              </a>

              <Link
                href="/assessments"
                className="p-3 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-[#5452e6]" />
                <span>Kelola Konten</span>
              </Link>

              <a
                href="#audit"
                className="p-3 rounded-xl bg-white border border-[#e8ebf8] text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-all shadow-2xs"
              >
                <BarChart3 className="w-4 h-4 text-[#5452e6]" />
                <span>Lihat Laporan</span>
              </a>
            </div>
          </div>

          {/* Update Sistem with Mentor Illustration */}
          <div className="bg-gradient-to-r from-purple-50/80 via-blue-50/70 to-slate-50 rounded-2xl p-5 border border-purple-200/50 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5452e6]">
                <span>📢</span>
                <span>Update Sistem</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Versi 1.0.0 telah dirilis dengan fitur analitik yang lebih lengkap, skoring psikometri Holland terverifikasi, dan koneksi Supabase PostgreSQL.
              </p>
              <a href="#audit" className="text-xs font-bold text-[#5452e6] hover:underline inline-block pt-1">
                Lihat Detail ➔
              </a>
            </div>

            <div className="w-24 h-28 relative shrink-0">
              <img
                src="/illustrations/mentor-woman.jpg"
                alt="System update advisor"
                className="w-full h-full object-contain rounded-xl drop-shadow-sm"
              />
            </div>
          </div>

        </div>

      </div>

      {/* 2. Audit Logs & Data Integrity Table */}
      <div id="audit" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8ebf8] shadow-[0_8px_30px_rgb(84,82,230,0.05)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Log Audit Sistem &amp; Keamanan</h3>
            <p className="text-xs text-slate-500 font-medium">Rekaman operasi mutasi data dan otorisasi RBAC (Immutable Audit Trail)</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari aksi atau user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5452e6]/20 focus:border-[#5452e6]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Pengguna</th>
                <th className="py-3 px-3">Aksi</th>
                <th className="py-3 px-3">Sumber Daya</th>
                <th className="py-3 px-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Tidak ada catatan log yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {log.user_name || log.user_email || "System"}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#5452e6] text-[10px] font-black">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{log.resource}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">{log.ip_address || "127.0.0.1"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
