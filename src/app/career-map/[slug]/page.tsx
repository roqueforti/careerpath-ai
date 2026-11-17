import React, { Suspense } from "react";
import CareerDetailClient from "./CareerDetailClient";

export default async function OccupationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
          <p className="text-xs font-semibold tracking-tight text-stone-500">
            Memuat rincian peta profesi...
          </p>
        </div>
      }
    >
      <CareerDetailClient slug={slug} />
    </Suspense>
  );
}
