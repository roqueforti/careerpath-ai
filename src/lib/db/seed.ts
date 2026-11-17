import { getDb } from "./client";
import { initializeSchema } from "./schema";
import bcrypt from "bcryptjs";

let hasSeeded = false;
let seedPromise: Promise<void> | null = null;

export async function seedDatabase(): Promise<void> {
  if (hasSeeded) return;
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    await initializeSchema();
    const db = getDb();

    // Check if already seeded
    const checkUsers = await db.execute("SELECT COUNT(*) as count FROM users;");
    const count = Number(checkUsers.rows[0]?.count ?? 0);
    if (count > 0) {
      hasSeeded = true;
      return;
    }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("DemoPass123!", salt);

  // 1. INSTITUTIONS
  const instItbId = "inst-itb-001";
  const instSmaId = "inst-sma1-002";

  await db.execute({
    sql: `INSERT INTO institutions (id, name, type, code, address) VALUES (?, ?, ?, ?, ?);`,
    args: [instItbId, "Institut Teknologi Bandung - Career Development Center", "UNIVERSITAS", "ITB-CDC", "Jl. Ganesha No. 10, Bandung"],
  });

  await db.execute({
    sql: `INSERT INTO institutions (id, name, type, code, address) VALUES (?, ?, ?, ?, ?);`,
    args: [instSmaId, "SMA Negeri 1 Jakarta", "SEKOLAH", "SMAN1-JKT", "Jl. Budi Utomo No. 7, Jakarta Pusat"],
  });

  // 2. OCCUPATIONS
  const occSweId = "occ-swe-001";
  const occDsId = "occ-ds-002";
  const occUxId = "occ-ux-003";
  const occPsyId = "occ-psy-004";
  const occMktId = "occ-mkt-005";
  const occSecId = "occ-sec-006";

  const occupationsData = [
    [occSweId, "Software Engineer", "software-engineer", "Teknologi Informasi", "Merancang, membangun, dan memelihara sistem perangkat lunak, arsitektur backend, dan antarmuka aplikasi berskala tinggi.", "IRC", "Teknik Informatika, Ilmu Komputer, Sistem Informasi", "Membuat proyek kalkulator web, belajar dasar algoritma logika, bergabung ke komunitas open-source", "Rp 8.000.000 - Rp 25.000.000", "VERY_HIGH"],
    [occDsId, "Data Scientist", "data-scientist", "Teknologi Informasi", "Menganalisis kumpulan data besar, merancang model machine learning prediktif, dan menerjemahkan pola data menjadi wawasan strategis.", "IRC", "Sains Data, Statistika, Matematika, Teknik Informatika", "Menganalisis dataset publik Kaggle, membuat visualisasi data polusi udara, belajar statistik dasar", "Rp 9.000.000 - Rp 28.000.000", "VERY_HIGH"],
    [occUxId, "UI/UX Designer", "ui-ux-designer", "Desain & Kreatif", "Mempelajari kebutuhan pengguna melalui riset, membuat arsitektur informasi, wireframe interaktif, dan desain visual aplikasi yang intuitif.", "ASI", "Desain Komunikasi Visual (DKV), Sistem Informasi, Psikologi", "Melakukan audit kegunaan aplikasi sekolah, merancang mockup antarmuka di Figma, menguji prototipe ke teman", "Rp 7.000.000 - Rp 20.000.000", "HIGH"],
    [occPsyId, "Psikolog Klinis / Konselor", "psikolog-klinis", "Kesehatan & Sosial", "Memberikan bimbingan psikologis, evaluasi kesehatan mental, asesmen kepribadian, serta mendampingi pemecahan masalah emosional dan karier.", "SIA", "Psikologi (S1) + Profesi Psikolog (S2)", "Membaca studi kasus psikologi perkembangan, menjadi sukarelawan peer-counselor sekolah, melatih active listening", "Rp 6.000.000 - Rp 18.000.000", "HIGH"],
    [occMktId, "Digital Marketing Specialist", "digital-marketing-specialist", "Bisnis & Manajemen", "Merancang strategi kampanye digital, mengelola optimasi SEO/SEM, menganalisis konversi audiens, dan menumbuhkan engagement brand.", "EAS", "Manajemen Bisnis, Ilmu Komunikasi, Pemasaran Digital", "Mengelola akun media sosial organisasi, membuat konten edukatif interaktif, menganalisis insight followers", "Rp 6.500.000 - Rp 18.000.000", "HIGH"],
    [occSecId, "Cybersecurity Analyst", "cybersecurity-analyst", "Teknologi Informasi", "Melindungi infrastruktur digital dari serangan siber, memantau celah kerentanan jaringan, dan menerapkan standar enkripsi serta keamanan informasi.", "IRC", "Teknik Informatika, Keamanan Siber, Rekayasa Perangkat Keras", "Mencoba simulasi capture-the-flag (CTF) pemula, belajar dasar protokol jaringan TCP/IP, audit keamanan password", "Rp 8.500.000 - Rp 26.000.000", "VERY_HIGH"]
  ];

  for (const occ of occupationsData) {
    await db.execute({
      sql: `INSERT INTO occupations (id, title, slug, category, description, holland_code, education_paths, exploration_activities, salary_range, outlook) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: occ,
    });
  }

  // 3. COMPETENCIES
  const compPython = "comp-py-001";
  const compSql = "comp-sql-002";
  const compMl = "comp-ml-003";
  const compFigma = "comp-figma-004";
  const compUserResearch = "comp-research-005";
  const compComm = "comp-comm-006";
  const compProblemSolving = "comp-probsol-007";
  const compSeo = "comp-seo-008";
  const compCounseling = "comp-counsel-009";

  const competenciesData = [
    [compPython, "Python Programming", "TECH-PY", "TECHNICAL", "Kemampuan sintaksis dan implementasi komputasi dengan bahasa pemrograman Python."],
    [compSql, "SQL & Relational Database", "TECH-SQL", "TECHNICAL", "Kemampuan merancang query database relasional, joins, dan agregasi data."],
    [compMl, "Machine Learning Fundamentals", "TECH-ML", "TECHNICAL", "Pemahaman algoritma supervised dan unsupervised learning untuk pemodelan prediktif."],
    [compFigma, "Figma UI Prototyping", "TECH-FIGMA", "TECHNICAL", "Keahlian merancang desain antarmuka, component system, dan interactive prototyping."],
    [compUserResearch, "User Research & Usability Testing", "METHOD-UXR", "METHODOLOGY", "Metodologi wawancara pengguna, persona empathy mapping, dan usability benchmarking."],
    [compComm, "Public Speaking & Communication", "SOFT-COMM", "SOFT_SKILL", "Kemampuan menyampaikan ide, presentasi teknis, dan artikulasi ide secara persuasif."],
    [compProblemSolving, "Critical Thinking & Problem Solving", "METHOD-PS", "METHODOLOGY", "Kemampuan dekonstruksi masalah kompleks menjadi langkah solusi terstruktur."],
    [compSeo, "SEO & Content Marketing", "TECH-SEO", "TECHNICAL", "Keahlian optimasi mesin pencari on-page/off-page dan perancangan strategi konten digital."],
    [compCounseling, "Active Listening & Empathetic Counseling", "SOFT-COUNSEL", "SOFT_SKILL", "Keterampilan mendengarkan aktif, non-judgmental, dan memberikan validasi emosional."]
  ];

  for (const c of competenciesData) {
    await db.execute({
      sql: `INSERT INTO competencies (id, name, code, category, description) VALUES (?, ?, ?, ?, ?);`,
      args: c,
    });
  }

  // 4. OCCUPATION COMPETENCIES MAPPING
  const occCompMappings = [
    [occSweId, compPython, "INTERMEDIATE", "CRITICAL"],
    [occSweId, compSql, "INTERMEDIATE", "CRITICAL"],
    [occSweId, compProblemSolving, "ADVANCED", "CRITICAL"],
    [occDsId, compPython, "ADVANCED", "CRITICAL"],
    [occDsId, compSql, "ADVANCED", "CRITICAL"],
    [occDsId, compMl, "INTERMEDIATE", "CRITICAL"],
    [occUxId, compFigma, "ADVANCED", "CRITICAL"],
    [occUxId, compUserResearch, "INTERMEDIATE", "CRITICAL"],
    [occUxId, compComm, "INTERMEDIATE", "IMPORTANT"],
    [occPsyId, compCounseling, "ADVANCED", "CRITICAL"],
    [occPsyId, compComm, "ADVANCED", "CRITICAL"],
    [occMktId, compSeo, "ADVANCED", "CRITICAL"],
    [occMktId, compComm, "ADVANCED", "CRITICAL"],
    [occSecId, compPython, "INTERMEDIATE", "CRITICAL"],
    [occSecId, compProblemSolving, "ADVANCED", "CRITICAL"]
  ];

  for (const m of occCompMappings) {
    await db.execute({
      sql: `INSERT INTO occupation_competencies (id, occupation_id, competency_id, expected_level, importance) VALUES (?, ?, ?, ?, ?);`,
      args: [`oc-${m[0]}-${m[1]}`, m[0], m[1], m[2], m[3]],
    });
  }

  // 5. ASSESSMENTS & QUESTIONS
  const assessRiasecId = "assess-riasec-001";
  await db.execute({
    sql: `INSERT INTO assessments (id, title, slug, description, assessment_type, instruction, min_education_level, version, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      assessRiasecId,
      "Holland RIASEC Career Interest Inventory",
      "riasec-interest",
      "Asesmen terstruktur untuk memetakan minat karier dan preferensi lingkungan kerja berdasarkan teori kepribadian John Holland (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).",
      "INTEREST_RIASEC",
      "Pilihlah skala 1 (Sangat Tidak Tertarik) hingga 5 (Sangat Tertarik) untuk setiap pernyataan aktivitas di bawah ini berdasarkan minat pribadimu yang sebenarnya.",
      "SMP",
      1,
      1
    ],
  });

  const riasecQuestions = [
    // Realistic
    ["q-r-1", assessRiasecId, "Memperbaiki peralatan elektronik atau mekanik yang rusak.", "LIKERT_5", "REALISTIC", 1],
    ["q-r-2", assessRiasecId, "Merakit komputer, sirkuit, atau bekerja dengan perkakas fisik.", "LIKERT_5", "REALISTIC", 2],
    ["q-r-3", assessRiasecId, "Bekerja di luar ruangan atau melakukan eksperimen lapangan langsung.", "LIKERT_5", "REALISTIC", 3],
    // Investigative
    ["q-i-1", assessRiasecId, "Mencari tahu penyebab mengapa suatu fenomena alam atau teknologi dapat terjadi.", "LIKERT_5", "INVESTIGATIVE", 4],
    ["q-i-2", assessRiasecId, "Menganalisis data, angka, dan grafik untuk menemukan pola tersembunyi.", "LIKERT_5", "INVESTIGATIVE", 5],
    ["q-i-3", assessRiasecId, "Mempelajari bahasa pemrograman atau memecahkan teka-teki logika yang rumit.", "LIKERT_5", "INVESTIGATIVE", 6],
    // Artistic
    ["q-a-1", assessRiasecId, "Merancang tata letak visual, ilustrasi poster, atau karya grafis.", "LIKERT_5", "ARTISTIC", 7],
    ["q-a-2", assessRiasecId, "Menulis cerita kreatif, artikel opini, atau membuat naskah naratif.", "LIKERT_5", "ARTISTIC", 8],
    ["q-a-3", assessRiasecId, "Mengekspresikan ide melalui musik, fotografi, atau pembuatan video.", "LIKERT_5", "ARTISTIC", 9],
    // Social
    ["q-s-1", assessRiasecId, "Mendengarkan curhat dan membantu teman menyelesaikan masalah pribadinya.", "LIKERT_5", "SOCIAL", 10],
    ["q-s-2", assessRiasecId, "Mengajar atau membimbing orang lain memahami materi pelajaran baru.", "LIKERT_5", "SOCIAL", 11],
    ["q-s-3", assessRiasecId, "Menjadi relawan kegiatan sosial untuk membantu masyarakat.", "LIKERT_5", "SOCIAL", 12],
    // Enterprising
    ["q-e-1", assessRiasecId, "Memimpin tim atau membagi tugas dalam sebuah kepanitiaan organisasi.", "LIKERT_5", "ENTERPRISING", 13],
    ["q-e-2", assessRiasecId, "Menawarkan produk, ide bisnis, atau meyakinkan orang lain tentang pandanganmu.", "LIKERT_5", "ENTERPRISING", 14],
    ["q-e-3", assessRiasecId, "Mengambil inisiatif memulai usaha kecil atau proyek baru yang menantang.", "LIKERT_5", "ENTERPRISING", 15],
    // Conventional
    ["q-c-1", assessRiasecId, "Menyusun catatan pembukuan keuangan atau jadwal kegiatan secara rapi.", "LIKERT_5", "CONVENTIONAL", 16],
    ["q-c-2", assessRiasecId, "Mengarsipkan dokumen dan data secara terstruktur dengan sistem penomoran.", "LIKERT_5", "CONVENTIONAL", 17],
    ["q-c-3", assessRiasecId, "Bekerja mengikuti aturan standar operasional yang jelas dan sistematis.", "LIKERT_5", "CONVENTIONAL", 18],
  ];

  const standardLikertOptions = JSON.stringify([
    { label: "1 - Sangat Tidak Tertarik", value: "1", score: 1 },
    { label: "2 - Kurang Tertarik", value: "2", score: 2 },
    { label: "3 - Netral / Cukup", value: "3", score: 3 },
    { label: "4 - Tertarik", value: "4", score: 4 },
    { label: "5 - Sangat Tertarik", value: "5", score: 5 },
  ]);

  for (const q of riasecQuestions) {
    await db.execute({
      sql: `INSERT INTO assessment_questions (id, assessment_id, question_text, question_type, dimension, order_num, options_json) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      args: [q[0], q[1], q[2], q[3], q[4], q[5], standardLikertOptions],
    });
  }

  // 6. OPPORTUNITIES
  const oppBangkit = "opp-bangkit-001";
  const oppBri = "opp-bri-002";
  const oppBim = "opp-bim-003";
  const oppGoto = "opp-goto-004";

  const opportunitiesData = [
    [
      oppBangkit,
      "Bangkit Academy 2026 - Machine Learning & Cloud Path",
      "TRAINING",
      "Google, GoTo, Traveloka & Kemendikbudristek",
      "Nasional (Indonesia)",
      "REMOTE",
      "MAHASISWA",
      "Program kesiapan karier intensif berstandar industri dengan sertifikasi internasional Google, capstone project beregu, dan mentoring mingguan.",
      JSON.stringify(["Mahasiswa aktif D4/S1 semester 5 ke atas", "Memiliki komitmen 20 jam/minggu", "Memiliki dasar pemrograman"]),
      "2026-11-30",
      "https://grow.google/intl/id_id/bangkit/",
      1
    ],
    [
      oppBri,
      "BRI Future Data Specialist Internship Program",
      "INTERNSHIP",
      "PT Bank Rakyat Indonesia (Persero) Tbk",
      "Jakarta Pusat",
      "HYBRID",
      "MAHASISWA",
      "Program magang bersertifikat di divisi Big Data & Analytics BRI untuk memecahkan kasus analitik perbankan nyata.",
      JSON.stringify(["Mahasiswa jurusan Teknik Informatika, Ilmu Komputer, atau Statistika", "Menguasai SQL dan Python dasar", "Portofolio proyek analitik data"]),
      "2026-12-15",
      "https://recruitment.bri.co.id",
      1
    ],
    [
      oppBim,
      "Beasiswa Indonesia Maju (BIM) Program Persiapan S1 Luar Negeri",
      "SCHOLARSHIP",
      "Pusat Prestasi Nasional (Puspresnas) Kemendikbud",
      "Jakarta",
      "ON_SITE",
      "SMA_SMK",
      "Beasiswa pembinaan dan pendanaan penuh studi sarjana ke perguruan tinggi top dunia bagi siswa berprestasi talenta nasional.",
      JSON.stringify(["Siswa kelas 11 SMA/SMK/MA sederajat", "Memiliki prestasi minimal tingkat provinsi/nasional", "Kemampuan bahasa Inggris aktif"]),
      "2026-10-31",
      "https://pusatprestasinasional.kemdikbud.go.id",
      1
    ],
    [
      oppGoto,
      "Associate Software Engineer Graduate Program",
      "JOB",
      "GoTo Group",
      "Jakarta Selatan",
      "HYBRID",
      "SEMUA",
      "Jalur percepatan karier untuk fresh graduate berbakat dengan rotasi tim engineering, pendampingan senior tech lead, dan kompensasi kompetitif.",
      JSON.stringify(["Lulusan S1/D4 maksimal 1 tahun kelulusan", "Memiliki portofolio aplikasi atau repositori GitHub publik", "Memahami konsep data structures & algorithms"]),
      "2026-12-31",
      "https://www.gotocompany.com/careers",
      1
    ]
  ];

  for (const opp of opportunitiesData) {
    await db.execute({
      sql: `INSERT INTO opportunities (id, title, type, organization, location, work_type, education_level, description, requirements_json, deadline, url, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: opp,
    });
  }

  // Map opportunity competencies
  await db.execute({
    sql: `INSERT INTO opportunity_competencies (id, opportunity_id, competency_id, is_mandatory) VALUES (?, ?, ?, ?);`,
    args: ["oc-bangkit-py", oppBangkit, compPython, 1],
  });
  await db.execute({
    sql: `INSERT INTO opportunity_competencies (id, opportunity_id, competency_id, is_mandatory) VALUES (?, ?, ?, ?);`,
    args: ["oc-bri-sql", oppBri, compSql, 1],
  });
  await db.execute({
    sql: `INSERT INTO opportunity_competencies (id, opportunity_id, competency_id, is_mandatory) VALUES (?, ?, ?, ?);`,
    args: ["oc-goto-py", oppGoto, compPython, 1],
  });

  // 7. DEMO USERS ACROSS PERSONAS
  const userBudiId = "user-budi-smp";
  const userSitiId = "user-siti-sma";
  const userRezaId = "user-reza-mhs";
  const userDewiId = "user-dewi-final";
  const userHilmanId = "user-hilman-polinema";
  const userMentorId = "user-mentor-sarah";
  const userInstAdminId = "user-admin-itb";
  const userSysAdminId = "user-superadmin";

  const users = [
    [userHilmanId, "budiarto3788@gmail.com", passwordHash, "Hilman Zahrawa Budiarto", "STUDENT", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"],
    [userBudiId, "budi.explore@careerpath.id", passwordHash, "Budi Pratama (SMP)", "STUDENT", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"],
    [userSitiId, "siti.plan@careerpath.id", passwordHash, "Siti Rahmawati (SMA)", "STUDENT", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"],
    [userRezaId, "reza.develop@careerpath.id", passwordHash, "Reza Kurniawan (Mahasiswa)", "STUDENT", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"],
    [userDewiId, "dewi.ready@careerpath.id", passwordHash, "Dewi Anggraini (Mahasiswa Akhir)", "STUDENT", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"],
    [userMentorId, "mentor.sarah@careerpath.id", passwordHash, "Sarah Wulandari, M.Psi., Psikolog", "MENTOR", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"],
    [userInstAdminId, "admin.itb@careerpath.id", passwordHash, "Administrator ITB Career Center", "INSTITUTION_ADMIN", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"],
    [userSysAdminId, "superadmin@careerpath.id", passwordHash, "Platform Lead Administrator", "PLATFORM_ADMIN", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"],
  ];

  for (const u of users) {
    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, full_name, role, avatar_url) VALUES (?, ?, ?, ?, ?, ?);`,
      args: u,
    });
  }

  // Profiles
  const profiles = [
    // Hilman: Mahasiswa D4 Polinema, L4 Ready, target Software Engineer / Full-Stack
    [userHilmanId, "MAHASISWA", "READY", 94, occSweId, "Business Information Systems student at Politeknik Negeri Malang and Djarum Beasiswa Plus recipient with strong interest in software development (Next.js, TypeScript, Laravel) and UI/UX design. Former President of HMTI Polinema and Full-Stack Web Developer in enterprise systems.", "+6285806003234", "Software Development, Full-Stack Web Development, UI/UX Design, Human Resource Information Systems (HRIS), Cloud Solutions", 1],
    // Budi: SMP, L1 Explore, no target yet, curiosity in tech
    [userBudiId, "SMP", "EXPLORE", 15, null, "Siswa kelas 8 yang suka utak-atik komputer dan penasaran dengan dunia teknologi.", "081234567801", "Teknologi, Game, Robotika", 0],
    // Siti: SMA, L2 Plan, target UI/UX, preparing major
    [userSitiId, "SMA", "PLAN", 45, occUxId, "Siswi kelas 11 jurusan IPA yang gemar menggambar dan ingin kuliah di jurusan DKV atau Informatika.", "081234567802", "Desain Grafis, Psikologi, UI Design", 1],
    // Reza: Mahasiswa S1, L3 Develop, target Data Scientist, active IDP
    [userRezaId, "MAHASISWA", "DEVELOP", 70, occDsId, "Mahasiswa Teknik Informatika semester 5 berfokus pada Data Science & Machine Learning.", "081234567803", "Data Science, Python, AI, FinTech", 1],
    // Dewi: Mahasiswa Akhir, L4 Ready, target Software Engineer, complete portfolio
    [userDewiId, "MAHASISWA_AKHIR", "READY", 92, occSweId, "Mahasiswi Ilmu Komputer semester 7 yang siap memasuki dunia kerja sebagai Full-Stack / Backend Engineer.", "081234567804", "Software Engineering, Cloud Computing, System Design", 1],
    // Mentor Sarah
    [userMentorId, "UMUM", "READY", 100, null, "Konselor karier dan psikolog perkembangan dengan pengalaman 8 tahun membimbing mahasiswa ke dunia profesional.", "081234567805", "Mentoring Karier, Psikometri, Asesmen Bakat", 1],
    // Institution Admin
    [userInstAdminId, "UMUM", "READY", 100, null, "Pusat Pengembangan Karier ITB Bandung.", "081234567806", "Manajemen Institusi, Kemitraan Kampus", 1],
    // System Admin
    [userSysAdminId, "UMUM", "READY", 100, null, "Super Administrator CareerPath AI Platform.", "081234567807", "Tata Kelola Sistem", 1],
  ];

  for (const p of profiles) {
    await db.execute({
      sql: `INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, target_career_id, bio, phone, interests, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      args: p,
    });
  }

  // Memberships & Pairings
  await db.execute({
    sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES (?, ?, ?, ?, ?);`,
    args: ["mem-budi", userBudiId, instSmaId, "STUDENT", "NISN-008123"],
  });
  await db.execute({
    sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES (?, ?, ?, ?, ?);`,
    args: ["mem-reza", userRezaId, instItbId, "STUDENT", "13522045"],
  });
  await db.execute({
    sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES (?, ?, ?, ?, ?);`,
    args: ["mem-dewi", userDewiId, instItbId, "STUDENT", "13521098"],
  });
  await db.execute({
    sql: `INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES (?, ?, ?, ?, ?);`,
    args: ["mem-mentor", userMentorId, instItbId, "MENTOR", "NIP-19850412"],
  });

  // Assign Mentor Sarah to Reza and Dewi
  await db.execute({
    sql: `INSERT INTO mentor_assignments (id, mentor_id, mentee_id, institution_id, status) VALUES (?, ?, ?, ?, ?);`,
    args: ["assign-reza", userMentorId, userRezaId, instItbId, "ACTIVE"],
  });
  await db.execute({
    sql: `INSERT INTO mentor_assignments (id, mentor_id, mentee_id, institution_id, status) VALUES (?, ?, ?, ?, ?);`,
    args: ["assign-dewi", userMentorId, userDewiId, instItbId, "ACTIVE"],
  });

  // 8. ASSESSMENT ATTEMPTS & RESULTS FOR REZA AND DEWI
  // Reza: High Investigative (14/15) & Realistic (13/15)
  const attemptRezaId = "att-reza-001";
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `INSERT INTO assessment_attempts (id, user_id, assessment_id, version, status, started_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    args: [attemptRezaId, userRezaId, assessRiasecId, 1, "EVALUATED", sevenDaysAgo, sevenDaysAgo],
  });

  const rezaDimensions = JSON.stringify({
    REALISTIC: 13,
    INVESTIGATIVE: 15,
    ARTISTIC: 8,
    SOCIAL: 9,
    ENTERPRISING: 10,
    CONVENTIONAL: 12,
  });

  await db.execute({
    sql: `INSERT INTO assessment_results (id, attempt_id, user_id, assessment_id, summary, primary_dimension, secondary_dimension, dimensions_json, interpretation, next_steps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      "res-reza-001",
      attemptRezaId,
      userRezaId,
      assessRiasecId,
      "Tipe Kepribadian Holland: IRC (Investigative, Realistic, Conventional)",
      "INVESTIGATIVE",
      "REALISTIC",
      rezaDimensions,
      "Kamu memiliki dorongan analitis yang sangat kuat, menyukai penyelidikan logis berbasis fakta dan data empiris, serta menikmati eksekusi solusi teknis.",
      "Fokuskan pengembangan pada penguasaan algoritma Machine Learning, SQL tingkat lanjut, dan bangun portofolio proyek data end-to-end."
    ],
  });

  // Career recommendations for Reza
  await db.execute({
    sql: `INSERT INTO career_recommendations (id, user_id, occupation_id, match_score, match_factors_json) VALUES (?, ?, ?, ?, ?);`,
    args: [
      "rec-reza-ds",
      userRezaId,
      occDsId,
      94,
      JSON.stringify({
        interest_fit: "Profil Investigative (15/15) dan Conventional (12/15) sangat sinkron dengan profesi Data Scientist",
        matched_skills: ["Python Programming", "SQL"],
        gap_skills: ["Machine Learning Fundamentals"],
        education_fit: "Mahasiswa S1 Teknik Informatika"
      })
    ],
  });

  await db.execute({
    sql: `INSERT INTO career_recommendations (id, user_id, occupation_id, match_score, match_factors_json) VALUES (?, ?, ?, ?, ?);`,
    args: [
      "rec-reza-swe",
      userRezaId,
      occSweId,
      88,
      JSON.stringify({
        interest_fit: "Profil Investigative dan Realistic mendukung rekayasa perangkat lunak teknis",
        matched_skills: ["Python Programming", "Problem Solving"],
        gap_skills: ["System Architecture"],
        education_fit: "Mahasiswa S1 Teknik Informatika"
      })
    ],
  });

  // 9. IDP & ACTIVITIES FOR REZA
  const planRezaId = "plan-reza-001";
  await db.execute({
    sql: `INSERT INTO development_plans (id, user_id, target_career_id, title, rationale, status, progress_percentage, target_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      planRezaId,
      userRezaId,
      occDsId,
      "Roadmap Persiapan Karier Data Scientist 2026",
      "Menutup kesenjangan kompetensi Machine Learning dan membangun portofolio model prediktif untuk melamar magang industri.",
      "ACTIVE",
      66,
      "2026-12-31"
    ],
  });

  const actReza1 = "act-reza-01";
  const actReza2 = "act-reza-02";
  const actReza3 = "act-reza-03";

  await db.execute({
    sql: `INSERT INTO development_activities (id, plan_id, competency_id, title, description, priority, target_date, status, success_indicators) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [actReza1, planRezaId, compPython, "Menyelesaikan Sertifikasi Python Data Analysis", "Menyelesaikan 10 modul pandas, numpy, dan visualisasi data seaborn.", "HIGH", "2026-05-30", "COMPLETED", "Sertifikat kelulusan kursus online"],
  });

  await db.execute({
    sql: `INSERT INTO development_activities (id, plan_id, competency_id, title, description, priority, target_date, status, success_indicators) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [actReza2, planRezaId, compSql, "Membangun Database Relasional Kasus E-Commerce", "Merancang skema 3NF dengan PostgreSQL dan menulis 15 query agregasi kompleks.", "HIGH", "2026-06-30", "COMPLETED", "Repositori GitHub dengan file schema.sql dan dokumentasi"],
  });

  await db.execute({
    sql: `INSERT INTO development_activities (id, plan_id, competency_id, title, description, priority, target_date, status, success_indicators) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [actReza3, planRezaId, compMl, "Deploy Model Prediksi Churn Pelanggan", "Melatih model Random Forest dan deploy sebagai REST API menggunakan FastAPI.", "HIGH", "2026-08-31", "IN_PROGRESS", "URL API aktif di HuggingFace Spaces atau Render"],
  });

  // 10. PORTFOLIO & EVIDENCE FOR REZA
  const portRezaId = "port-reza-001";
  await db.execute({
    sql: `INSERT INTO portfolios (id, user_id, title, summary, is_public) VALUES (?, ?, ?, ?, ?);`,
    args: [portRezaId, userRezaId, "Reza Kurniawan - Data Science & AI Portfolio", "Portofolio proyek analitik data, visualisasi interaktif, dan pipeline pembelajaran mesin.", 1],
  });

  const portItemReza1 = "item-reza-001";
  await db.execute({
    sql: `INSERT INTO portfolio_items (id, portfolio_id, user_id, title, description, category, role, project_url, start_date, end_date, tools_used, is_public) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      portItemReza1,
      portRezaId,
      userRezaId,
      "E-Commerce Customer Transaction Analytics",
      "Analisis cohort 100.000 transaksi pelanggan e-commerce untuk mengidentifikasi perilaku repeat order dan retensi.",
      "PROJECT",
      "Lead Data Analyst",
      "https://github.com/rezakurniawan/ecommerce-analytics",
      "2026-01-10",
      "2026-02-28",
      "Python, Pandas, PostgreSQL, Streamlit",
      1
    ],
  });

  // Evidence file for Reza
  const evidReza1 = "evid-reza-001";
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  await db.execute({
    sql: `INSERT INTO evidence_files (id, user_id, portfolio_item_id, activity_id, title, file_url, file_type, file_size, validation_status, reviewed_by, reviewed_at, review_feedback) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      evidReza1,
      userRezaId,
      portItemReza1,
      actReza1,
      "Sertifikat Kelulusan Data Analysis with Python",
      "https://certificates.example.com/reza-python-data-cert.pdf",
      "application/pdf",
      1240000,
      "VALIDATED",
      userMentorId,
      twoDaysAgo,
      "Bukti terverifikasi sah. Silabus mencakup data cleaning, eksplorasi EDA, dan visualisasi data komprehensif."
    ],
  });

  // Competency evidence: Python is MENTOR_VALIDATED, SQL is EVIDENCE_BACKED, ML is CLAIMED
  await db.execute({
    sql: `INSERT INTO competency_evidence (id, user_id, competency_id, evidence_file_id, tier, validated_at) VALUES (?, ?, ?, ?, ?, ?);`,
    args: ["ce-reza-py", userRezaId, compPython, evidReza1, "MENTOR_VALIDATED", twoDaysAgo],
  });

  await db.execute({
    sql: `INSERT INTO competency_evidence (id, user_id, competency_id, evidence_file_id, tier, validated_at) VALUES (?, ?, ?, ?, ?, null);`,
    args: ["ce-reza-sql", userRezaId, compSql, null, "EVIDENCE_BACKED"],
  });

  await db.execute({
    sql: `INSERT INTO competency_evidence (id, user_id, competency_id, evidence_file_id, tier, validated_at) VALUES (?, ?, ?, ?, ?, null);`,
    args: ["ce-reza-ml", userRezaId, compMl, null, "CLAIMED"],
  });

  // 11. MENTORING TASKS & COMMENTS
  await db.execute({
    sql: `INSERT INTO mentoring_tasks (id, mentor_id, mentee_id, title, description, due_date, status) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    args: [
      "task-reza-01",
      userMentorId,
      userRezaId,
      "Perbaiki Dokumentasi Readme Repositori Analitik",
      "Tambahkan diagram pipeline data dan ringkasan insight bisnis utama pada file README.md di repositori GitHub.",
      "2026-05-15",
      "PENDING"
    ],
  });

  const discRezaId = "disc-reza-01";
  await db.execute({
    sql: `INSERT INTO mentoring_discussions (id, mentor_id, mentee_id, target_type, target_id, title) VALUES (?, ?, ?, ?, ?, ?);`,
    args: [discRezaId, userMentorId, userRezaId, "IDP", planRezaId, "Diskusi Target Portofolio Machine Learning"],
  });

  await db.execute({
    sql: `INSERT INTO mentoring_comments (id, discussion_id, user_id, message) VALUES (?, ?, ?, ?);`,
    args: ["comm-1", discRezaId, userMentorId, "Halo Reza, rencana IDP kamu sangat terarah. Pastikan proyek ketiga menggunakan evaluasi metrik F1-Score karena dataset churn umumnya tidak seimbang (imbalanced)."],
  });

  await db.execute({
    sql: `INSERT INTO mentoring_comments (id, discussion_id, user_id, message) VALUES (?, ?, ?, ?);`,
    args: ["comm-2", discRezaId, userRezaId, "Terima kasih banyak masukannya Bu Sarah! Saya akan menggunakan SMOTE dan melampirkan ROC-AUC curve pada evaluasi."],
  });

  // 12. AUDIT LOGS
  await db.execute({
    sql: `INSERT INTO audit_logs (id, user_id, action, resource, resource_id, details_json, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    args: [
      "audit-init-01",
      userSysAdminId,
      "SYSTEM_INITIALIZATION",
      "DATABASE",
      "master_catalog",
      JSON.stringify({ status: "SUCCESS", records_seeded: 120 }),
      "127.0.0.1"
    ],
  });

    hasSeeded = true;
  })();

  return seedPromise;
}
