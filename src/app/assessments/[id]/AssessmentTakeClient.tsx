"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface QuestionOption {
  label: string;
  value: string;
  score: number;
}

interface Question {
  id: string;
  questionText: string;
  questionType: string;
  dimension: string;
  orderNum: number;
  options: QuestionOption[];
}

interface AssessmentData {
  id: string;
  title: string;
  instruction: string;
  questionCount: number;
}

export default function AssessmentTakeClient({ id }: { id: string }) {
  const router = useRouter();
  const assessmentId = id;

  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, { value: string; score: number }>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch(`/api/assessments/${assessmentId}`);
        if (res.ok) {
          const data = await res.json();
          setAssessment(data.assessment);
          setQuestions(data.questions || []);
        } else {
          setErrorMsg("Gagal memuat pertanyaan asesmen.");
        }
      } catch (err) {
        console.error("Error loading assessment:", err);
        setErrorMsg("Terjadi kesalahan koneksi.");
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, [assessmentId]);

  function handleSelectOption(questionId: string, value: string, score: number) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { value, score },
    }));
  }

  async function handleSubmit() {
    if (questions.length === 0) return;

    const unansweredCount = questions.filter((q) => !answers[q.id]).length;
    if (unansweredCount > 0) {
      setErrorMsg(`Masih ada ${unansweredCount} pertanyaan yang belum dijawab. Harap lengkapi semua nomor.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payloadAnswers = Object.entries(answers).map(([qId, ans]) => ({
        questionId: qId,
        selectedValue: ans.value,
        scoreValue: ans.score,
      }));

      const res = await fetch(`/api/assessments/${assessmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.attemptId) {
        router.push(`/assessment-results/${data.attemptId}`);
      } else {
        setErrorMsg(data.error || "Gagal menyimpan jawaban.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMsg("Terjadi kegagalan jaringan saat mengirim hasil.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
        <p className="text-xs font-semibold tracking-tight text-stone-500">Menyiapkan instrumen asesmen...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-stone-200/90 pb-4 dark:border-stone-800">
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-700 hover:border-stone-900 hover:text-stone-950 transition-colors dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog Asesmen
        </Link>
        <span className="text-xs font-bold text-stone-900 dark:text-white">
          Progres: {answeredCount} dari {questions.length} Soal ({progressPercent}%)
        </span>
      </div>

      {/* Title & Instructions */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950 dark:text-white">
          {assessment?.title || "Instrumen Asesmen"}
        </h1>
        <div className="flex items-start gap-3 rounded-2xl border border-stone-200/90 bg-stone-50 p-4 text-xs font-medium text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
          <HelpCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <div>
            <span className="font-bold text-stone-950 dark:text-white">Petunjuk Pengisian: </span>
            {assessment?.instruction ||
              "Pilih tingkat kesukaan atau kesesuaian pada setiap pernyataan dari skala 1 (Sangat Tidak Suka) hingga 5 (Sangat Suka). Pilihlah yang paling menggambarkan minat pribadimu secara jujur. Tidak ada jawaban benar atau salah."}
          </div>
        </div>
      </div>

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#e8ebf8] shadow-sm">
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#5452e6] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = answers[q.id]?.value;
          return (
            <div
              key={q.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all bg-white ${
                selected
                  ? "border-[#5452e6]/40 shadow-sm"
                  : "border-[#e8ebf8] shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
                    selected
                      ? "bg-[#5452e6] text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* 1-5 Likert Options */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                    {q.options.map((opt) => {
                      const isSelected = selected === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.value, opt.score)}
                          className={`w-9 h-9 rounded-full text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? "bg-[#5452e6] text-white shadow-md shadow-purple-500/30 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          title={opt.label}
                        >
                          {opt.score}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="pt-6 border-t border-[#e8ebf8] flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < questions.length}
          className="inline-flex items-center gap-2 rounded-xl bg-[#5452e6] px-8 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#433ec8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {submitting ? "Menghitung Skor..." : "Kirim Jawaban & Lihat Laporan"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
