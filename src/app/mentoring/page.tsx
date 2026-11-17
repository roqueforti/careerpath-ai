"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Plus,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  Award,
  UserCheck,
  X,
  Radio,
  Zap,
  ArrowRight,
  Check,
  Briefcase,
} from "lucide-react";
import { MaturityBadge } from "@/components/MaturityBadge";

interface Mentee {
  id: string;
  name: string;
  email: string;
  educationLevel: string;
  careerMaturity: string;
  targetCareerTitle?: string | null;
  activeIdpTitle?: string | null;
  idpProgressPercentage?: number;
  pendingEvidenceCount: number;
}

interface MentoringTask {
  id: string;
  mentorId: string;
  mentorName?: string;
  menteeId: string;
  menteeName?: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "COMPLETED" | "REJECTED";
}

interface Discussion {
  id: string;
  title: string;
  targetType: string;
  comments: Array<{
    id: string;
    userName: string;
    userRole: string;
    message: string;
    createdAt: string;
  }>;
}

export default function MentoringPage() {
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(null);
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [tasks, setTasks] = useState<MentoringTask[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  // New Task Modal State (Mentor)
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMenteeId, setSelectedMenteeId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("2026-05-30");

  // Discussion reply state
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  useEffect(() => {
    loadMentoringData();
  }, []);

  async function loadMentoringData() {
    setLoading(true);
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meJson = await meRes.json();
        setCurrentUser(meJson.user);

        if (meJson.user?.role === "MENTOR") {
          const [mRes, tRes, dRes] = await Promise.all([
            fetch("/api/mentor/mentees"),
            fetch("/api/mentor/tasks"),
            fetch("/api/mentor/discussions"),
          ]);
          if (mRes.ok) {
            const mJson = await mRes.json();
            setMentees(mJson.mentees || []);
            if (mJson.mentees?.length > 0) setSelectedMenteeId(mJson.mentees[0].id);
          }
          if (tRes.ok) {
            const tJson = await tRes.json();
            setTasks(tJson.tasks || []);
          }
          if (dRes.ok) {
            const dJson = await dRes.json();
            setDiscussions(dJson.discussions || []);
          }
        } else {
          // Student view
          const [tRes, dRes] = await Promise.all([
            fetch("/api/mentor/tasks"),
            fetch("/api/mentor/discussions"),
          ]);
          if (tRes.ok) {
            const tJson = await tRes.json();
            setTasks(tJson.tasks || []);
          }
          if (dRes.ok) {
            const dJson = await dRes.json();
            setDiscussions(dJson.discussions || []);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load mentoring data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask() {
    if (!selectedMenteeId || !taskTitle || !taskDesc) return;
    try {
      const res = await fetch("/api/mentor/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menteeId: selectedMenteeId,
          title: taskTitle,
          description: taskDesc,
          dueDate: taskDueDate,
        }),
      });
      if (res.ok) {
        setShowTaskModal(false);
        setTaskTitle("");
        setTaskDesc("");
        await loadMentoringData();
      }
    } catch (err) {
      console.error("Create task error:", err);
    }
  }

  async function handleUpdateTaskStatus(taskId: string, newStatus: MentoringTask["status"]) {
    try {
      const res = await fetch("/api/mentor/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
      if (res.ok) {
        await loadMentoringData();
      }
    } catch (err) {
      console.error("Update task status error:", err);
    }
  }

  async function handleSendComment(discussionId: string) {
    const msg = commentInput[discussionId];
    if (!msg || !msg.trim()) return;

    try {
      const res = await fetch("/api/mentor/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionId, message: msg.trim() }),
      });
      if (res.ok) {
        setCommentInput((prev) => ({ ...prev, [discussionId]: "" }));
        await loadMentoringData();
      }
    } catch (err) {
      console.error("Send comment error:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
          <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-bold">
            Synchronizing Mentoring Node...
          </span>
        </div>
      </div>
    );
  }

  const isMentor = currentUser?.role === "MENTOR";

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 selection:bg-red-600 selection:text-white pb-24 font-sans">
      {/* 1. Kinetic Top Marquee Ticker */}
      <div className="border-b border-stone-200 bg-white overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-[marquee_26s_linear_infinite] gap-10 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-600 items-center">
          <span className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-red-600 animate-pulse" /> HUMAN-IN-THE-LOOP MENTORING // VERIFIED PRACTITIONER NETWORK
          </span>
          <span className="text-stone-300">/</span>
          <span>ASYNCHRONOUS EVIDENCE REVIEW // LEVEL 3 VALIDATION</span>
          <span className="text-stone-300">/</span>
          <span className="text-red-600 font-black">SKILL PASSPORT ENDORSEMENT ENGINE</span>
          <span className="text-stone-300">/</span>
          <span>ACADEMIC COUNSELOR & BK INTEGRATION</span>
          <span className="text-stone-300">/</span>
          <span>AUTHENTIC PROJECT CRITIQUE</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* 2. Asymmetrical Editorial Masthead */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Bold Typography & Mentoring Mission */}
          <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200 pb-8 lg:pb-0 lg:pr-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-stone-900 text-white px-2.5 py-1 rounded">
                  GUIDANCE // {isMentor ? "MENTOR DESK" : "STUDENT PASS"}
                </span>
                <span className="font-mono text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                  HUMAN VERIFICATION
                </span>
                <span className="font-mono text-[10px] font-bold text-stone-500 px-2">
                  L3 ENDORSEMENT
                </span>
              </div>

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-stone-950 leading-[0.92]">
                  {isMentor ? "MENTOR" : "HUMAN"} <br />
                  <span className="text-red-600 underline decoration-red-200 underline-offset-8">
                    {isMentor ? "STUDIO." : "MENTOR."}
                  </span>
                </h1>
                <p className="mt-5 text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
                  {isMentor
                    ? "Ruang kerja terpadu mentor untuk meninjau penugasan, membimbing mahasiswa asuhan, dan mengesahkan portofolio Skill Passport."
                    : "Dapatkan arahan langsung, review kode, dan validasi portofolio dari dosen pembimbing karier dan praktisi industri terverifikasi."}
                </p>
              </div>

              {/* Quick Info HUD */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-bold">
                    <UserCheck className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-stone-400 block">
                      STATUS BIMBINGAN
                    </span>
                    <span className="font-bold text-xs text-stone-950">
                      {isMentor ? `Aktif Membimbing ${mentees.length} Mahasiswa` : "Sarah Wulandari, M.Psi., Psikolog (Konselor Aktif)"}
                    </span>
                  </div>
                </div>

                {isMentor && (
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-white shadow-sm hover:bg-red-700 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> TUGAS BARU
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Youth Mentoring Photography Banner */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-xl group">
              <img
                src="/students_collaborating_floor.jpg"
                alt="Young university students consulting with mentor"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>

              {/* Floating Top Pill */}
              <div className="absolute top-4 left-4 bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white font-mono text-[11px] font-bold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE MENTORSHIP SESSION
              </div>

              {/* Floating Bottom Telemetry Console */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-lg flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                    TASKS IN PIPELINE
                  </span>
                  <div className="text-2xl font-black text-stone-950">
                    {tasks.length} PENUGASAN AKTIF
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> L3 VERIFIED
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Main Workspace: Tasks, Mentees & Threads */}
        <div className="space-y-10">
          {isMentor && (
            /* MENTOR ROSTER */
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-red-600" />
                  <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                    DAFTAR MENTEE TERDAFTAR ({mentees.length})
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-stone-500">
                  PORTFOLIO COHORT MONITORING
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mentees.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-stone-400">
                          {m.educationLevel}
                        </span>
                        <MaturityBadge stage={m.careerMaturity} />
                      </div>

                      <div>
                        <h3 className="text-lg font-black tracking-tight text-stone-950">
                          {m.name}
                        </h3>
                        <p className="text-xs text-stone-400 font-mono">{m.email}</p>
                      </div>

                      <div className="rounded-2xl bg-stone-50 p-3.5 text-xs border border-stone-200/80 space-y-1">
                        <p className="text-stone-600">
                          <span className="font-bold text-stone-950">Target Karier:</span>{" "}
                          {m.targetCareerTitle || "Belum dipilih"}
                        </p>
                        {m.activeIdpTitle && (
                          <p className="text-stone-600">
                            <span className="font-bold text-stone-950">Progres IDP:</span>{" "}
                            {m.idpProgressPercentage}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-bold flex items-center gap-1.5">
                        {m.pendingEvidenceCount > 0 ? (
                          <>
                            <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                            <span className="text-red-600">{m.pendingEvidenceCount} Bukti Pending</span>
                          </>
                        ) : (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Terverifikasi
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedMenteeId(m.id);
                          setShowTaskModal(true);
                        }}
                        className="font-mono text-xs font-bold text-stone-900 hover:text-red-600 cursor-pointer"
                      >
                        Beri Tugas →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TASKS PIPELINE */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                  TUGAS MENTORING ({tasks.length})
                </h2>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                ACTIONABLE DELIVERABLES
              </span>
            </div>

            <div className="space-y-3">
              {tasks.map((t, idx) => (
                <div
                  key={t.id}
                  className="rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[10px] font-black uppercase text-stone-400">
                        TASK // #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          t.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                            : t.status === "SUBMITTED"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-amber-100 text-amber-900 border-amber-300"
                        }`}
                      >
                        {t.status}
                      </span>
                      <span className="font-mono text-[10px] text-stone-500">
                        TENGGAT: {t.dueDate}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-stone-950">{t.title}</h3>
                    <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">{t.description}</p>
                    {isMentor && (
                      <p className="font-mono text-[11px] text-stone-500">
                        MENTEE: <span className="font-bold text-stone-900">{t.menteeName}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                    {isMentor ? (
                      t.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleUpdateTaskStatus(t.id, "COMPLETED")}
                          className="rounded-full bg-emerald-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer"
                        >
                          Tandai Selesai
                        </button>
                      )
                    ) : (
                      <>
                        {t.status === "PENDING" && (
                          <button
                            onClick={() => handleUpdateTaskStatus(t.id, "SUBMITTED")}
                            className="rounded-full bg-red-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
                          >
                            KIRIM HASIL TUGAS
                          </button>
                        )}
                        {t.status === "SUBMITTED" && (
                          <span className="font-mono text-xs text-stone-500 font-bold bg-stone-100 px-3 py-1.5 rounded-full">
                            MENUNGGU REVIEW
                          </span>
                        )}
                        {t.status === "COMPLETED" && (
                          <span className="font-mono text-xs text-emerald-600 font-black flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="h-4 w-4" /> SELESAI
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-stone-200 p-8 text-center text-xs font-mono text-stone-400">
                  BELUM ADA TUGAS MENTORING AKTIF
                </div>
              )}
            </div>
          </section>

          {/* ASYNCHRONOUS COLLABORATIVE THREADS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-red-600" />
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-stone-950">
                  DISKUSI & FEEDBACK ASINKRON ({discussions.length})
                </h2>
              </div>
              <span className="font-mono text-[11px] text-stone-500">
                1-ON-1 DIALOGUE FEED
              </span>
            </div>

            <div className="space-y-4">
              {discussions.map((d) => (
                <div
                  key={d.id}
                  className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="font-black text-sm text-stone-950">{d.title}</span>
                    <span className="font-mono text-[10px] font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
                      TOPIK: {d.targetType}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {d.comments.map((c) => (
                      <div key={c.id} className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-900 font-mono">
                            {c.userName} ({c.userRole})
                          </span>
                          <span className="font-mono text-[10px] text-stone-400">
                            {new Date(c.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        <p className="text-stone-700 leading-relaxed">{c.message}</p>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input Box */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Tulis tanggapan atau pertanyaan asinkron..."
                      value={commentInput[d.id] || ""}
                      onChange={(e) => setCommentInput({ ...commentInput, [d.id]: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && handleSendComment(d.id)}
                      className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-red-600 focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendComment(d.id)}
                      className="rounded-full bg-red-600 px-6 py-2.5 font-mono text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      KIRIM
                    </button>
                  </div>
                </div>
              ))}

              {discussions.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed border-stone-200 p-8 text-center text-xs font-mono text-stone-400">
                  BELUM ADA UTAS DISKUSI TERBUKA
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 sm:p-8 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                <h3 className="font-mono text-sm font-black uppercase tracking-wider text-stone-950">
                  BERI TUGAS MENTORING BARU
                </h3>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="font-mono text-xs text-stone-400 hover:text-stone-900"
              >
                TUTUP [ESC]
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  PILIH MENTEE TUJUAN
                </label>
                <select
                  value={selectedMenteeId}
                  onChange={(e) => setSelectedMenteeId(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs bg-stone-50 focus:border-red-600 focus:outline-none"
                >
                  {mentees.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.educationLevel} - {m.careerMaturity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  JUDUL TUGAS
                </label>
                <input
                  type="text"
                  placeholder="Misal: Perbaiki Dokumentasi Portofolio Proyek"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs bg-stone-50 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  PETUNJUK / INSTRUKSI ARAHAN
                </label>
                <textarea
                  placeholder="Rincian instruksi arahan mentoring..."
                  rows={3}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs bg-stone-50 focus:border-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase font-bold text-stone-700 block mb-1">
                  TENGGAT WAKTU
                </label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full rounded-2xl border border-stone-200 p-3 text-xs bg-stone-50 focus:border-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowTaskModal(false)}
                className="rounded-full border border-stone-200 px-4 py-2 font-mono text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                BATAL
              </button>
              <button
                onClick={handleCreateTask}
                className="rounded-full bg-red-600 px-5 py-2 font-mono text-xs font-bold text-white hover:bg-red-700 cursor-pointer"
              >
                TUGASKAN KE MENTEE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

