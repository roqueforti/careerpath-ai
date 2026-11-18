"use client";

import React from "react";

export function UserActivityLineChart() {
  // Months: Jan, Feb, Mar, Apr, Mei, Jun
  // Siswa data points (purple): 3.8k, 4.4k, 4.2k, 5.8k, 6.4k, 7.5k
  // Mentor data points (orange): 2.5k, 2.8k, 3.2k, 4.0k, 5.5k, 6.2k
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

  // SVG coordinate bounds: width 500, height 180
  // Y-axis: 0 (bottom = 160) to 8k (top = 30)
  const siswaPts = [
    { x: 40, y: 135 },
    { x: 120, y: 110 },
    { x: 200, y: 118 },
    { x: 280, y: 80 },
    { x: 360, y: 68 },
    { x: 440, y: 35 },
  ];

  const mentorPts = [
    { x: 40, y: 148 },
    { x: 120, y: 140 },
    { x: 200, y: 132 },
    { x: 280, y: 115 },
    { x: 360, y: 88 },
    { x: 440, y: 72 },
  ];

  const siswaPath = siswaPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const mentorPath = mentorPts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const siswaArea = `${siswaPath} L 440 160 L 40 160 Z`;

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs font-semibold text-slate-500 pr-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5452e6]" />
          <span>Siswa</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" />
          <span>Mentor</span>
        </div>
      </div>

      <div className="relative w-full h-[190px]">
        <svg viewBox="0 0 480 185" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="purple_area_grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5452e6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#5452e6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          <line x1="30" y1="40" x2="460" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="80" x2="460" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="120" x2="460" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="160" x2="460" y2="160" stroke="#e2e8f0" strokeWidth="1" />

          {/* Y Axis Labels */}
          <text x="15" y="44" className="text-[9px] fill-slate-400 font-semibold" textAnchor="end">7k</text>
          <text x="15" y="84" className="text-[9px] fill-slate-400 font-semibold" textAnchor="end">5k</text>
          <text x="15" y="124" className="text-[9px] fill-slate-400 font-semibold" textAnchor="end">3k</text>

          {/* Shaded Area for Siswa */}
          <path d={siswaArea} fill="url(#purple_area_grad)" />

          {/* Siswa Curve */}
          <path d={siswaPath} fill="none" stroke="#5452e6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Mentor Curve */}
          <path d={mentorPath} fill="none" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {siswaPts.map((p, i) => (
            <circle key={`s-${i}`} cx={p.x} cy={p.y} r="3.5" fill="#ffffff" stroke="#5452e6" strokeWidth="2" />
          ))}
          {mentorPts.map((p, i) => (
            <circle key={`m-${i}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#fb923c" strokeWidth="1.8" />
          ))}

          {/* X Axis Labels */}
          {months.map((m, i) => (
            <text key={m} x={siswaPts[i].x} y="178" className="text-[10px] fill-slate-400 font-semibold" textAnchor="middle">
              {m}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export function CareerInterestDonutChart() {
  // Categories:
  // Sains & Teknologi: 34% (Purple #5452e6)
  // Sosial & Pendidikan: 28% (Orange #fb923c)
  // Bisnis & Manajemen: 24% (Cyan #2dd4bf)
  // Seni & Kreatif: 14% (Yellow #facc15)

  const items = [
    { label: "Sains & Teknologi", pct: 34, color: "#5452e6" },
    { label: "Sosial & Pendidikan", pct: 28, color: "#fb923c" },
    { label: "Bisnis & Manajemen", pct: 24, color: "#2dd4bf" },
    { label: "Seni & Kreatif", pct: 14, color: "#facc15" },
  ];

  // SVG Donut calculation: circumference = 2 * PI * r
  const r = 48;
  const c = 2 * Math.PI * r; // ~301.59

  // Calculate stroke-dasharray and stroke-dashoffset for each arc
  let accumulatedPct = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut graphic */}
      <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {items.map((item, idx) => {
            const dashLength = (item.pct / 100) * c;
            const offset = (accumulatedPct / 100) * c;
            accumulatedPct += item.pct;

            return (
              <circle
                key={idx}
                cx="60"
                cy="60"
                r={r}
                fill="none"
                stroke={item.color}
                strokeWidth="16"
                strokeDasharray={`${dashLength} ${c - dashLength}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm font-extrabold text-slate-800">100%</span>
          <span className="text-[9px] font-semibold text-slate-400 uppercase">Minat</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col space-y-2 text-xs flex-1 min-w-0">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium truncate">{item.label}</span>
            </div>
            <span className="text-slate-900 font-bold shrink-0">{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
