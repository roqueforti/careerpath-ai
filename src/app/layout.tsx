import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { seedDatabase } from "@/lib/db/seed";
import { Suspense } from "react";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerPath AI | Temukan Arah Kariermu Bersama CareerPath AI",
  description:
    "Kenali minat, potensi, dan jelajahi peluang karier terbaik untuk masa depanmu dengan asesmen Holland RIASEC dan pemetaan O*NET.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ensure database schema and seed data are ready
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Database startup initialization check:", err);
  }

  return (
    <html lang="id" className={`${montserrat.variable} h-full antialiased font-sans overflow-x-hidden`}>
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-[#eef0fb] text-[#0f172a] font-sans">
        <Suspense fallback={null}>
          <LanguageProvider>
            <AppShell>
              {children}
            </AppShell>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
