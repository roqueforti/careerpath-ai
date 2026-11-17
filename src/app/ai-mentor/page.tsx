"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  User,
  Bot,
  Compass,
  Target,
  FileCheck,
  ShieldCheck,
  RotateCcw,
  Terminal,
  Zap,
  Radio,
  Copy,
  Check,
  Flame,
  ArrowRight,
  Cpu,
} from "lucide-react";

interface Message {
  id: string;
  senderRole: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt?: string;
}

export default function AiMentorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      senderRole: "ASSISTANT",
      content: `Halo! Saya CareerPath AI Neural Mentor.

Saya telah terhubung dengan data asesmen minat RIASEC, peta karier target, dan progres Individual Development Plan (IDP) milikmu.

Saya siap mendampingimu untuk:
1. Menemukan celah kesenjangan kompetensi (skill gap) dan solusinya.
2. Menyusun strategi karya portofolio berstandar industri.
3. Simulasi wawancara kerja berbasis metode STAR.
4. Memberi rekomendasi peluang magang & beasiswa yang paling realistis.

Apa topik akselerasi karier yang ingin kita bahas sekarang?`,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerTag, setProviderTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const soundboardPrompts = [
    {
      code: "PAD // 01",
      title: "Audit Skill Gap",
      desc: "Analisis gap kompetensi terhadap target profesi saat ini",
      prompt: "Analisis skill gap saya untuk target profesi saat ini dan prioritaskan 3 keahlian utama yang harus dipelajari.",
    },
    {
      code: "PAD // 02",
      title: "Sprint IDP 30 Hari",
      desc: "Draft 3 aktivitas konkret IDP beserta indikator karya",
      prompt: "Bantu susun 3 aktivitas konkret untuk IDP saya selama 30 hari ke depan beserta indikator bukti karya portofolio.",
    },
    {
      code: "PAD // 03",
      title: "Portfolio Strategy",
      desc: "Strategi bukti karya dan validasi kompetensi L2/L3",
      prompt: "Bagaimana cara menyusun bukti karya portofolio GitHub/artefak agar mudah diverifikasi mentor industri?",
    },
    {
      code: "PAD // 04",
      title: "Mock Interview STAR",
      desc: "Simulasi pertanyaan teknis & perilaku dunia kerja",
      prompt: "Berikan 2 contoh pertanyaan wawancara kerja teknis berbasis metode STAR untuk posisi impian saya.",
    },
  ];

  async function handleSendMessage(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      senderRole: "USER",
      content: text.trim(),
      createdAt: timeString,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });

      if (res.ok) {
        const json = await res.json();
        setProviderTag(json.provider);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            senderRole: "ASSISTANT",
            content: json.response,
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            senderRole: "ASSISTANT",
            content: "Terjadi kendala saat menghubungkan AI copilot. Silakan coba kembali sesaat lagi.",
            createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          senderRole: "ASSISTANT",
          content: "Koneksi terputus ke server lokal. Pastikan backend aktif.",
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleResetChat() {
    setMessages([
      {
        id: "initial-welcome",
        senderRole: "ASSISTANT",
        content: "Sesi percakapan telah direset. Ada hal baru yang ingin kamu diskusikan seputar rencana kariermu?",
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 selection:bg-red-600 selection:text-white pb-16 font-sans">
      {/* 1. Kinetic Top Marquee Ticker */}
      <div className="border-b border-stone-200 bg-white overflow-hidden py-2.5">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-10 font-mono text-[11px] font-bold uppercase tracking-widest text-stone-600 items-center">
          <span className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-red-600 animate-pulse" /> AI NEURAL COPILOT // CONTEXT ENGINE ACTIVE
          </span>
          <span className="text-stone-300">/</span>
          <span>ETHICAL CAREER ADVICE // ZERO FABRICATION GUARANTEE</span>
          <span className="text-stone-300">/</span>
          <span className="text-red-600 font-bold">HOLLAND RIASEC PSYCHOMETRIC GROUNDING</span>
          <span className="text-stone-300">/</span>
          <span>STAR METHOD INTERVIEW DRILLS</span>
          <span className="text-stone-300">/</span>
          <span>AUTOMATED SPRINT ROADMAPPING</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        {/* 2. Studio Master Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Telemetry & Soundboard Trigger Pads */}
          <div className="lg:col-span-4 space-y-6">
            {/* Studio Identity Card */}
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="font-mono text-[10px] font-black uppercase tracking-widest bg-stone-900 text-white px-2.5 py-1 rounded">
                  STUDIO // AI LAB
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ONLINE
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-stone-950">
                  CAREER COPILOT.
                </h2>
                <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                  Asisten bimbingan berbasis kecerdasan kontekstual. Membaca rekam jejak asesmen, progres IDP, dan portofoliomu.
                </p>
              </div>

              {/* Engine Status Pill */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 font-mono text-xs flex items-center justify-between">
                <span className="text-stone-500 text-[10px] uppercase font-bold">MODEL ENGINE:</span>
                <span className="font-black text-red-600">
                  {providerTag || "GEMINI 2.5 FLASH"}
                </span>
              </div>

              <button
                onClick={handleResetChat}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-2 font-mono text-xs font-bold text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> RESET SESI DISKUSI
              </button>
            </div>

            {/* Soundboard Pads (Synthesizer Style Trigger Matrix) */}
            <div className="rounded-3xl border border-stone-200/90 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <span className="font-mono text-[10px] font-black uppercase tracking-wider text-stone-400">
                  PROMPT SOUNDBOARD // QUICK PADS
                </span>
                <Zap className="h-3.5 w-3.5 text-red-600" />
              </div>

              <div className="space-y-2.5">
                {soundboardPrompts.map((pad) => (
                  <button
                    key={pad.code}
                    onClick={() => handleSendMessage(pad.prompt)}
                    disabled={loading}
                    className="w-full text-left p-3 rounded-2xl border border-stone-200/80 bg-stone-50/70 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] font-black tracking-widest text-stone-400 group-hover:text-red-400">
                        {pad.code}
                      </span>
                      <ArrowRight className="h-3 w-3 text-stone-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="font-bold text-xs text-stone-900 group-hover:text-white">
                      {pad.title}
                    </div>
                    <div className="text-[11px] text-stone-500 group-hover:text-stone-300 line-clamp-1 mt-0.5">
                      {pad.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ethical AI Stamp */}
            <div className="rounded-2xl bg-stone-100/80 p-4 border border-stone-200 text-xs text-stone-600 space-y-1">
              <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-stone-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                VERIFIED CAREER ETHICS
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Sistem tidak mendiagnosis klinis, tidak memalsukan kualifikasi portofolio, dan berfokus pada langkah aksi konkret mahasiswa.
              </p>
            </div>
          </div>

          {/* Right Column: Neural Terminal & Conversation Console */}
          <div className="lg:col-span-8 flex flex-col h-[750px] rounded-3xl border border-stone-200/90 bg-white shadow-lg overflow-hidden">
            {/* Terminal Header */}
            <div className="p-4 sm:px-6 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="font-mono text-xs font-black uppercase tracking-wider text-stone-900 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-red-600" />
                  TERMINAL // CAREER MENTOR FEED
                </div>
              </div>

              <span className="font-mono text-[10px] text-stone-400 font-bold">
                ENCRYPTED TLS // LOCAL DB SYNC
              </span>
            </div>

            {/* Terminal Messages Feed */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-[#fafafa]">
              {messages.map((m) => {
                const isUser = m.senderRole === "USER";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar Badge */}
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold shadow-xs ${
                        isUser
                          ? "bg-red-600 text-white"
                          : "bg-stone-950 text-white"
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-red-500" />}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-5 shadow-2xs space-y-2 relative group ${
                        isUser
                          ? "bg-stone-950 text-white rounded-tr-xs"
                          : "bg-white text-stone-900 border border-stone-200/90 rounded-tl-xs"
                      }`}
                    >
                      {/* Bubble Header */}
                      <div className="flex items-center justify-between gap-4 font-mono text-[10px] pb-1 border-b border-white/10 dark:border-stone-100">
                        <span
                          className={`font-black uppercase tracking-wider ${
                            isUser ? "text-stone-400" : "text-red-600"
                          }`}
                        >
                          {isUser ? "KAMU (STUDENT)" : "CAREERPATH AI COPILOT"}
                        </span>
                        <div className="flex items-center gap-2">
                          {m.createdAt && (
                            <span className={isUser ? "text-stone-500" : "text-stone-400"}>
                              {m.createdAt}
                            </span>
                          )}
                          {!isUser && (
                            <button
                              onClick={() => handleCopy(m.id, m.content)}
                              title="Salin jawaban"
                              className="text-stone-400 hover:text-stone-900 transition-colors"
                            >
                              {copiedId === m.id ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bubble Text */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Loading State Animation */}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-red-500 animate-spin" />
                  </div>
                  <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-2 max-w-sm">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-red-600 font-bold uppercase">
                      <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                      GENERATING CAREER INFERENCE...
                    </div>
                    <p className="text-xs text-stone-500">
                      Mengekstrak korelasi RIASEC dan kurikulum target profesi...
                    </p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Console */}
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 rounded-full border border-stone-300 bg-stone-50/60 p-2 pl-5 focus-within:border-stone-900 focus-within:bg-white transition-all shadow-inner"
              >
                <input
                  type="text"
                  placeholder="Ketik pertanyaan akselerasi karier, interview prep, atau strategi karya..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none font-medium"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="h-10 px-5 rounded-full bg-red-600 text-white font-mono text-xs font-black uppercase tracking-wider shadow-sm hover:bg-red-700 disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>KIRIM</span>
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-stone-400 px-2">
                <span>TEKAN ENTER ↵ UNTUK MENGIRIM</span>
                <span>CAREERPATH AI NEURAL ENGINE V2.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

