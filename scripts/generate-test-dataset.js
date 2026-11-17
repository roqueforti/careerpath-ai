const fs = require("fs");
const path = require("path");

const OCCUPATION_DEFS = [
  {
    key: "software-engineer",
    label: "Software Engineer / Enterprise Application Developer",
    onet_code: "15-1252.00",
    kbji_code: "2512",
    base_riasec: { R: 3.2, I: 5.8, A: 2.1, S: 1.8, E: 2.4, C: 4.7 },
    core_skills: [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "REST APIs",
      "Git",
      "Docker",
      "System Architecture",
      "SQL Query Optimization",
      "Microservices"
    ],
    majors: ["Teknik Informatika", "Teknologi Rekayasa Perangkat Lunak", "Sistem Informasi"],
  },
  {
    key: "data-scientist",
    label: "Data Scientist & Machine Learning Specialist",
    onet_code: "15-2051.00",
    kbji_code: "2511",
    base_riasec: { R: 2.1, I: 6.0, A: 2.0, S: 1.5, E: 2.5, C: 5.2 },
    core_skills: [
      "Python",
      "SQL",
      "Machine Learning",
      "Pandas",
      "Scikit-Learn",
      "Statistics",
      "Data Visualization",
      "Git",
      "TensorFlow"
    ],
    majors: ["Sains Data", "Statistika Terapan", "Teknik Informatika", "Matematika Komputasi"],
  },
  {
    key: "ui-ux-designer",
    label: "Product Designer & UI/UX Specialist",
    onet_code: "15-1255.00",
    kbji_code: "2166",
    base_riasec: { R: 1.2, I: 3.4, A: 6.0, S: 4.2, E: 3.1, C: 2.0 },
    core_skills: [
      "Figma",
      "Design Systems",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Usability Testing",
      "Information Architecture",
      "Design Thinking"
    ],
    majors: ["Desain Komunikasi Visual", "Sistem Informasi", "Teknologi Informasi"],
  },
  {
    key: "cybersecurity-analyst",
    label: "Information Security & Cybersecurity Analyst",
    onet_code: "15-1212.00",
    kbji_code: "2529",
    base_riasec: { R: 4.1, I: 5.6, A: 1.5, S: 1.8, E: 2.2, C: 5.5 },
    core_skills: [
      "Network Security",
      "Linux",
      "Penetration Testing",
      "SIEM",
      "Cryptography",
      "Vulnerability Assessment",
      "Wireshark",
      "Git"
    ],
    majors: ["Teknik Komputer & Jaringan", "Sistem Informasi Keamanan", "Teknik Informatika"],
  },
  {
    key: "devops-cloud-engineer",
    label: "DevOps & Cloud Infrastructure Engineer",
    onet_code: "15-1254.00",
    kbji_code: "2519",
    base_riasec: { R: 4.8, I: 4.9, A: 1.4, S: 1.6, E: 2.3, C: 5.1 },
    core_skills: [
      "Docker",
      "Kubernetes",
      "CI/CD Pipelines",
      "Linux Administration",
      "Cloud Infrastructure (AWS/GCP)",
      "Bash Scripting",
      "Terraform",
      "Git"
    ],
    majors: ["Teknologi Rekayasa Komputer", "Teknik Informatika", "Sistem Komputer"],
  },
];

const INDONESIAN_NAMES = [
  "Ahmad Fauzi", "Rizky Ramadhani", "Siti Nurhaliza", "Budi Santoso", "Dewi Lestari",
  "Muhammad Ihsan", "Putri Anggraini", "Aditya Pratama", "Anisa Rahmawati", "Fajar Hidayat",
  "Bayu Wicaksono", "Nurul Hidayati", "Dimas Setiawan", "Rina Marlina", "Eko Prasetyo",
  "Mega Utami", "Wahyu Nugroho", "Dian Permata", "Agus Supriyanto", "Tia Safitri",
  "Gilang Ramadhan", "Nadia Safira", "Hendra Gunawan", "Ayu Wulandari", "Farhan Maulana",
  "Salsa Bila", "Yoga Pratama", "Riska Amalia", "Aldi Firmansyah", "Intan Permatasari",
  "Reza Pahlevi", "Bella Amanda", "Satria Wibowo", "Nita Oktavia", "Danang Kusuma",
  "Larasati Dewi", "Arif Budiman", "Zahra Aulia", "Rian Hidayat", "Maya Anggraini",
  "Fikri Haikal", "Siti Fatimah", "Ilham Saputra", "Dini Rahayu", "Panji Asmara",
  "Widya Astuti", "Guntur Prakoso", "Melati Sukma", "Bagas Saputra", "Tari Handayani",
  "Kuncoro Jati", "Fitri Handayani", "Bobby Kurniawan", "Cindy Claudia", "Doni Darmawan",
  "Erna Wati", "Galih Rakasiwi", "Hana Pertiwi", "Indra Kusuma", "Joko Susilo",
  "Kartika Sari", "Lukman Hakim", "Miftah Fauzan", "Nugroho Adi", "Oki Setiawan",
  "Pandu Wijaya", "Qori Alamsyah", "Rendi Saputra", "Surya Saputra", "Tri Wahyuni",
  "Umar Said", "Vina Panduwinata", "Wawan Setiawan", "Yusuf Mansur", "Zainal Abidin",
  "Abimanyu Sekar", "Berlian Citra", "Cahyo Utomo", "Darmawan Saputra", "Endang Susilowati",
  "Fahmi Idris", "Gita Gutawa", "Haris Munandar", "Irfan Bachdim", "Juwita Bahar",
  "Kharisma Jati", "Lintang Kemukus", "Mahesa Jenar", "Novita Sari", "Oscar Lawalata",
  "Pramudya Ananta", "Qonita Syahab", "Raden Saleh", "Sekar Arum", "Tegar Septian",
  "Utari Maharani", "Vicky Shu", "Wira Yudha", "Xaverius Tio", "Yuni Shara",
  "Zaskia Sungkar"
];

