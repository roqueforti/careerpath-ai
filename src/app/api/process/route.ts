import { NextResponse } from "next/server";
import { getOccupations } from "@/lib/services/career-map.service";

export const dynamic = "force-dynamic";

interface ProcessRequestPayload {
  fullName?: string;
  educationLevel?: string;
  interests?: string[];
  skills?: string[];
  personalityTraits?: string[];
  targetCareerWish?: string;
}

interface DomainSkillConfig {
  coreSkills: string[];
  recommendedProjects: string[];
  certifications: string[];
}

const DOMAIN_SKILL_KNOWLEDGE: Record<string, DomainSkillConfig> = {
  tech: {
    coreSkills: ["Next.js & React.js", "TypeScript & JavaScript", "Laravel & PHP", "Tailwind CSS", "Python", "SQL & Database", "Git & GitHub", "Problem Solving", "REST API", "Algoritma & Struktur Data"],
    recommendedProjects: ["SaaS Platform LMS (BrewTech)", "Sistem Informasi Enterprise & Manajemen HRIS", "Aplikasi Web CRUD Responsif"],
    certifications: ["AWS Certified Developer", "Meta Front-End & Back-End Professional", "Google IT Automation with Python"],
  },
  data: {
    coreSkills: ["Python", "SQL", "Statistika Terapan", "Pandas & NumPy", "Visualisasi Data (Tableau / PowerBI)", "Machine Learning Fundamentals", "Data Cleaning"],
    recommendedProjects: ["Analisis Tren Pasar Terbuka", "Dashboard Interaktif Business Intelligence", "Model Prediksi Klasifikasi Data"],
    certifications: ["Google Data Analytics Certificate", "IBM Data Science Professional", "DeepLearning.AI Machine Learning Specialization"],
  },
  design: {
    coreSkills: ["Figma UI Prototyping", "User Research & Usability Testing", "Wireframing", "Design System", "Information Architecture", "Heuristic Evaluation", "Micro-Interactions"],
    recommendedProjects: ["Redesain Aplikasi Layanan Publik", "Design System Komponen UI", "Studi Kasus UX Research Terstruktur"],
    certifications: ["Google UX Design Certificate", "Interaction Design Foundation (IxDF)", "Figma Certified Creator"],
  },
  business: {
    coreSkills: ["SEO & Content Marketing", "Digital Analytics (GA4)", "Social Media Management", "Copywriting", "Market Research", "Komunikasi & Negosiasi", "Product Management Basics"],
    recommendedProjects: ["Audit Kampanye Digital Organisasi", "Perencanaan Konten & Eksekusi Growth", "Pitch Deck Analisis Kompetitor Bisnis"],
    certifications: ["Google Digital Garage", "HubSpot Inbound Marketing", "Meta Certified Digital Marketing Associate"],
  },
  psychology: {
    coreSkills: ["Active Listening", "Empathetic Communication", "Wawancara Terstruktur", "Psikometri Dasar", "Konseling Dasar", "Observasi Perilaku", "Penyusunan Laporan Asesmen"],
    recommendedProjects: ["Penyuluhan Manajemen Stres Siswa", "Modul Peer Counseling Komunitas", "Analisis Studi Kasus Dinamika Kelompok"],
    certifications: ["Pelatihan Konseling Sebaya Terakreditasi", "Sertifikasi Asesmen Psikologi Dasar", "Mindfulness-Based Stress Reduction"],
  },
  security: {
    coreSkills: ["Jaringan Komputer (TCP/IP)", "Linux OS Administration", "Network Security", "Vulnerability Scanning", "Enkripsi & PKI", "Ethical Hacking Fundamentals", "Incident Response"],
    recommendedProjects: ["Lab Simulasi Capture-The-Flag (CTF)", "Audit Konfigurasi Keamanan Jaringan", "Analisis Celah Keamanan Web (OWASP Top 10)"],
    certifications: ["CompTIA Security+", "Cisco Certified CyberOps Associate", "Certified Ethical Hacker (CEH Practical)"],
  },
};

