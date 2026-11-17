import { NextResponse } from "next/server";
import { getOccupations, getOccupationByIdOrSlug } from "@/lib/services/career-map.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = String(searchParams.get("query") || "").trim().toLowerCase();
    const educationLevel = String(searchParams.get("educationLevel") || "MAHASISWA");

    return handleInstantMatch(query, educationLevel);
  } catch (err) {
    console.error("Instant match GET error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses rekomendasi instan." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = String(body.query || "").trim().toLowerCase();
    const educationLevel = String(body.educationLevel || "MAHASISWA");

    return handleInstantMatch(query, educationLevel);
  } catch (err) {
    console.error("Instant match POST error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses rekomendasi instan." }, { status: 500 });
  }
}

function getSkillsForDomain(titleLower: string): { matched: string[]; gaps: string[] } {
  if (titleLower.includes("data") || titleLower.includes("machine learning") || titleLower.includes("ai")) {
    return {
      matched: ["Python", "SQL", "Statistika Terapan"],
      gaps: ["MLOps Pipeline", "Feature Engineering", "Model Evaluation"],
    };
  }
  if (titleLower.includes("design") || titleLower.includes("ui") || titleLower.includes("ux")) {
    return {
      matched: ["Figma Prototyping", "User Research", "Wireframing"],
      gaps: ["Design System Token", "Usability Metrics", "Heuristic Evaluation"],
    };
  }
  if (titleLower.includes("cloud") || titleLower.includes("devops") || titleLower.includes("security")) {
    return {
      matched: ["Linux OS", "Docker Containers", "Network Fundamentals"],
      gaps: ["Kubernetes Cluster", "Infrastructure as Code", "CI/CD Hardening"],
    };
  }
  if (titleLower.includes("marketing") || titleLower.includes("bisnis")) {
    return {
      matched: ["SEO Fundamentals", "Content Strategy", "Digital Analytics"],
      gaps: ["Paid Ads Funnel", "Growth Experimentation", "Customer Retention Modeling"],
    };
  }
  if (titleLower.includes("psikolog") || titleLower.includes("konselor") || titleLower.includes("sosial")) {
    return {
      matched: ["Active Listening", "Empathetic Communication", "Wawancara Terstruktur"],
      gaps: ["Protokol Asesmen Klinis", "Validasi Psikometrik", "Manajemen Intervensi Krisis"],
    };
  }
  return {
    matched: ["Problem Solving Terstruktur", "Analytical Thinking", "Kolaborasi Tim"],
    gaps: ["Advanced Domain Knowledge", "Metodologi Agile", "Stakeholder Articulation"],
  };
}

function buildXaiBreakdown(occ: any, fitPercentage: number, matchedSkills: string[], gapSkills: string[]) {
  const hollandMap: Record<string, string> = {
    R: "Realistic (Praktikal & Penerapan Lapangan)",
    I: "Investigative (Analitis, Riset, & Logika Data)",
    A: "Artistic (Kreatif, Desain, & Eksplorasi Naratif)",
    S: "Social (Edukasi, Empati, & Bimbingan Manusia)",
    E: "Enterprising (Kepemimpinan & Inisiatif Bisnis)",
    C: "Conventional (Terstruktur, Presisi, & Tata Kelola)",
  };

  const primaryHollandLetter = String(occ.hollandCode || "I")[0];
  const primaryHollandName = hollandMap[primaryHollandLetter] || "Investigative & Analitis";

  return {
    featureAttribution: {
      hollandFitPercent: Math.round(fitPercentage * 0.4),
      skillCompetencePercent: Math.round(fitPercentage * 0.35),
      marketDemandPercent: Math.round(fitPercentage * 0.25),
    },
    hollandExplanation: `Karakter ${primaryHollandName} sangat cocok dengan lingkungan dan gaya kerja peran ini.`,
    skillEvidence: {
      matched: matchedSkills,
      gaps: gapSkills,
      matchRatio: Math.round((matchedSkills.length / (matchedSkills.length + gapSkills.length)) * 100) || 75,
    },
    marketOutlook: {
      outlook: occ.outlook || "HIGH",
      growthRate: occ.outlook === "HIGH" ? "+24% Prospek 5 Tahun (Sangat Tinggi)" : "+12% Prospek Industri Stabil",
      salaryEstimate: occ.salaryRange || "Rp 8.000.000 - Rp 22.000.000",
    },
    criticalReflectionPrompt: `Apakah pola kerja ${occ.title} selaras dengan minat dan tujuan hidup kamu? Rekomendasi ini adalah panduan awal untuk membantumu memilih dengan yakin.`,
    hybridRecommendation: "Konsultasikan hasil ini bersama mentor praktisi di menu Mentoring untuk mendapatkan masukan nyata.",
  };
}

