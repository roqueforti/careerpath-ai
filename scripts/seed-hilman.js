const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

async function seedHilman() {
  console.log("=== SEEDING HILMAN ZAHRAWA BUDIARTO ACCOUNT ===");

  let dbUrl = "postgresql://postgres@127.0.0.1:5432/careerpath_ai_db";
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("DATABASE_URL=")) {
        dbUrl = trimmed.split("=")[1].replace(/^["']|["']$/g, "").trim();
      }
    }
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("DemoPass123!", salt);

    const userId = "user-hilman-polinema";
    const email = "budiarto3788@gmail.com";
    const fullName = "Hilman Zahrawa Budiarto";
    const phone = "+6285806003234";
    const avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

    // 1. Check or Insert User
    const existing = await pool.query("SELECT id FROM users WHERE email = $1 OR id = $2;", [email, userId]);
    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (id, email, password_hash, full_name, role, avatar_url)
         VALUES ($1, $2, $3, $4, 'STUDENT', $5);`,
        [userId, email, passwordHash, fullName, avatarUrl]
      );
      console.log("✓ User created in users table:", email);
    } else {
      console.log("ℹ User already exists with email:", email);
    }

    // 2. Institution: Politeknik Negeri Malang
    const instId = "inst-polinema-001";
    await pool.query(
      `INSERT INTO institutions (id, name, type, code, address)
       VALUES ($1, $2, 'UNIVERSITAS', 'POLINEMA-JTI', 'Jl. Soekarno Hatta No. 9, Malang')
       ON CONFLICT (id) DO NOTHING;`,
      [instId, "Politeknik Negeri Malang (Polinema) - JTI"]
    );

    // 3. Profile
    const bio =
      "Business Information Systems student at Politeknik Negeri Malang and Djarum Beasiswa Plus recipient with strong interest in software development (Next.js, TypeScript, Laravel) and UI/UX design. Former President of HMTI Polinema and Web Developer at PT PAL Indonesia.";
    const interests =
      "Software Development, Full-Stack Web Development, UI/UX Design, Human Resource Information Systems (HRIS), Cloud Solutions";

    await pool.query(
      `INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, target_career_id, bio, phone, interests, is_public)
       VALUES ($1, 'MAHASISWA', 'READY', 94, 'occ-swe-001', $2, $3, $4, 1)
       ON CONFLICT (id) DO UPDATE SET
         education_level = EXCLUDED.education_level,
         career_maturity = EXCLUDED.career_maturity,
         career_maturity_score = EXCLUDED.career_maturity_score,
         target_career_id = EXCLUDED.target_career_id,
         bio = EXCLUDED.bio,
         phone = EXCLUDED.phone,
         interests = EXCLUDED.interests;`,
      [userId, bio, phone, interests]
    );
    console.log("✓ Profile updated for Hilman Zahrawa Budiarto");

    // 4. Institution Membership
    await pool.query(
      `INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number)
       VALUES ('mem-hilman-polinema', $1, $2, 'STUDENT', '2241720001 (D4 Sistem Informasi Bisnis)')
       ON CONFLICT (id) DO NOTHING;`,
      [userId, instId]
    );

    // 5. Assessment RIASEC Result
    const attemptId = "att-hilman-001";
    const assessRiasecId = "assess-riasec-001";
    await pool.query(
      `INSERT INTO assessment_attempts (id, user_id, assessment_id, version, status, started_at, completed_at)
       VALUES ($1, $2, $3, 1, 'EVALUATED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO NOTHING;`,
      [attemptId, userId, assessRiasecId]
    );

    const dimensionsJson = JSON.stringify({
      REALISTIC: 13,
      INVESTIGATIVE: 15,
      ARTISTIC: 14,
      SOCIAL: 12,
      ENTERPRISING: 15,
      CONVENTIONAL: 12,
    });

    const interpretation =
      "Hilman memiliki keunggulan ganda yang langka: penalaran komputasi dan arsitektur software engineering tingkat tinggi (Investigative), dipadukan dengan kepemimpinan organisasi strategis (Enterprising - Chairman HMTI & Djarum Beasiswa Plus) serta sentuhan estetika interaktif pengguna (Artistic - UI/UX Designer).";

    const nextSteps =
      "Terus kembangkan sistem skala tinggi (seperti yang telah dikerjakan di PT PAL Indonesia dan BrewTech SaaS), perkuat arsitektur microservices dan cloud containerization, dan persiapkan portofolio untuk melangkah ke level Tech Lead / Senior Software Engineer.";

    await pool.query(
      `INSERT INTO assessment_results (id, attempt_id, user_id, assessment_id, summary, primary_dimension, secondary_dimension, dimensions_json, interpretation, next_steps)
       VALUES ('res-hilman-001', $1, $2, $3, 'Tipe Kepribadian Holland: IER (Investigative, Enterprising, Realistic) & ASI (Artistic, Social, Investigative)', 'INVESTIGATIVE', 'ENTERPRISING', $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         summary = EXCLUDED.summary,
         dimensions_json = EXCLUDED.dimensions_json,
         interpretation = EXCLUDED.interpretation,
         next_steps = EXCLUDED.next_steps;`,
      [attemptId, userId, assessRiasecId, dimensionsJson, interpretation, nextSteps]
    );

    // 6. Career Recommendations
    await pool.query(
      `INSERT INTO career_recommendations (id, user_id, occupation_id, match_score, match_factors_json)
       VALUES ('rec-hilman-swe', $1, 'occ-swe-001', 98, $2)
       ON CONFLICT (id) DO UPDATE SET match_score = 98;`,
      [
        userId,
        JSON.stringify({
          interest_fit: "Pengalaman Web Developer di PT PAL Indonesia dan BrewTech SaaS sangat selaras (98% match).",
          matched_skills: ["React.js", "Next.js", "TypeScript", "Laravel", "PHP", "Tailwind CSS", "SQL", "Python"],
          gap_skills: ["Advanced Distributed Systems", "Kubernetes Orchestration"],
          education_fit: "D4 Sistem Informasi Bisnis Politeknik Negeri Malang (IPK 3.63/4.00)",
        }),
      ]
    );

    await pool.query(
      `INSERT INTO career_recommendations (id, user_id, occupation_id, match_score, match_factors_json)
       VALUES ('rec-hilman-ux', $1, 'occ-ux-003', 94, $2)
       ON CONFLICT (id) DO UPDATE SET match_score = 94;`,
      [
        userId,
        JSON.stringify({
          interest_fit: "Pengalaman UI/UX Designer di Profile Image Studio & Disnakertrans Jatim.",
          matched_skills: ["Figma UI Prototyping", "User Research", "Wireframing", "Design System"],
          gap_skills: ["Advanced Usability Metrics"],
          education_fit: "Portofolio ProFile+ HR Management & Disnakertrans Jatim",
        }),
      ]
    );

    // 7. Development Plan (IDP)
    const planId = "plan-hilman-001";
    await pool.query(
      `INSERT INTO development_plans (id, user_id, target_career_id, title, rationale, status, progress_percentage, target_end_date)
       VALUES ($1, $2, 'occ-swe-001', 'Roadmap Karier Full-Stack Software Engineer & Tech Lead 2026', 'Akselerasi dari Web Developer di PT PAL Indonesia menuju Senior Software Engineer / Tech Lead dengan bukti sistem berskala tinggi.', 'ACTIVE', 75, '2026-12-31')
       ON CONFLICT (id) DO UPDATE SET
         progress_percentage = 75,
         title = EXCLUDED.title;`,
      [planId, userId]
    );

    // Activities
    const activities = [
      ["act-hil-01", planId, "comp-py-001", "Pengembangan HR Information Systems PT PAL Indonesia", "Membangun sistem rekrutmen karyawan, online correspondence, dan aplikasi meal ordering untuk HCM PT PAL Indonesia.", "HIGH", "2026-05-30", "COMPLETED", "Sistem HRIS berjalan aktif di PT PAL Indonesia"],
      ["act-hil-02", planId, "comp-sql-002", "Pembangunan SaaS Platform BrewTech untuk Vokasi Disabilitas", "Mengembangkan platform SaaS LMS dan Decision Support System untuk vokasi barista penyandang disabilitas (Djarum Beasiswa Plus & Innovillage).", "HIGH", "2026-06-30", "COMPLETED", "BrewTech platform terintegrasi dengan mitra kafe"],
      ["act-hil-03", planId, "comp-figma-004", "Redesain UI/UX & CMS Portal Disnakertrans Jatim", "Merancang desain antarmuka modern yang user-friendly dan CMS dashboard efisiensi birokrasi Disnakertrans Jawa Timur.", "HIGH", "2026-07-31", "COMPLETED", "Mockup Figma & Live Website Disnakertrans Jatim"],
      ["act-hil-04", planId, "comp-probsol-007", "Optimasi Arsitektur Cloud Microservices & Scalability", "Menerapkan clean architecture, containerization Docker, dan integrasi CI/CD automated deployment.", "HIGH", "2026-09-30", "IN_PROGRESS", "Dokumentasi sistem arsitektur & pipeline CI/CD"],
    ];

    for (const act of activities) {
      await pool.query(
        `INSERT INTO development_activities (id, plan_id, competency_id, title, description, priority, target_date, status, success_indicators)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;`,
        act
      );
    }

    // 8. Portfolio
    const portId = "port-hilman-001";
    await pool.query(
      `INSERT INTO portfolios (id, user_id, title, summary, is_public)
       VALUES ($1, $2, 'Portofolio Profesional Hilman Zahrawa Budiarto', 'Kumpulan proyek software engineering, web development (Next.js, Laravel, TypeScript), dan desain UI/UX terverifikasi.', 1)
       ON CONFLICT (id) DO NOTHING;`,
      [portId, userId]
    );

    const portfolioItems = [
      ["pi-hil-01", portId, userId, "PT PAL Indonesia HR Information Systems (HRIS)", "Pengembangan sistem HRIS untuk HCM PT PAL Indonesia: rekrutmen karyawan, persuratan digital, dan otomasi meal ordering.", "EXPERIENCE", "Web Developer", "https://linkedin.com/in/hilmanzahrawa", "Apr 2026", "Present", "Laravel, React, PostgreSQL, Docker"],
      ["pi-hil-02", portId, userId, "BrewTech SaaS Platform - Mandala Pure Love", "Platform SaaS edukasi vokasi barista disabilitas dengan LMS terintegrasi dan sistem pendukung keputusan (Djarum Beasiswa Plus).", "PROJECT", "Full-Stack Developer", "https://hilmanzahrawa.vercel.app", "Sep 2025", "Apr 2026", "Next.js, TypeScript, Tailwind CSS, Supabase"],
      ["pi-hil-03", portId, userId, "ProFile+ HR Management & Portal Disnakertrans Jatim", "Perancangan UI/UX sistem manajemen SDM dan situs resmi Dinas Tenaga Kerja dan Transmigrasi Provinsi Jawa Timur.", "EXPERIENCE", "UI/UX Designer Magang", "https://hilmanzahrawa.vercel.app", "Aug 2025", "Dec 2025", "Figma, CMS Dashboard, Usability Testing"],
      ["pi-hil-04", portId, userId, "Website Polinema Creative Center", "Platform showcase karya kreatif mahasiswa Politeknik Negeri Malang.", "PROJECT", "Frontend Developer", "https://roqueforti.github.io/Polinema-Creative-Center", "Jan 2024", "Dec 2024", "JavaScript, HTML5, CSS3, Tailwind CSS"],
      ["pi-hil-05", portId, userId, "Djarum Beasiswa Plus 2024/2025 Recipient", "Penerima beasiswa bergengsi tingkat nasional Djarum Beasiswa Plus dengan pelatihan kepemimpinan Outward Bound Indonesia.", "CERTIFICATE", "Awardee & Leadership Fellow", "https://djarumbeasiswaplus.org", "Aug 2024", "Aug 2025", "Leadership, Public Speaking, Social Project"],
    ];

    for (const item of portfolioItems) {
      await pool.query(
        `INSERT INTO portfolio_items (id, portfolio_id, user_id, title, description, category, role, project_url, start_date, end_date, tools_used, is_public)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 1)
         ON CONFLICT (id) DO UPDATE SET
           title = EXCLUDED.title,
           description = EXCLUDED.description,
           category = EXCLUDED.category,
           role = EXCLUDED.role,
           project_url = EXCLUDED.project_url,
           tools_used = EXCLUDED.tools_used;`,
        item
      );
    }

    console.log("✓ Semua data portofolio, IDP, dan asesmen Hilman berhasil disimpan ke database!");
    console.log("==================================================");
    console.log("AKUN HILMAN SIAP DIGUNAKAN:");
    console.log("Email    : budiarto3788@gmail.com");
    console.log("Password : DemoPass123!");
    console.log("Nama     : Hilman Zahrawa Budiarto");
    console.log("Peran    : STUDENT (Mahasiswa D4 Polinema & Web Dev PT PAL)");
    console.log("==================================================");

  } catch (err) {
    console.error("Error seeding Hilman:", err);
  } finally {
    await pool.end();
  }
}

seedHilman();
