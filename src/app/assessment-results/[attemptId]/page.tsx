"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { Compass, Map, ArrowRight, CheckCircle2, Sparkles, Award, BarChart3, ArrowLeft } from "lucide-react";

interface AssessmentResult {
  id: string;
  attemptId: string;
  assessmentTitle: string;
  summary: string;
  primaryDimension: string;
  secondaryDimension?: string | null;
  dimensions: Record<string, number>;
  interpretation: string;
  nextSteps: string;
  createdAt: string;
}

function AssessmentResultContent({ params }: { params: Promise<{ attemptId: string }> }) {
  const resolvedParams = use(params);
  const attemptId = resolvedParams.attemptId;

  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`/api/assessments/results/${attemptId}`);
        if (res.ok) {
          const data = await res.json();
          setResult(data.result);
        }
      } catch (err) {
        console.error("Error fetching result:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
        <p className="text-xs font-semibold tracking-tight text-stone-500">Menyusun laporan hasil asesmen...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm text-red-600 font-bold">Hasil asesmen tidak ditemukan.</p>
        <Link href="/assessments" className="mt-3 inline-block text-xs font-bold text-stone-900 hover:text-red-600 underline">
          Kembali ke Katalog Asesmen
        </Link>
      </div>
    );
  }

  const dimensionsList = Object.entries(result.dimensions || {});
  const maxScore = 15; // 3 questions per dimension x 5

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3.5 py-1 text-xs font-semibold text-stone-700 hover:border-stone-900 hover:text-stone-950 transition-colors dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog
        </Link>
      </div>

      {/* Top Header Card */}
      <div className="rounded-[28px] border border-stone-800 bg-stone-950 p-8 sm:p-9 text-white shadow-xl dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900 px-3.5 py-1 text-xs font-bold text-stone-300">
              <Award className="h-3.5 w-3.5 text-red-500" /> Hasil Asesmen Terverifikasi
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{result.summary}</h1>
            <p className="text-xs text-stone-400">
              Instrumen: <span className="font-semibold text-white">{result.assessmentTitle}</span> • Selesai pada:{" "}
              {new Date(result.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>

          <div className="flex shrink-0">
            <Link
              href="/career-map"
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
            >
              Lihat Rekomendasi Peta Karier <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Bar Breakdown */}
      <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900 space-y-5">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-red-600" />
            <h2 className="text-base font-black tracking-tight text-stone-950 dark:text-white">
              Distribusi Skor Dimensi Holland RIASEC
            </h2>
          </div>
          <span className="text-xs text-stone-400">Skala 1 - 15</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensionsList.map(([dim, score]) => {
            const percent = Math.min(100, Math.round((Number(score) / maxScore) * 100));
            const isPrimary = dim === result.primaryDimension;
            const isSecondary = dim === result.secondaryDimension;

            return (
              <div
                key={dim}
                className={`rounded-2xl border p-4.5 transition-all ${
                  isPrimary
                    ? "border-stone-950/30 bg-stone-50/80 dark:border-stone-700 dark:bg-stone-850"
                    : isSecondary
                    ? "border-stone-200 bg-stone-50/50 dark:border-stone-800 dark:bg-stone-850/50"
                    : "border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-white">{dim}</span>
                    {isPrimary && (
                      <span className="rounded-full bg-red-600 px-2 py-0.2 text-[9px] font-bold text-white">
                        PRIMER
                      </span>
                    )}
                    {isSecondary && (
                      <span className="rounded-full bg-stone-900 px-2 py-0.2 text-[9px] font-bold text-white dark:bg-stone-700">
                        SEKUNDER
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-stone-950 dark:text-white">
                    {score} / {maxScore} ({percent}%)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPrimary
                        ? "bg-red-600"
                        : isSecondary
                        ? "bg-stone-900 dark:bg-stone-400"
                        : "bg-stone-300 dark:bg-stone-600"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interpretive Analysis & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-4 w-4 text-red-600" />
            <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white">
              Interpretasi Profil Minat
            </h3>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {result.interpretation}
          </p>
        </div>

        <div className="rounded-[28px] border border-stone-200/90 bg-white p-7 shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-red-600" />
              <h3 className="text-base font-black tracking-tight text-stone-950 dark:text-white">
                Rekomendasi Langkah Aksi
              </h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {result.nextSteps}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800">
            <Link
              href="/career-map"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
            >
              Lanjutkan ke Peta Karier (MAP) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
          <p className="text-xs font-semibold tracking-tight text-stone-500">Menyusun laporan hasil asesmen...</p>
        </div>
      }
    >
      <AssessmentResultContent params={params} />
    </Suspense>
  );
}
