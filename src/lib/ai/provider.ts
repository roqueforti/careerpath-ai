export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiResponse {
  content: string;
  provider: "gemini" | "openai" | "simulation-fallback";
  latencyMs: number;
}

export async function callAiProvider(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<AiResponse> {
  const startTime = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try Google Gemini API if key provided
  if (geminiKey) {
    try {
      const systemInstruction = messages.find((m) => m.role === "system")?.content;
      const conversation = messages
        .filter((m) => m.role !== "system")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const payload: Record<string, unknown> = {
        contents: conversation,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 1200,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
      for (const model of candidateModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": geminiKey,
              },
              body: JSON.stringify(payload),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              return {
                content: text,
                provider: "gemini",
                latencyMs: Date.now() - startTime,
              };
            }
          }
        } catch {
          // try next model
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, attempting fallback:", err);
    }
  }

  // 2. Try OpenAI API if key provided
  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1200,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return {
            content: text,
            provider: "openai",
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, attempting fallback:", err);
    }
  }

  // 3. Deterministic Simulation Fallback (Ensures zero downtime / fully functional offline MVP)
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const fallbackReply = generateSimulationFallbackResponse(lastUserMessage);

  return {
    content: fallbackReply,
    provider: "simulation-fallback",
    latencyMs: Date.now() - startTime,
  };
}

function generateSimulationFallbackResponse(prompt: string): string {
  const p = prompt.toLowerCase();

  if (p.includes("idp") || p.includes("rencana") || p.includes("draft")) {
    return JSON.stringify({
      title: "Rencana Pengembangan Kompetensi Prioritas (AI Draft)",
      rationale: "Fokus menutup kesenjangan teknis dan membangun portofolio proyek terverifikasi.",
      target_end_date: "2026-12-31",
      activities: [
        {
          title: "Menyelesaikan Modul Fundamental Kompetensi Inti",
          description: "Mempelajari sintaks dasar dan konsep arsitektur utama melalui kursus terstruktur.",
          priority: "HIGH",
          target_weeks: 4,
          success_indicators: "Sertifikat penyelesaian kursus online",
        },
        {
          title: "Membangun Proyek Praktik Berbasis Masalah Nyata",
          description: "Mengembangkan aplikasi atau model data end-to-end dengan dokumentasi lengkap.",
          priority: "HIGH",
          target_weeks: 6,
          success_indicators: "Repositori GitHub publik dengan file README terperinci",
        },
        {
          title: "Mengikuti Usability / Code Review Bersama Mentor",
          description: "Mengajukan bukti karya ke modul Portfolio untuk divalidasi oleh mentor pembimbing.",
          priority: "MEDIUM",
          target_weeks: 2,
          success_indicators: "Status validasi 'VALIDATED' pada Skill Passport",
        },
      ],
    });
  }

  if (p.includes("interview") || p.includes("wawancara") || p.includes("simulasi")) {
    return `Evaluasi Jawaban Simulasi Wawancara:

1. **Struktur Jawaban (Metode STAR):** 8.5/10. Kamu telah menguraikan Situasi dan Tugas dengan baik. Pastikan bagian Tindakan (Action) lebih detail menjelaskan keputusan teknis yang kamu ambil sendiri.
2. **Relevansi Kompetensi:** Sangat relevan dengan target profesi. Kamu berhasil menunjukkan pemecahan masalah analitis.
3. **Bahasa & Artikulasi:** Profesional dan lugas.

**Saran Perbaikan:** Berikan metrik kuantitatif di bagian Hasil (Result), misalnya peningkatan efisiensi atau akurasi model yang kamu capai.`;
  }

  if (p.includes("cv") || p.includes("portofolio") || p.includes("review")) {
    return `### Analisis Portofolio & CV oleh AI Mentor

- **Kelebihan:** Deskripsi proyek terstruktur dengan peran yang jelas dan teknologi yang digunakan sudah tertera.
- **Kekurangan:** Belum ada metrik dampak konkret (misal: jumlah pengguna, persen optimasi waktu eksekusi).
- **Rekomendasi Aksi:**
  1. Tambahkan tautan demo langsung (live URL) atau repositori GitHub publik.
  2. Ajukan bukti ke modul Skill Passport agar divalidasi oleh mentor pembimbing.
  3. Hubungkan proyek ini dengan aktivitas IDP aktif untuk meningkatkan kematangan kariermu.`;
  }

  if (p.includes("bingung") || p.includes("cemas") || p.includes("ragu") || p.includes("takut") || p.includes("pilih mana")) {
    return `Halo! Kebimbangan dan kecemasan dalam merencanakan masa depan adalah hal yang sangat wajar dialami setiap mahasiswa.

Mari kita urai bersama secara bertahap:
1. **Otonomi & Minat Intrinsik:** Apa aktivitas atau proyek yang paling membuatmu bersemangat dan merasa bermakna saat mengerjakannya?
2. **Kesesuaian Realistis:** Dari hasil asesmen RIASEC dan peta kompetensi kamu, profesi mana yang paling menarik perhatianmu saat ini?
3. **Eskalasi ke Mentor Manusia:** Jika kamu merasa beban pilihan ini terlalu berat diputuskan sendiri, aku sangat menyarankan untuk menjadwalkan sesi konsultasi dengan mentor industri di menu **Mentoring**. Mentor manusia dapat memberikan empati, telaah non-linear, dan validasi pengalaman nyata yang tidak bisa digantikan algoritma.

Apa hal paling mendasar yang saat ini membuatmu bimbang?`;
  }

  return `Halo! Saya **CareerPath AI Mentor**. Saya siap mendampingimu dalam:
- Memahami hasil asesmen minat Holland RIASEC secara reflektif.
- Mengeksplorasi jalur pendidikan dan profesi berbasis data O*NET.
- Menganalisis kesenjangan kompetensi (skill gap).
- Menyusun langkah konkret pada Individual Development Plan (IDP).
- Mempersiapkan portofolio bukti karya dan simulasi wawancara.

Apa yang ingin kamu eksplorasi atau rencanakan hari ini?`;
}
