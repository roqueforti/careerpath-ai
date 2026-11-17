import React, { Suspense } from "react";
import AssessmentTakeClient from "./AssessmentTakeClient";

export default async function AssessmentTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-red-600 mx-auto mb-3" />
          <p className="text-xs font-semibold tracking-tight text-stone-500">
            Memuat lembar asesmen...
          </p>
        </div>
      }
    >
      <AssessmentTakeClient id={id} />
    </Suspense>
  );
}
