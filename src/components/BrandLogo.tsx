"use client";

import React from "react";

export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* 4-Color Gradient Curved Emblem */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(84,82,230,0.2)]"
        >
          {/* Top-left cyan leaf */}
          <path
            d="M5 18C5 10.82 10.82 5 18 5C18 12.18 12.18 18 5 18Z"
            fill="url(#cyan_grad)"
          />
          {/* Top-right purple leaf */}
          <path
            d="M18 5C25.18 5 31 10.82 31 18C23.82 18 18 12.18 18 5Z"
            fill="url(#purple_grad)"
          />
          {/* Bottom-left golden yellow leaf */}
          <path
            d="M5 18C12.18 18 18 23.82 18 31C10.82 31 5 25.18 5 18Z"
            fill="url(#yellow_grad)"
          />
          {/* Bottom-right coral/orange leaf */}
          <path
            d="M18 31C18 23.82 23.82 18 31 18C31 25.18 25.18 31 18 31Z"
            fill="url(#coral_grad)"
          />
          {/* Central circle */}
          <circle cx="18" cy="18" r="3" fill="#ffffff" />
          <circle cx="18" cy="18" r="1.5" fill="#5452e6" />

          <defs>
            <linearGradient id="cyan_grad" x1="5" y1="5" x2="18" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="purple_grad" x1="18" y1="5" x2="31" y2="18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" />
              <stop offset="1" stopColor="#5452e6" />
            </linearGradient>
            <linearGradient id="yellow_grad" x1="5" y1="18" x2="18" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fde047" />
              <stop offset="1" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="coral_grad" x1="18" y1="18" x2="31" y2="31" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb7185" />
              <stop offset="1" stopColor="#e11d48" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <span className="text-base sm:text-lg font-black tracking-tight text-[#0f172a] leading-none select-none">
        CareerPath AI
      </span>
    </div>
  );
}
