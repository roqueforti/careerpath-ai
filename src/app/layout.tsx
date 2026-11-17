import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { seedDatabase } from "@/lib/db/seed";
import { Suspense } from "react";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerPath AI-Assisted Mentoring | Platform Bimbingan Karier Berbasis Data",
  description:
    "Platform pengembangan dan pendampingan karier berbasis data O*NET, rencana aksi IDP, portofolio skill passport, dan kurasi peluang rekrutmen industri serta magang nasional terakreditasi.",
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
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased font-sans`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans">
        <Suspense fallback={null}>
          <LanguageProvider>
            <AppShell>
              {children}
              <Footer />
            </AppShell>
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
