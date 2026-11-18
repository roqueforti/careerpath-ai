"use client";

import React from "react";

interface RiasecRadarChartProps {
  scores?: {
    R?: number;
    I?: number;
    A?: number;
    S?: number;
    E?: number;
    C?: number;
  };
  maxScore?: number;
  className?: string;
}

export default function RiasecRadarChart({
  scores = { R: 12, I: 15, A: 11, S: 9, E: 10, C: 13 },
  maxScore = 15,
  className = "",
}: RiasecRadarChartProps) {
  // 6 dimensions arranged clockwise starting from top (Realistic)
  const axes = [
    { key: "R", label: "Realistic", sub: "(R)", angle: -90 },
    { key: "I", label: "Investigative", sub: "(I)", angle: -30 },
    { key: "A", label: "Artistic", sub: "(A)", angle: 30 },
    { key: "S", label: "Social", sub: "(S)", angle: 90 },
    { key: "E", label: "Enterprising", sub: "(E)", angle: 150 },
    { key: "C", label: "Conventional", sub: "(C)", angle: 210 },
  ];

  const size = 320;
  const center = size / 2;
  const radius = 100;

  // Helper to convert polar to cartesian
  function polarToCartesian(angleDeg: number, r: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  }

  // Calculate polygon points for grid rings (3 concentric rings)
  const gridRings = [0.33, 0.66, 1.0];

  // Calculate user score polygon points
  const polygonPoints = axes
    .map((axis) => {
      const score = (scores as any)[axis.key] || 0;
      const ratio = Math.min(Math.max(score / maxScore, 0.15), 1.0);
      const pt = polarToCartesian(axis.angle, radius * ratio);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto max-w-[320px] overflow-visible"
      >
        {/* Concentric Hexagon Grid Rings */}
        {gridRings.map((scale, idx) => {
          const ringPoints = axes
            .map((axis) => {
              const pt = polarToCartesian(axis.angle, radius * scale);
              return `${pt.x},${pt.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={idx}
              points={ringPoints}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1.2"
              strokeDasharray={idx < 2 ? "3 3" : undefined}
            />
          );
        })}

        {/* Axis Spokes from center to outer edge */}
        {axes.map((axis, idx) => {
          const outerPt = polarToCartesian(axis.angle, radius);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Shaded User Score Polygon (Translucent Purple Fill & Solid Purple Stroke) */}
        <polygon
          points={polygonPoints}
          fill="rgba(84, 82, 230, 0.18)"
          stroke="#5452e6"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Score Vertex Dots */}
        {axes.map((axis, idx) => {
          const score = (scores as any)[axis.key] || 0;
          const ratio = Math.min(Math.max(score / maxScore, 0.15), 1.0);
          const pt = polarToCartesian(axis.angle, radius * ratio);
          return (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#ffffff"
              stroke="#5452e6"
              strokeWidth="2"
            />
          );
        })}

        {/* Dimension Labels */}
        {axes.map((axis, idx) => {
          const labelDist = radius + 22;
          const labelPt = polarToCartesian(axis.angle, labelDist);

          // Text anchors based on position
          let textAnchor: "middle" | "start" | "end" = "middle";
          if (axis.angle === -30 || axis.angle === 30) textAnchor = "start";
          if (axis.angle === 150 || axis.angle === 210) textAnchor = "end";

          return (
            <g key={idx} transform={`translate(${labelPt.x}, ${labelPt.y})`}>
              <text
                textAnchor={textAnchor}
                className="text-[11px] font-bold fill-slate-700 select-none"
                dy="-2"
              >
                {axis.label}
              </text>
              <text
                textAnchor={textAnchor}
                className="text-[10px] font-semibold fill-slate-400 select-none"
                dy="11"
              >
                {axis.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
