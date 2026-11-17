import React from "react";
import { Compass, Target, TrendingUp, CheckCircle2 } from "lucide-react";

export function MaturityBadge({ stage }: { stage: string }) {
  const s = stage?.toUpperCase() || "EXPLORE";

  if (s === "READY" || s === "L4" || s === "L4: READY") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        L4: READY
      </span>
    );
  }

  if (s === "DEVELOP" || s === "L3" || s === "L3: DEVELOP") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300/80 dark:border-red-900">
        <TrendingUp className="h-3.5 w-3.5 text-red-600" />
        L3: DEVELOP
      </span>
    );
  }

  if (s === "PLAN" || s === "L2" || s === "L2: PLAN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700">
        <Target className="h-3.5 w-3.5 text-stone-700 dark:text-stone-300" />
        L2: PLAN
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
      <Compass className="h-3.5 w-3.5 text-amber-600" />
      L1: EXPLORE
    </span>
  );
}
