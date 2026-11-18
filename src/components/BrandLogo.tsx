"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  className?: string;
  showSubtitle?: boolean;
}

export default function BrandLogo({ className = "", showSubtitle = false }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 4-Color Gradient Curved Emblem */}
      <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_6px_rgba(84,82,230,0.25)]"
        >
          {/* Top-left cyan leaf */}
          <path
            d="M6 18C6 11.3726 11.3726 6 18 6C18 12.6274 12.6274 18 6 18Z"
            fill="url(#cyan_grad)"
          />
          {/* Top-right purple/indigo feather */}
          <path
            d="M18 6C24.6274 6 30 11.3726 30 18C23.3726 18 18 12.6274 18 6Z"
            fill="url(#purple_grad)"
          />
          {/* Bottom-left golden yellow leaf */}
          <path
            d="M6 18C12.6274 18 18 23.3726 18 30C11.3726 30 6 24.6274 6 18Z"
            fill="url(#yellow_grad)"
          />
          {/* Bottom-right coral/orange leaf */}
          <path
            d="M18 30C18 23.3726 23.3726 18 30 18C30 24.6274 24.6274 30 18 30Z"
            fill="url(#coral_grad)"
          />
          {/* Center compass spark */}
          <circle cx="18" cy="18" r="3.2" fill="#ffffff" />
          <circle cx="18" cy="18" r="1.8" fill="#5452e6" />

          <defs>
            <linearGradient id="cyan_grad" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="purple_grad" x1="18" y1="6" x2="30" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#5452e6" />
            </linearGradient>
            <linearGradient id="yellow_grad" x1="6" y1="18" x2="18" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fbbf24" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="coral_grad" x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb7185" />
              <stop offset="1" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-lg font-extrabold tracking-tight text-[#0f172a] leading-none">
          CareerPath <span className="text-[#5452e6]">AI</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
            Guidance Platform
          </span>
        )}
      </div>
    </div>
  );
}