async function handleInstantMatch(query: string, educationLevel: string) {
  try {
    // Fetch all occupations
    const allOccs = await getOccupations();

    if (!query) {
      // Return top diverse occupations as default highlights with complete XAI breakdown
      const defaults = allOccs.slice(0, 4).map((occ, idx) => {
        const titleLower = occ.title.toLowerCase();
        const { matched, gaps } = getSkillsForDomain(titleLower);
        const fitPercentage = 96 - idx * 2;
        return {
          id: occ.id,
          title: occ.title,
          slug: occ.slug,
          category: occ.category,
          description: occ.description,
          hollandCode: occ.hollandCode,
          salaryRange: occ.salaryRange || "Rp 8.000.000 - Rp 18.000.000",
          fitPercentage,
          fitReason: "Pilihan karier unggulan dengan proyeksi pertumbuhan tinggi dan kecocokan profil industri.",
          outlook: occ.outlook,
          matchedSkills: matched,
          gapSkills: gaps,
          xaiBreakdown: buildXaiBreakdown(occ, fitPercentage, matched, gaps),
        };
      });

      return NextResponse.json({ success: true, matches: defaults });
    }

    // Score occupations based on query keywords matching title, description, category, holland code
    const scored = allOccs.map((occ) => {
      let score = 50;
      const titleLower = occ.title.toLowerCase();
      const descLower = occ.description.toLowerCase();
      const catLower = occ.category.toLowerCase();
      const hollandLower = occ.hollandCode.toLowerCase();

      const keywords = query.split(/\s+/).filter((w) => w.length > 2);

      let matches = 0;
      keywords.forEach((word) => {
        if (titleLower.includes(word)) matches += 20;
        if (descLower.includes(word)) matches += 10;
        if (catLower.includes(word)) matches += 12;
        if (hollandLower.includes(word)) matches += 8;
      });

      // Special domain keyword boosts
      if (
        (query.includes("data") || query.includes("ai") || query.includes("python")) &&
        (titleLower.includes("data") || titleLower.includes("machine learning") || titleLower.includes("ai"))
      ) {
        matches += 25;
      }
      if (
        (query.includes("desain") || query.includes("ui") || query.includes("ux") || query.includes("figma")) &&
        (titleLower.includes("designer") || titleLower.includes("product") || catLower.includes("creative"))
      ) {
        matches += 25;
      }
      if (
        (query.includes("web") || query.includes("frontend") || query.includes("backend") || query.includes("software")) &&
        (titleLower.includes("developer") || titleLower.includes("engineer"))
      ) {
        matches += 25;
      }
      if (
        (query.includes("cloud") || query.includes("devops") || query.includes("security")) &&
        (titleLower.includes("cloud") || titleLower.includes("security") || titleLower.includes("devops"))
      ) {
        matches += 25;
      }

      score = Math.min(98, Math.max(65, score + matches));
      const { matched, gaps } = getSkillsForDomain(titleLower);

      return {
        id: occ.id,
        title: occ.title,
        slug: occ.slug,
        category: occ.category,
        description: occ.description,
        hollandCode: occ.hollandCode,
        salaryRange: occ.salaryRange || "Rp 9.000.000 - Rp 22.000.000",
        fitPercentage: score,
        fitReason: matches > 0 
          ? `Kecocokan tinggi dengan kata kunci & minat "${query}".`
          : "Potensi alternatif jalur karier yang relevan.",
        outlook: occ.outlook,
        matchedSkills: matched,
        gapSkills: gaps,
        xaiBreakdown: buildXaiBreakdown(occ, score, matched, gaps),
      };
    });

    // Sort by fit percentage descending
    scored.sort((a, b) => b.fitPercentage - a.fitPercentage);

    return NextResponse.json({
      success: true,
      query,
      educationLevel,
      matches: scored.slice(0, 4),
    });
  } catch (err) {
    console.error("Instant match error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses rekomendasi instan." }, { status: 500 });
  }
}