const UNIVERSITIES = [
  "Politeknik Elektronika Negeri Surabaya (PENS)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Universitas Gadjah Mada (UGM)",
  "Politeknik Negeri Jakarta (PNJ)",
  "Universitas Brawijaya (UB)",
  "Politeknik Negeri Bandung (POLBAN)",
  "Universitas Diponegoro (UNDIP)",
  "Telkom University"
];

function generateProfiles() {
  const dataset = [];
  let nameIndex = 0;

  OCCUPATION_DEFS.forEach((occ, occIdx) => {
    // 20 profiles per occupation cluster = 100 profiles total
    for (let i = 0; i < 20; i++) {
      const studentId = `MHS-${String(dataset.length + 1).padStart(3, "0")}`;
      const name = INDONESIAN_NAMES[nameIndex++ % INDONESIAN_NAMES.length];
      const univ = UNIVERSITIES[(occIdx * 2 + i) % UNIVERSITIES.length];
      const major = occ.majors[i % occ.majors.length];

      // Add realistic Gaussian noise to RIASEC (mean 0, stdDev ~0.35)
      const riasec = {};
      ["R", "I", "A", "S", "E", "C"].forEach((dim) => {
        const base = occ.base_riasec[dim];
        const noise = (Math.random() - 0.5) * 0.7;
        const perturbed = Math.max(1.0, Math.min(7.0, parseFloat((base + noise).toFixed(2))));
        riasec[dim] = perturbed;
      });

      // Sample core skills (between 4 and 7 skills from the true cluster)
      const numCoreSkills = 4 + Math.floor(Math.random() * 4); // 4 to 7
      const shuffledCore = [...occ.core_skills].sort(() => 0.5 - Math.random());
      const studentSkills = shuffledCore.slice(0, numCoreSkills);

      // 30% chance to add 1 cross-functional/distractor skill (e.g. Git, Linux, or Figma)
      if (Math.random() < 0.35) {
        const distractorPool = ["Git", "Linux", "Communication", "Agile/Scrum", "Public Speaking"];
        const dSkill = distractorPool[Math.floor(Math.random() * distractorPool.length)];
        if (!studentSkills.includes(dSkill)) {
          studentSkills.push(dSkill);
        }
      }

      const gpa = parseFloat((3.15 + Math.random() * 0.75).toFixed(2)); // 3.15 - 3.90
      const maturity = Math.floor(75 + Math.random() * 22); // 75 - 96

      dataset.push({
        student_id: studentId,
        name: name,
        university: univ,
        major: major,
        education_level: i % 2 === 0 ? "MAHASISWA_VOKASI_TINGKAT_4" : "MAHASISWA_SARJANA_TINGKAT_4",
        gpa: gpa,
        career_maturity_score: maturity,
        riasec_scores: riasec,
        verified_skills: studentSkills,
        ground_truth_career: occ.key,
        ground_truth_label: occ.label,
        onet_code: occ.onet_code,
        kbji_code: occ.kbji_code
      });
    }
  });

  return dataset;
}

const dataset = generateProfiles();
const outputPath = path.join(__dirname, "..", "data", "test-dataset.json");

fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2), "utf8");
console.log(`Generated 100 realistic student test dataset items at:`);
console.log(` -> ${outputPath}`);
console.log(`Per-class count: 20 samples per occupation (5 clusters total).`);