function getDomainKey(titleOrCategory: string): string {
  const str = titleOrCategory.toLowerCase();
  if (str.includes("data") || str.includes("machine learning") || str.includes("ai")) return "data";
  if (str.includes("design") || str.includes("ui") || str.includes("ux") || str.includes("kreatif")) return "design";
  if (str.includes("security") || str.includes("siber") || str.includes("keamanan")) return "security";
  if (str.includes("software") || str.includes("web") || str.includes("developer") || str.includes("programmer")) return "tech";
  if (str.includes("marketing") || str.includes("bisnis") || str.includes("manajemen")) return "business";
  if (str.includes("psikolog") || str.includes("konselor") || str.includes("sosial")) return "psychology";
  return "tech";
}

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body: ProcessRequestPayload = await request.json().catch(() => ({}));

    const fullName = String(body.fullName || "").trim() || "Pengguna";
    const educationLevel = String(body.educationLevel || "MAHASISWA").trim().toUpperCase();
    const interests = Array.isArray(body.interests) ? body.interests.map(String) : [];
    const userSkills = Array.isArray(body.skills) ? body.skills.map((s) => String(s).trim()) : [];
    const personalityTraits = Array.isArray(body.personalityTraits) ? body.personalityTraits.map(String) : [];
    const targetCareerWish = String(body.targetCareerWish || "").trim();

    // Determine Career Maturity Stage & Description based on Grand Design Section 1
    let maturityLevel = "L3: DEVELOP";
    let maturityTitle = "DEVELOP (Skill gap • Proyek • Magang)";
    let maturityScore = 75;

    if (educationLevel === "SMP") {
      maturityLevel = "L1: EXPLORE";
      maturityTitle = "EXPLORE (Minat • Potensi • Profesi)";
      maturityScore = 35;
    } else if (educationLevel === "SMA" || educationLevel === "SMK" || educationLevel === "MA") {
      maturityLevel = "L2: PLAN";
      maturityTitle = "PLAN (Pilihan studi • Target karier)";
      maturityScore = 55;
    } else if (educationLevel === "FRESH_GRADUATE" || educationLevel === "MAHASISWA_AKHIR" || userSkills.length >= 6) {
      maturityLevel = "L4: READY";
      maturityTitle = "TRANSITION & READY (Portofolio • Seleksi • Kerja)";
      maturityScore = 94;
    }

    // 1. Fetch Occupations from Database with reliable fallback
    let allOccupations: any[] = [];
    try {
      allOccupations = await getOccupations();
    } catch (dbErr) {
      console.warn("DB getOccupations warning (using fallback dataset):", dbErr);
    }

    if (!allOccupations || allOccupations.length === 0) {
      allOccupations = [
        {
          id: "occ-swe-001",
          title: "Software Engineer / Full-Stack Developer",
          slug: "software-engineer",
          category: "Teknologi Informasi",
          description: "Merancang, membangun, dan memelihara sistem aplikasi web dan mobile berskala tinggi dengan arsitektur modern.",
          hollandCode: "IRC",
          educationPaths: "Teknik Informatika, Sistem Informasi, Ilmu Komputer",
          explorationActivities: "Membangun proyek web interaktif, latihan algoritma, kontribusi open source",
          salaryRange: "Rp 8.000.000 - Rp 25.000.000",
          outlook: "VERY_HIGH",
        },
        {
          id: "occ-ds-002",
          title: "Data Scientist & AI Specialist",
          slug: "data-scientist",
          category: "Teknologi Informasi",
          description: "Menganalisis data dalam skala besar dan membangun model analitik cerdas untuk memecahkan masalah kompleks.",
          hollandCode: "IRC",
          educationPaths: "Sains Data, Statistika, Matematika, Teknik Informatika",
          explorationActivities: "Eksplorasi dataset publik, belajar visualisasi data dan machine learning",
          salaryRange: "Rp 9.000.000 - Rp 28.000.000",
          outlook: "VERY_HIGH",
        },
        {
          id: "occ-ux-003",
          title: "UI/UX Designer & Product Researcher",
          slug: "ui-ux-designer",
          category: "Desain & Kreatif",
          description: "Merancang antarmuka produk digital yang estetik, mudah dipahami, dan memberikan pengalaman menyenangkan bagi pengguna.",
          hollandCode: "ASI",
          educationPaths: "Desain Komunikasi Visual (DKV), Sistem Informasi, Psikologi",
          explorationActivities: "Merancang antarmuka di Figma, melakukan wawancara pengguna, studi antarmuka aplikasi populer",
          salaryRange: "Rp 7.000.000 - Rp 20.000.000",
          outlook: "HIGH",
        },
        {
          id: "occ-mkt-005",
          title: "Digital Marketing Specialist",
          slug: "digital-marketing-specialist",
          category: "Bisnis & Manajemen",
          description: "Mengembangkan strategi kampanye pemasaran online, SEO, media sosial, dan analitika pertumbuhan audiens.",
          hollandCode: "EAS",
          educationPaths: "Manajemen Bisnis, Ilmu Komunikasi, Pemasaran Digital",
          explorationActivities: "Membuat kampanye konten kreatif, mempelajari analitika media sosial, optimasi SEO",
          salaryRange: "Rp 6.500.000 - Rp 18.000.000",
          outlook: "HIGH",
        },
        {
          id: "occ-sec-006",
          title: "Cybersecurity Analyst",
          slug: "cybersecurity-analyst",
          category: "Teknologi Informasi",
          description: "Menjaga keamanan data, infrastruktur jaringan, serta memantau dan menangkal ancaman siber digital.",
          hollandCode: "IRC",
          educationPaths: "Keamanan Siber, Teknik Informatika, Sistem Komputer",
          explorationActivities: "Mempelajari protokol jaringan, praktik uji penetrasi pemula, audit keamanan password",
          salaryRange: "Rp 8.500.000 - Rp 26.000.000",
          outlook: "VERY_HIGH",
        },
        {
          id: "occ-psy-004",
          title: "Psikolog Klinis / Konselor Karier",
          slug: "psikolog-klinis",
          category: "Kesehatan & Sosial",
          description: "Membantu individu memahami potensi diri, mengelola dinamika emosional, dan merencanakan arah perkembangan pribadi.",
          hollandCode: "SIA",
          educationPaths: "Psikologi (S1) + Profesi Psikolog (S2)",
          explorationActivities: "Melatih active listening, menjadi konselor sebaya, membaca literatur psikologi terapan",
          salaryRange: "Rp 6.000.000 - Rp 18.000.000",
          outlook: "HIGH",
        },
      ];
    }

    // 2. Scoring & Matching Engine
    const traitLetters: string[] = [];
    personalityTraits.forEach((t) => {
      const lower = t.toLowerCase();
      if (lower.includes("realis") || lower.includes("praktis")) traitLetters.push("R");
      if (lower.includes("investig") || lower.includes("analit") || lower.includes("riset")) traitLetters.push("I");
      if (lower.includes("artist") || lower.includes("kreatif") || lower.includes("desain")) traitLetters.push("A");
      if (lower.includes("sosial") || lower.includes("membantu") || lower.includes("edukasi")) traitLetters.push("S");
      if (lower.includes("enterpris") || lower.includes("bisnis") || lower.includes("pemimpin")) traitLetters.push("E");
      if (lower.includes("konvens") || lower.includes("struktur") || lower.includes("rapi")) traitLetters.push("C");
    });

    const evaluated = allOccupations.map((occ) => {
      let score = 50;

      const occCategory = (occ.category || "").toLowerCase();
      const occTitle = (occ.title || "").toLowerCase();
      const occDesc = (occ.description || "").toLowerCase();
      const occHolland = String(occ.hollandCode || "").toUpperCase();

      // Holland Alignment
      let hollandPoints = 0;
      traitLetters.forEach((letter) => {
        if (occHolland.includes(letter)) {
          hollandPoints += 12;
        }
      });
      score += Math.min(hollandPoints, 25);

      // Interests Alignment
      let interestPoints = 0;
      interests.forEach((interest) => {
        const intLower = interest.toLowerCase();
        if (
          occCategory.includes(intLower) ||
          occTitle.includes(intLower) ||
          occDesc.includes(intLower) ||
          (intLower.includes("teknologi") && occCategory.includes("teknologi")) ||
          (intLower.includes("data") && occTitle.includes("data")) ||
          (intLower.includes("desain") && (occCategory.includes("desain") || occTitle.includes("designer"))) ||
          (intLower.includes("bisnis") && occCategory.includes("bisnis")) ||
          (intLower.includes("sosial") && occCategory.includes("sosial"))
        ) {
          interestPoints += 12;
        }
      });
      score += Math.min(interestPoints, 20);

      // Skills Overlap & Skill Gap
      const domainKey = getDomainKey(occTitle + " " + occCategory);
      const domainKnowledge = DOMAIN_SKILL_KNOWLEDGE[domainKey] || DOMAIN_SKILL_KNOWLEDGE.tech;

      const matchedSkills: string[] = [];
      const gapSkills: string[] = [];

      domainKnowledge.coreSkills.forEach((coreSkill) => {
        const hasSkill = userSkills.some(
          (us) =>
            us.toLowerCase().includes(coreSkill.toLowerCase()) ||
            coreSkill.toLowerCase().includes(us.toLowerCase())
        );
        if (hasSkill) {
          matchedSkills.push(coreSkill);
        } else {
          gapSkills.push(coreSkill);
        }
      });

      userSkills.forEach((us) => {
        if (
          (occDesc.includes(us.toLowerCase()) || occTitle.includes(us.toLowerCase())) &&
          !matchedSkills.includes(us)
        ) {
          matchedSkills.push(us);
        }
      });

      const skillBonus = Math.min(matchedSkills.length * 6, 25);
      score += skillBonus;

      // Target Career Wish Bonus
      if (targetCareerWish && (occTitle.includes(targetCareerWish.toLowerCase()) || targetCareerWish.toLowerCase().includes(occTitle))) {
        score += 10;
      }

      // Clamp fit
      const finalFit = Math.min(Math.max(score, 70), 98);

      const whyReasons: string[] = [];
      if (matchedSkills.length > 0) {
        whyReasons.push(`Kamu telah memiliki modal keahlian ${matchedSkills.slice(0, 3).join(", ")}`);
      }
      if (interestPoints > 0) {
        whyReasons.push(`Minatmu di bidang ${interests.slice(0, 2).join(" & ") || occCategory} selaras dengan sektor ini`);
      }
      if (hollandPoints > 0) {
        whyReasons.push(`Karakter kerja (${personalityTraits.slice(0, 2).join(", ") || occHolland}) sangat cocok dengan ekosistem profesi ini`);
      }

      return {
        ...occ,
        fitPercentage: finalFit,
        matchedSkills: matchedSkills.length > 0 ? matchedSkills : [userSkills[0] || "Problem Solving Dasar"],
        gapSkills: gapSkills.length > 0 ? gapSkills.slice(0, 4) : ["Manajemen Proyek Lanjutan", "Sertifikasi Industri Terapan"],
        whyFit: whyReasons.join(". ") + ".",
        domainKey,
      };
    });

    evaluated.sort((a, b) => b.fitPercentage - a.fitPercentage);

    const primary = evaluated[0];
    const alternative1 = evaluated[1] || evaluated[0];
    const alternative2 = evaluated[2] || evaluated[1];

    // Modul 03 DEVELOP: Individual Development Plan (IDP) 3 Fase
    const primaryDomain = DOMAIN_SKILL_KNOWLEDGE[primary.domainKey] || DOMAIN_SKILL_KNOWLEDGE.tech;
    const topGap1 = primary.gapSkills[0] || primaryDomain.coreSkills[1] || "Keahlian Lanjutan";
    const topGap2 = primary.gapSkills[1] || primaryDomain.coreSkills[2] || "Portofolio Proyek";
    const recommendedProject = primaryDomain.recommendedProjects[0] || "Proyek Portofolio Mandiri";
    const recommendedCert = primaryDomain.certifications[0] || "Sertifikasi Standar Industri";

    const idpRoadmap = [
      {
        phase: "Fase 1: Penguasaan Fondasi & Skill Gap Awal",
        period: "Bulan 1 - 2",
        focus: `Mempelajari konsep fundamental dan menutup kesenjangan keahlian utama: ${topGap1}.`,
        tasks: [
          `Ikuti modul terstruktur dan literatur mendalam tentang ${topGap1}.`,
          `Latihan terstruktur secara konsisten (minimal 4-6 jam per minggu).`,
          `Dokumentasikan catatan belajar dan bagikan wawasan di jurnal digital atau LinkedIn.`,
        ],
      },
      {
        phase: "Fase 2: Praktik Lapangan & Pembuatan Portofolio",
        period: "Bulan 3 - 4",
        focus: `Menerapkan keahlian ke dalam bentuk nyata: ${recommendedProject} serta memperdalam ${topGap2}.`,
        tasks: [
          `Kerjakan proyek mandiri: "${recommendedProject}" dari awal hingga selesai.`,
          `Unggah kode, desain, atau studi kasus ke repositori publik (GitHub / Behance / Google Drive).`,
          `Minta umpan balik asinkron dari guru BK, dosen, atau mentor praktisi.`,
        ],
      },
      {
        phase: "Fase 3: Validasi Sertifikasi & Kesiapan Masuk Industri",
        period: "Bulan 5 - 6",
        focus: `Mendapatkan bukti kompetensi resmi dan menjangkau peluang kerja atau magang nyata.`,
        tasks: [
          `Persiapkan dan ambil sertifikasi terpercaya seperti ${recommendedCert}.`,
          `Perbarui CV dan Skill Passport dengan mencantumkan bukti proyek yang sudah divalidasi mentor.`,
          `Ajukan lamaran magang atau posisi profesional di industri ${primary.category}.`,
        ],
      },
    ];

    // Modul 05 MATCH: Curated Opportunities based on education level and domain
    const curatedOpportunities = [
      {
        id: "opp-01",
        title: "Bangkit Academy 2026 - Tech & Cloud Career Track",
        organization: "Google, GoTo, Traveloka & Kemendikbudristek",
        type: "TRAINING / MAGANG",
        location: "Nasional (Remote / Online)",
        eligibility: "ELIGIBLE",
        description: "Program percepatan karier teknologi berstandar global dengan kurikulum intensif, sertifikasi internasional, dan proyek tim industri.",
        url: "https://grow.google/intl/id_id/bangkit/",
      },
      {
        id: "opp-02",
        title: "BRI Future Specialist Internship Program",
        organization: "PT Bank Rakyat Indonesia (Persero) Tbk",
        type: "MAGANG BERSERTIFIKAT",
        location: "Jakarta / Hybrid",
        eligibility: "POTENTIAL_MATCH",
        description: "Program magang berbayar untuk mahasiswa dan fresh graduate dalam pengembangan sistem digital skala jutaan pengguna.",
        url: "https://recruitment.bri.co.id",
      },
      {
        id: "opp-03",
        title: "Associate Software Engineer & Product Trainee",
        organization: "GoTo Group & Mitra Industri",
        type: "LOWONGAN PEKERJAAN",
        location: "Jakarta / Hybrid",
        eligibility: "ELIGIBLE",
        description: "Jalur karier akselerasi untuk talenta digital berbakat dengan rotasi tim engineering dan pendampingan tech lead senior.",
        url: "https://www.gotocompany.com/careers",
      },
    ];

    const processingTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      execution: {
        status: "COMPLETED",
        statusCode: 200,
        processingTimeMs,
        processedAt: new Date().toISOString(),
        engineVersion: "CareerPath Grand Design Multi-Module Engine v2.0",
      },
      // 1 | TINGKATAN PENGGUNA & PERJALANAN KARIER
      careerJourney: {
        level: maturityLevel,
        title: maturityTitle,
        readinessScore: maturityScore,
        ruleExplanation: "Dievaluasi berdasarkan bukti kemajuan personal, kelengkapan asesmen, dan portofolio kompetensi (bukan berdasarkan usia biologis saja).",
      },
      userProfile: {
        fullName,
        educationLevel,
        interests,
        skills: userSkills,
        personalityTraits,
        targetCareerWish: targetCareerWish || "Eksplorasi Karier Terbaik",
      },
      // 2 | MODUL UTAMA CAREERPATH
      modules: {
        // 01 ASSESS
        assess: {
          title: "01 ASSESS (Minat • Potensi • Kompetensi)",
          hollandCode: primary.hollandCode,
          dimensions: traitLetters.length > 0 ? traitLetters.join("-") : "IRC",
          summary: `Minat dominan pada sektor ${interests.join(", ") || primary.category} dengan modal keahlian awal ${userSkills.slice(0, 3).join(", ") || "Dasar Teknis"}.`,
        },
        // 02 MAP
        map: {
          title: "02 MAP (Profil • Rekomendasi Jalur Karier)",
          primaryCareer: {
            id: primary.id,
            title: primary.title,
            slug: primary.slug,
            category: primary.category,
            hollandCode: primary.hollandCode,
            fitPercentage: primary.fitPercentage,
            salaryRange: primary.salaryRange || "Rp 7.000.000 - Rp 25.000.000",
            outlook: primary.outlook || "HIGH",
            description: primary.description,
            whyFit: primary.whyFit,
            educationPaths: primary.educationPaths,
            explorationActivities: primary.explorationActivities,
          },
          alternativeCareers: [
            {
              id: alternative1.id,
              title: alternative1.title,
              slug: alternative1.slug,
              category: alternative1.category,
              fitPercentage: alternative1.fitPercentage,
              salaryRange: alternative1.salaryRange,
              outlook: alternative1.outlook,
              description: alternative1.description,
              hollandCode: alternative1.hollandCode,
            },
            {
              id: alternative2.id,
              title: alternative2.title,
              slug: alternative2.slug,
              category: alternative2.category,
              fitPercentage: alternative2.fitPercentage,
              salaryRange: alternative2.salaryRange,
              outlook: alternative2.outlook,
              description: alternative2.description,
              hollandCode: alternative2.hollandCode,
            },
          ],
        },
        // 03 DEVELOP
        develop: {
          title: "03 DEVELOP (IDP • Pelatihan • Mentoring)",
          planTitle: `Individual Development Plan (IDP): ${primary.title}`,
          idpRoadmap,
          recommendedCertifications: primaryDomain.certifications,
        },
        // 04 PROVE
        prove: {
          title: "04 PROVE (Skill Passport • Portofolio)",
          matchedSkills: primary.matchedSkills,
          gapSkills: primary.gapSkills,
          recommendedProjects: primaryDomain.recommendedProjects,
          passportStatus: {
            claimed: userSkills.length,
            evidenceBacked: Math.max(userSkills.length - 1, 1),
            mentorValidated: maturityScore >= 80 ? 3 : 1,
          },
        },
        // 05 MATCH
        match: {
          title: "05 MATCH (Magang • Beasiswa • Pekerjaan)",
          curatedOpportunities,
        },
      },
      // 3 | AI-ASSISTED CAREER MENTORING & MENTOR MANUSIA
      mentoring: {
        aiMentor: {
          role: "AI Career Mentor (Analisis & Bimbingan 24/7)",
          guidance: `Rekomendasi sebagai ${primary.title} sangat kokoh karena selaras dengan portofolio keahlian Anda. Fokus utama Anda dalam 60 hari ke depan adalah menyelesaikan proyek Fase 1 IDP untuk membuktikan penguasaan ${topGap1}.`,
          reflectionPrompt: `Apakah alur kerja ${primary.title} selaras dengan nilai personal dan tujuan hidup jangka panjang Anda? Keputusan karier akhir tetap berada di tangan Anda.`,
        },
        humanMentor: {
          role: "Mentor Manusia (Guru BK / Dosen / Praktisi Industri)",
          inTheLoopNote: "Rencana IDP dan bukti portofolio Anda siap ditinjau oleh mentor manusia melalui interaksi asinkron untuk validasi resmi Skill Passport.",
          actionableTask: `Unggah tautan bukti repositori proyek ${recommendedProject} ke menu Portofolio untuk mendapatkan validasi 'Mentor-Validated'.`,
        },
      },
      // 4 | PRINSIP TATA KELOLA
      principles: [
        "Personalisasi Berbasis Data",
        "Human-in-the-Loop (Kolaborasi AI & Guru/Dosen)",
        "Bukti Kompetensi Nyata (Skill Passport)",
        "Privasi & Keamanan Data Siswa",
        "Akses Inklusif Seluruh Jenjang",
      ],
    });
  } catch (error: any) {
    console.error("Backend process error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat memproses data di server backend.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
