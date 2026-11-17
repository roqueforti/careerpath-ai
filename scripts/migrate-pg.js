const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

async function migrateAndSeedPostgres() {
  console.log("Connecting to PostgreSQL at 127.0.0.1:5432/careerpath_ai_db...");

  const pool = new Pool({
    connectionString: "postgresql://postgres@127.0.0.1:5432/careerpath_ai_db",
  });

  try {
    const connCheck = await pool.query("SELECT current_user, current_database(), version();");
    console.log("Connected successfully:", connCheck.rows[0]);

    // Read schema.ts statements
    const schemaFile = fs.readFileSync(path.join(__dirname, "..", "src", "lib", "db", "schema.ts"), "utf-8");
    
    // Extract SQL statements inside template literals
    const sqlRegex = /`\s*(CREATE TABLE[\s\S]*?);?\s*`/g;
    const statements = [];
    let match;
    while ((match = sqlRegex.exec(schemaFile)) !== null) {
      statements.push(match[1].trim());
    }

    console.log(`Found ${statements.length} table creation statements in schema.ts.`);

    for (const stmt of statements) {
      let cleanSql = stmt
        .replace(/\bdatetime\s*\(\s*['"]now['"]\s*\)/gi, "CURRENT_TIMESTAMP")
        .replace(/\(datetime\('now'\)\)/gi, "CURRENT_TIMESTAMP");
      
      try {
        await pool.query(cleanSql);
      } catch (err) {
        console.error("Error executing DDL:", err.message);
        console.error("Statement was:", cleanSql.substring(0, 100));
        throw err;
      }
    }
    console.log("All tables created successfully in PostgreSQL!");

    // Check if users table already has data
    const userCountRes = await pool.query("SELECT COUNT(*) as count FROM users;");
    const userCount = parseInt(userCountRes.rows[0].count, 10);
    console.log(`Current user count in PostgreSQL: ${userCount}`);

    if (userCount === 0) {
      console.log("Seeding PostgreSQL with 7 demo personas and catalog data...");
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash("DemoPass123!", salt);

      // Institutions
      const instItbId = "inst-itb-001";
      const instSmaId = "inst-sma1-002";

      await pool.query(
        "INSERT INTO institutions (id, name, type, code, address) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        [instItbId, "Institut Teknologi Bandung - Career Development Center", "UNIVERSITAS", "ITB-CDC", "Jl. Ganesha No. 10, Bandung"]
      );

      await pool.query(
        "INSERT INTO institutions (id, name, type, code, address) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        [instSmaId, "SMA Negeri 1 Jakarta", "SEKOLAH", "SMAN1-JKT", "Jl. Budi Utomo No. 7, Jakarta Pusat"]
      );

      // Occupations
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
        await pool.query(
          "INSERT INTO occupations (id, title, slug, category, description, holland_code, education_paths, exploration_activities, salary_range, outlook) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING;",
          occ
        );
      }

      // Competencies
      const competenciesData = [
        ["comp-swe-001", "JavaScript & TypeScript", "TECHNICAL", "Pengembangan logika aplikasi dinamis"],
        ["comp-swe-002", "React & Next.js Framework", "TECHNICAL", "Membangun antarmuka web modern"],
        ["comp-swe-003", "Relational Database & SQL", "TECHNICAL", "Perancangan skema data & query teroptimasi"],
        ["comp-ds-001", "Python for Data Science", "TECHNICAL", "Pemrograman analisis data numerik"],
        ["comp-ds-002", "Machine Learning Fundamentals", "TECHNICAL", "Penerapan algoritma supervised & unsupervised"],
        ["comp-ds-003", "Data Visualization (Tableau/Seaborn)", "TECHNICAL", "Komunikasi visual pola analitik data"],
        ["comp-ux-001", "Figma & Wireframing", "TECHNICAL", "Pembuatan prototipe UI interaktif"],
        ["comp-ux-002", "User Research & Usability Testing", "METHODOLOGY", "Wawancara pengguna & evaluasi kemudahan pakai"],
        ["comp-gen-001", "Critical Thinking & Problem Solving", "SOFT_SKILL", "Analisis sistematis pemecahan masalah kompleks"],
        ["comp-gen-002", "Asynchronous Collaboration", "SOFT_SKILL", "Komunikasi kerja tim jarak jauh yang efektif"],
      ];

      for (const comp of competenciesData) {
        await pool.query(
          "INSERT INTO competencies (id, name, category, description, code) VALUES ($1, $2, $3, $4, $1) ON CONFLICT (id) DO NOTHING;",
          comp
        );
      }

      // Occupation Competency Matrix
      const occCompLinks = [
        ["occ-swe-001", "comp-swe-001", "ADVANCED", "CRITICAL"],
        ["occ-swe-001", "comp-swe-002", "ADVANCED", "CRITICAL"],
        ["occ-swe-001", "comp-swe-003", "INTERMEDIATE", "IMPORTANT"],
        ["occ-swe-001", "comp-gen-001", "ADVANCED", "CRITICAL"],
        ["occ-ds-001", "comp-ds-001", "ADVANCED", "CRITICAL"],
        ["occ-ds-001", "comp-ds-002", "INTERMEDIATE", "CRITICAL"],
        ["occ-ds-001", "comp-ds-003", "INTERMEDIATE", "IMPORTANT"],
        ["occ-ux-001", "comp-ux-001", "ADVANCED", "CRITICAL"],
        ["occ-ux-001", "comp-ux-002", "INTERMEDIATE", "CRITICAL"],
      ];

      for (let i = 0; i < occCompLinks.length; i++) {
        const [occId, compId, level, imp] = occCompLinks[i];
        await pool.query(
          "INSERT INTO occupation_competencies (id, occupation_id, competency_id, expected_level, importance) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
          [`occomp-${i + 1}`, occId, compId, level, imp]
        );
      }

      // Assessments (Holland RIASEC)
      const asmId = "asm-riasec-001";
      await pool.query(
        "INSERT INTO assessments (id, title, slug, description, assessment_type, instruction, min_education_level, version, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING;",
        [
          asmId,
          "Asesmen Minat Holland RIASEC v1.0",
          "holland-riasec-v1",
          "Instrumen psikometri baku 6 tipe kepribadian lingkungan kerja: Realistic, Investigative, Artistic, Social, Enterprising, Conventional.",
          "INTEREST_RIASEC",
          "Pilihlah skala 1 (Sangat Tidak Suka) hingga 5 (Sangat Suka) sesuai kecenderungan alami pribadimu.",
          "SMP",
          1,
          1,
        ]
      );

      // Assessment Questions (24 Questions, 4 per dimension)
      const dimensions = [
        { dim: "REALISTIC", text: "Merakit perangkat elektronik, memprogram robot, atau memperbaiki alat mekanis." },
        { dim: "INVESTIGATIVE", text: "Menganalisis data, memecahkan teka-teki logika matematika, atau meriset jurnal." },
        { dim: "ARTISTIC", text: "Merancang visual antarmuka, membuat ilustrasi grafis, atau menulis cerita kreatif." },
        { dim: "SOCIAL", text: "Membimbing orang lain, mendengarkan curhat teman, atau mengajar topik baru." },
        { dim: "ENTERPRISING", text: "Mempresentasikan ide bisnis, meyakinkan orang lain, atau memimpin tim proyek." },
        { dim: "CONVENTIONAL", text: "Menata arsip dokumen secara rapi, mematuhi checklist sistematis, atau audit anggaran." },
      ];

      let qIndex = 1;
      for (const d of dimensions) {
        for (let j = 1; j <= 4; j++) {
          const optionsJson = JSON.stringify([
            { label: "1 - Sangat Tidak Minat", value: "1", score: 1 },
            { label: "2 - Tidak Minat", value: "2", score: 2 },
            { label: "3 - Netral / Ragu", value: "3", score: 3 },
            { label: "4 - Minat", value: "4", score: 4 },
            { label: "5 - Sangat Minat", value: "5", score: 5 },
          ]);
          await pool.query(
            "INSERT INTO assessment_questions (id, assessment_id, question_text, question_type, dimension, order_num, options_json) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING;",
            [`q-${qIndex}`, asmId, `${d.text} (Variasi butir evaluasi ${j})`, "LIKERT_5", d.dim, qIndex, optionsJson]
          );
          qIndex++;
        }
      }

      // Users
      const userBudiId = "user-budi";
      const userSitiId = "user-siti";
      const userRezaId = "user-reza";
      const userDewiId = "user-dewi";
      const userMentorId = "user-mentor";
      const userInstAdminId = "user-admin-itb";
      const userSysAdminId = "user-superadmin";

      const users = [
        [userBudiId, "budi.explore@careerpath.id", passwordHash, "Budi Pratama (SMP)", "STUDENT", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"],
        [userSitiId, "siti.plan@careerpath.id", passwordHash, "Siti Rahmawati (SMA)", "STUDENT", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150"],
        [userRezaId, "reza.develop@careerpath.id", passwordHash, "Reza Kurniawan (Mahasiswa)", "STUDENT", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"],
        [userDewiId, "dewi.ready@careerpath.id", passwordHash, "Dewi Anggraini (Mahasiswa Akhir)", "STUDENT", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"],
        [userMentorId, "mentor.sarah@careerpath.id", passwordHash, "Sarah Wulandari, M.Psi., Psikolog", "MENTOR", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"],
        [userInstAdminId, "admin.itb@careerpath.id", passwordHash, "Administrator ITB Career Center", "INSTITUTION_ADMIN", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"],
        [userSysAdminId, "superadmin@careerpath.id", passwordHash, "Platform Lead Administrator", "PLATFORM_ADMIN", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150"],
      ];

      for (const u of users) {
        await pool.query(
          "INSERT INTO users (id, email, password_hash, full_name, role, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING;",
          u
        );
      }

      // Profiles
      const profiles = [
        [userBudiId, "SMP", "EXPLORE", 15, null, "Siswa kelas 8 yang suka utak-atik komputer dan penasaran dengan dunia teknologi.", "081234567801", "Teknologi, Game, Robotika", 0],
        [userSitiId, "SMA", "PLAN", 45, occUxId, "Siswi kelas 11 jurusan IPA yang gemar menggambar dan ingin kuliah di jurusan DKV atau Informatika.", "081234567802", "Desain Grafis, Psikologi, UI Design", 1],
        [userRezaId, "MAHASISWA", "DEVELOP", 70, occDsId, "Mahasiswa Teknik Informatika semester 5 berfokus pada Data Science & Machine Learning.", "081234567803", "Data Science, Python, AI, FinTech", 1],
        [userDewiId, "MAHASISWA_AKHIR", "READY", 92, occSweId, "Mahasiswi Ilmu Komputer semester 7 yang siap memasuki dunia kerja sebagai Full-Stack / Backend Engineer.", "081234567804", "Software Engineering, Cloud Computing, System Design", 1],
        [userMentorId, "UMUM", "READY", 100, null, "Konselor karier dan psikolog perkembangan dengan pengalaman 8 tahun membimbing mahasiswa ke dunia profesional.", "081234567805", "Mentoring Karier, Psikometri, Asesmen Bakat", 1],
        [userInstAdminId, "UMUM", "READY", 100, null, "Pusat Pengembangan Karier ITB Bandung.", "081234567806", "Manajemen Institusi, Kemitraan Kampus", 1],
        [userSysAdminId, "UMUM", "READY", 100, null, "Super Administrator CareerPath AI Platform.", "081234567807", "Tata Kelola Sistem", 1],
      ];

      for (const p of profiles) {
        await pool.query(
          "INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, target_career_id, bio, phone, interests, is_public) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING;",
          p
        );
      }

      // Memberships
      await pool.query(
        "INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        ["mem-budi", userBudiId, instSmaId, "STUDENT", "NISN-008123"]
      );
      await pool.query(
        "INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        ["mem-reza", userRezaId, instItbId, "STUDENT", "13522045"]
      );
      await pool.query(
        "INSERT INTO institution_memberships (id, user_id, institution_id, member_role, student_id_number) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        ["mem-dewi", userDewiId, instItbId, "STUDENT", "13521098"]
      );

      // Mentor assignment
      await pool.query(
        "INSERT INTO mentor_assignments (id, mentor_id, mentee_id, institution_id, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        ["assign-sarah-reza", userMentorId, userRezaId, instItbId, "ACTIVE"]
      );
      await pool.query(
        "INSERT INTO mentor_assignments (id, mentor_id, mentee_id, institution_id, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING;",
        ["assign-sarah-dewi", userMentorId, userDewiId, instItbId, "ACTIVE"]
      );

      // Opportunities
      const oppData = [
        ["opp-001", "Summer Internship Data Analyst 2026", "INTERNSHIP", "Telkom Indonesia (DigiTalent)", "Bandung / Hybrid", "HYBRID", "MAHASISWA", "Program magang intensif 3 bulan mengolah analitik churn pelanggan dan dashboard metrik bisnis.", JSON.stringify(["Python/R", "SQL Dasar", "Mahasiswa aktif min semester 5"]), "2026-06-30", "https://careers.telkom.co.id", 1],
        ["opp-002", "Beasiswa Prestasi Studi Digital Talenta Nusantara", "SCHOLARSHIP", "Kementerian Komunikasi dan Informatika", "Nasional / Online", "REMOTE", "SMA_SMK", "Bantuan biaya pendidikan dan sertifikasi global bidang kecerdasan buatan dan rekayasa perangkat lunak.", JSON.stringify(["WNI", "Siswa SMA/SMK kelas 10-12", "Rata-rata nilai rapor min 80"]), "2026-05-15", "https://digitalent.kominfo.go.id", 1],
        ["opp-003", "Bootcamp UI/UX Product Design & Usability Testing", "TRAINING", "Binar Academy x Kampus Merdeka", "Jakarta / Remote", "REMOTE", "MAHASISWA", "Pelatihan bersertifikat merancang produk digital end-to-end dari riset persona hingga wireframe interaktif.", JSON.stringify(["Portofolio desain dasar (Figma/Adobe)", "Komitmen 20 jam/minggu"]), "2026-07-10", "https://binaracademy.com", 1],
        ["opp-004", "Associate Software Engineer (Fresh Graduate)", "JOB", "Gojek Tokopedia (GoTo)", "Jakarta Selatan", "ON_SITE", "MAHASISWA", "Peluang karier awal bagi lulusan baru untuk mengembangkan microservices skala jutaan transaksi per detik.", JSON.stringify(["Pemahaman struktur data & algoritma", "Pengalaman proyek web/mobile"]), "2026-08-01", "https://careers.goto.com", 1],
      ];

      for (const opp of oppData) {
        await pool.query(
          "INSERT INTO opportunities (id, title, type, organization, location, work_type, education_level, description, requirements_json, deadline, url, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (id) DO NOTHING;",
          opp
        );
      }

      console.log("PostgreSQL seed completed successfully!");
    }

    const finalUsers = await pool.query("SELECT id, email, full_name, role FROM users;");
    console.log("Registered Users in PostgreSQL:", finalUsers.rows);

    await pool.end();
    return true;
  } catch (err) {
    console.error("Migration failed:", err);
    await pool.end();
    process.exit(1);
  }
}

migrateAndSeedPostgres();
