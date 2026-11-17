"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm max-w-md w-full space-y-4">
            <h2 className="text-xl font-black text-stone-950">Terjadi Kesalahan Sistem</h2>
            <p className="text-xs text-stone-500">
              Sistem mendeteksi kendala operasional tak terduga. Silakan coba muat ulang halaman.
            </p>
            <button
              onClick={() => reset()}
              className="w-full rounded-full bg-red-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
