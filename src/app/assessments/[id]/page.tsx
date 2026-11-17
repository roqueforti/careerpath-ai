"use client";

import React, { useState, useEffect, use, Suspense } from "react";
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

function AssessmentTakeContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const assessmentId = resolvedParams.id;

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
          {assessment?.title || "Instrumen Asesmen Minat Karier"}
        </h1>
        <div className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-4 text-xs text-stone-600 dark:border-stone-800 dark:bg-stone-850 dark:text-stone-300 flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-stone-950 dark:text-white">Petunjuk Pengerjaan:</span>{" "}
            {assessment?.instruction || "Pilih opsi yang paling menggambarkan minat pribadimu secara jujur. Tidak ada jawaban benar atau salah."}
          </div>
        </div>
      </div>

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md p-3 rounded-full border border-stone-200/90 shadow-2xs dark:bg-stone-900/95 dark:border-stone-800">
        <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-red-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-5">
        {questions.map((q, idx) => {
          const selected = answers[q.id]?.value;
          return (
            <div
              key={q.id}
              className={`rounded-[28px] border p-6 sm:p-7 transition-all ${
                selected
                  ? "border-stone-950/40 bg-white shadow-xs dark:border-stone-700 dark:bg-stone-900"
                  : "border-stone-200/90 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors ${
                    selected
                      ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
                      : "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                  }`}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-stone-950 dark:text-white leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* 1-5 Likert Options */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                    {q.options.map((opt) => {
                      const isSelected = selected === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectOption(q.id, opt.value, opt.score)}
                          className={`flex flex-col items-center justify-center rounded-2xl p-3 text-center text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-red-600 bg-red-600 text-white shadow-xs font-bold"
                              : "border-stone-200 bg-stone-50/70 text-stone-700 hover:border-stone-900 hover:bg-white dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-750"
                          }`}
                        >
                          <span className="text-base font-black mb-0.5">{opt.score}</span>
                          <span className="text-[10px] leading-tight line-clamp-1">{opt.label.split("-")[1] || opt.label}</span>
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
      <div className="pt-6 border-t border-stone-200/90 dark:border-stone-800 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < questions.length}
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-8 py-3 text-xs font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Menghitung Skor..." : "Kirim Jawaban & Lihat Laporan"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AssessmentTakePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
          <p className="text-xs font-semibold tracking-tight text-stone-500">Memuat lembar asesmen...</p>
        </div>
      }
    >
      <AssessmentTakeContent params={params} />
    </Suspense>
  );
}
