-- =============================================================================
-- CareerPath AI - Supabase PostgreSQL Production Schema & Seed
-- Standard: O*NET v31.0 & KBJI National Taxonomy
-- =============================================================================

-- 1. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'MENTOR', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  education_level TEXT NOT NULL CHECK (education_level IN ('SMP', 'SMA', 'SMK', 'MA', 'MAHASISWA', 'MAHASISWA_AKHIR', 'UMUM')),
  career_maturity TEXT NOT NULL DEFAULT 'EXPLORE' CHECK (career_maturity IN ('EXPLORE', 'PLAN', 'DEVELOP', 'READY')),
  career_maturity_score INTEGER DEFAULT 0,
  target_career_id TEXT,
  bio TEXT,
  phone TEXT,
  interests TEXT DEFAULT '',
  is_public INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSTITUTIONS & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SEKOLAH', 'UNIVERSITAS', 'LEMBAGA_PELATIHAN')),
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS institution_memberships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  member_role TEXT NOT NULL CHECK (member_role IN ('STUDENT', 'MENTOR', 'ADMIN')),
  student_id_number TEXT,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, institution_id)
);

CREATE TABLE IF NOT EXISTS mentor_assignments (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution_id TEXT REFERENCES institutions(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'REVOKED')),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS user_consents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL,
  is_granted INTEGER NOT NULL DEFAULT 1,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. ASSESSMENTS & PSYCHOMETRICS
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('INTEREST_RIASEC', 'COMPETENCY_GENERAL', 'WORK_VALUES')),
  instruction TEXT NOT NULL,
  min_education_level TEXT DEFAULT 'SMP',
  version INTEGER DEFAULT 1,
  is_active INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_questions (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('LIKERT_5', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
  dimension TEXT NOT NULL,
  order_num INTEGER NOT NULL,
  options_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS assessment_answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
  selected_value TEXT NOT NULL,
  score_value INTEGER NOT NULL,
  UNIQUE(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS assessment_results (
  id TEXT PRIMARY KEY,
  attempt_id TEXT UNIQUE NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  primary_dimension TEXT NOT NULL,
  secondary_dimension TEXT,
  dimensions_json TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  next_steps TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. OCCUPATIONS & COMPETENCIES
CREATE TABLE IF NOT EXISTS occupations (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  holland_code TEXT NOT NULL,
  education_paths TEXT NOT NULL,
  exploration_activities TEXT NOT NULL,
  salary_range TEXT,
  outlook TEXT NOT NULL CHECK (outlook IN ('VERY_HIGH', 'HIGH', 'MODERATE', 'GROWING')),
  onet_code TEXT,
  kbji_code TEXT,
  kbli_code TEXT,
  growth_rate TEXT,
  industry_sector TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('TECHNICAL', 'SOFT_SKILL', 'METHODOLOGY')),
  description TEXT NOT NULL,
  standard_ref TEXT,
  proficiency_level TEXT
);

CREATE TABLE IF NOT EXISTS occupation_competencies (
  id TEXT PRIMARY KEY,
  occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  expected_level TEXT NOT NULL CHECK (expected_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')),
  importance TEXT NOT NULL CHECK (importance IN ('CRITICAL', 'IMPORTANT', 'NICE_TO_HAVE')),
  UNIQUE(occupation_id, competency_id)
);

CREATE TABLE IF NOT EXISTS career_recommendations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
  match_score INTEGER NOT NULL,
  match_factors_json TEXT NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, occupation_id)
);

CREATE TABLE IF NOT EXISTS saved_careers (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, occupation_id)
);

-- 5. INDIVIDUAL DEVELOPMENT PLANS (IDP)
CREATE TABLE IF NOT EXISTS development_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_career_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  rationale TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  target_end_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS development_activities (
  id TEXT PRIMARY KEY,
  plan_id TEXT NOT NULL REFERENCES development_plans(id) ON DELETE CASCADE,
  competency_id TEXT REFERENCES competencies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  target_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  success_indicators TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_progress_logs (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES development_activities(id) ON DELETE CASCADE,
  status_before TEXT NOT NULL,
  status_after TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. PORTFOLIOS & SKILL EVIDENCE
CREATE TABLE IF NOT EXISTS portfolios (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  is_public INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('PROJECT', 'CERTIFICATE', 'EXPERIENCE', 'ORGANIZATION', 'WRITING')),
  role TEXT,
  project_url TEXT,
  start_date TEXT,
  end_date TEXT,
  tools_used TEXT DEFAULT '',
  is_public INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence_files (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portfolio_item_id TEXT REFERENCES portfolio_items(id) ON DELETE CASCADE,
  activity_id TEXT REFERENCES development_activities(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  validation_status TEXT DEFAULT 'UNREVIEWED' CHECK (validation_status IN ('UNREVIEWED', 'IN_REVIEW', 'VALIDATED', 'REJECTED')),
  reviewed_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competency_evidence (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  evidence_file_id TEXT REFERENCES evidence_files(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('CLAIMED', 'EVIDENCE_BACKED', 'MENTOR_VALIDATED')),
  validated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, competency_id, evidence_file_id)
);

-- 7. OPPORTUNITIES & CURATION
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INTERNSHIP', 'SCHOLARSHIP', 'TRAINING', 'JOB')),
  organization TEXT NOT NULL,
  location TEXT NOT NULL,
  work_type TEXT NOT NULL CHECK (work_type IN ('REMOTE', 'HYBRID', 'ON_SITE')),
  education_level TEXT NOT NULL CHECK (education_level IN ('SMP', 'SMA_SMK', 'MAHASISWA', 'SEMUA')),
  description TEXT NOT NULL,
  requirements_json TEXT NOT NULL,
  deadline TEXT,
  url TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS opportunity_competencies (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  is_mandatory INTEGER DEFAULT 1,
  UNIQUE(opportunity_id, competency_id)
);

CREATE TABLE IF NOT EXISTS saved_opportunities (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, opportunity_id)
);

-- 8. AI ASSISTANT & MENTORING WORKFLOW
CREATE TABLE IF NOT EXISTS ai_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context_topic TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('USER', 'ASSISTANT', 'SYSTEM')),
  content TEXT NOT NULL,
  structured_output_json TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentoring_tasks (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'COMPLETED', 'REJECTED')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentoring_discussions (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO_ITEM', 'EVIDENCE', 'GENERAL')),
  target_id TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentoring_comments (
  id TEXT PRIMARY KEY,
  discussion_id TEXT NOT NULL REFERENCES mentoring_discussions(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mentor_feedback (
  id TEXT PRIMARY KEY,
  mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO', 'EVIDENCE')),
  target_id TEXT NOT NULL,
  feedback_text TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('FEEDBACK_RECEIVED', 'TASK_ASSIGNED', 'EVIDENCE_VALIDATED', 'DEADLINE_APPROACHING', 'SYSTEM')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link_url TEXT,
  is_read INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  details_json TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR SCALE
CREATE INDEX IF NOT EXISTS idx_assessment_questions_order ON assessment_questions(assessment_id, order_num);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_occupations_category ON occupations(category);
CREATE INDEX IF NOT EXISTS idx_career_recs_user ON career_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_plans_user ON development_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_dev_activities_plan ON development_activities(plan_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_active ON opportunities(is_active, deadline);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON ai_messages(conversation_id);

-- =============================================================================
-- BASELINE CATALOG SEED DATA
-- =============================================================================

-- 1. INSTITUTIONS
INSERT INTO institutions (id, name, type, code, address) VALUES
  ('inst-itb-001', 'Institut Teknologi Bandung - Career Development Center', 'UNIVERSITAS', 'ITB-CDC', 'Jl. Ganesha No. 10, Bandung'),
  ('inst-sma1-002', 'SMA Negeri 1 Jakarta', 'SEKOLAH', 'SMAN1-JKT', 'Jl. Budi Utomo No. 7, Jakarta Pusat')
ON CONFLICT (id) DO NOTHING;

-- 2. OCCUPATIONS (Alik O*NET v31.0 & KBJI)
INSERT INTO occupations (id, title, slug, category, description, holland_code, education_paths, exploration_activities, salary_range, outlook, onet_code, kbji_code, growth_rate, industry_sector) VALUES
  ('occ-swe-001', 'Software Engineer', 'software-engineer', 'Teknologi Informasi', 'Merancang, membangun, dan memelihara sistem perangkat lunak, arsitektur backend, dan antarmuka aplikasi berskala tinggi.', 'IRC', 'Teknik Informatika, Ilmu Komputer, Sistem Informasi', 'Membuat proyek kalkulator web, belajar dasar algoritma logika, bergabung ke komunitas open-source', 'Rp 8.000.000 - Rp 25.000.000', 'VERY_HIGH', '15-1252.00', '2512.01', '+22% (Sangat Cepat)', 'Information & Communications'),
  ('occ-ds-002', 'Data Scientist', 'data-scientist', 'Teknologi Informasi', 'Menganalisis kumpulan data besar, merancang model machine learning prediktif, dan menerjemahkan pola data menjadi wawasan strategis.', 'IRC', 'Sains Data, Statistika, Matematika, Teknik Informatika', 'Menganalisis dataset publik Kaggle, membuat visualisasi data polusi udara, belajar statistik dasar', 'Rp 9.000.000 - Rp 28.000.000', 'VERY_HIGH', '15-2051.00', '2120.02', '+31% (Sangat Cepat)', 'Information & Communications'),
  ('occ-ux-003', 'UI/UX Designer', 'ui-ux-designer', 'Desain & Kreatif', 'Mempelajari kebutuhan pengguna melalui riset, membuat arsitektur informasi, wireframe interaktif, dan desain visual aplikasi yang intuitif.', 'ASI', 'Desain Komunikasi Visual (DKV), Sistem Informasi, Psikologi', 'Melakukan audit kegunaan aplikasi sekolah, merancang mockup antarmuka di Figma, menguji prototipe ke teman', 'Rp 7.000.000 - Rp 20.000.000', 'HIGH', '27-1024.00', '2166.01', '+16% (Cepat)', 'Digital Media & Design'),
  ('occ-psy-004', 'Psikolog Klinis / Konselor', 'psikolog-klinis', 'Kesehatan & Sosial', 'Memberikan bimbingan psikologis, evaluasi kesehatan mental, asesmen kepribadian, serta mendampingi pemecahan masalah emosional dan karier.', 'SIA', 'Psikologi (S1) + Profesi Psikolog (S2)', 'Membaca studi kasus psikologi perkembangan, menjadi sukarelawan peer-counselor sekolah, melatih active listening', 'Rp 6.000.000 - Rp 18.000.000', 'HIGH', '19-3031.02', '2634.01', '+14% (Cepat)', 'Healthcare & Social Services'),
  ('occ-mkt-005', 'Digital Marketing Specialist', 'digital-marketing-specialist', 'Bisnis & Manajemen', 'Merancang strategi kampanye digital, mengelola optimasi SEO/SEM, menganalisis konversi audiens, dan menumbuhkan engagement brand.', 'EAS', 'Manajemen Bisnis, Ilmu Komunikasi, Pemasaran Digital', 'Mengelola akun media sosial organisasi, membuat konten edukatif interaktif, menganalisis insight followers', 'Rp 6.500.000 - Rp 18.000.000', 'HIGH', '13-1161.01', '2431.02', '+19% (Cepat)', 'Business & Commerce'),
  ('occ-sec-006', 'Cybersecurity Analyst', 'cybersecurity-analyst', 'Teknologi Informasi', 'Melindungi infrastruktur digital dari serangan siber, memantau celah kerentanan jaringan, dan menerapkan standar enkripsi serta keamanan informasi.', 'IRC', 'Teknik Informatika, Keamanan Siber, Rekayasa Perangkat Keras', 'Mencoba simulasi capture-the-flag (CTF) pemula, belajar dasar protokol jaringan TCP/IP, audit keamanan password', 'Rp 8.500.000 - Rp 26.000.000', 'VERY_HIGH', '15-1212.00', '2529.01', '+32% (Sangat Cepat)', 'Information Security')
ON CONFLICT (id) DO NOTHING;

-- 3. COMPETENCIES
INSERT INTO competencies (id, name, code, category, description, standard_ref) VALUES
  ('comp-py-001', 'Python Programming', 'TECH-PY', 'TECHNICAL', 'Kemampuan sintaksis dan implementasi komputasi dengan bahasa pemrograman Python.', 'SKKNI 2020-092'),
  ('comp-sql-002', 'SQL & Relational Database', 'TECH-SQL', 'TECHNICAL', 'Kemampuan merancang query database relasional, joins, dan agregasi data.', 'SKKNI 2020-093'),
  ('comp-ml-003', 'Machine Learning Fundamentals', 'TECH-ML', 'TECHNICAL', 'Pemahaman algoritma supervised dan unsupervised learning untuk pemodelan prediktif.', 'IEEE Standard 2801-2022'),
  ('comp-figma-004', 'Figma UI Prototyping', 'TECH-FIGMA', 'TECHNICAL', 'Keahlian merancang desain antarmuka, component system, dan interactive prototyping.', 'Industry Standard UI/UX'),
  ('comp-research-005', 'User Research & Usability Testing', 'METHOD-UXR', 'METHODOLOGY', 'Metodologi wawancara pengguna, persona empathy mapping, dan usability benchmarking.', 'ISO 9241-210:2019'),
  ('comp-comm-006', 'Public Speaking & Communication', 'SOFT-COMM', 'SOFT_SKILL', 'Kemampuan menyampaikan ide, presentasi teknis, dan artikulasi ide secara persuasif.', 'UNESCO Transversal Skills'),
  ('comp-probsol-007', 'Critical Thinking & Problem Solving', 'METHOD-PS', 'METHODOLOGY', 'Kemampuan dekonstruksi masalah kompleks menjadi langkah solusi terstruktur.', 'OECD Future of Education'),
  ('comp-seo-008', 'SEO & Content Marketing', 'TECH-SEO', 'TECHNICAL', 'Keahlian optimasi mesin pencari on-page/off-page dan perancangan strategi konten digital.', 'Digital Marketing Institute standard'),
  ('comp-counsel-009', 'Active Listening & Empathetic Counseling', 'SOFT-COUNSEL', 'SOFT_SKILL', 'Keterampilan mendengarkan aktif, non-judgmental, dan memberikan validasi emosional.', 'HIMPSI Kode Etik Psikologi')
ON CONFLICT (id) DO NOTHING;

-- 4. OCCUPATION COMPETENCIES MAPPINGS
INSERT INTO occupation_competencies (id, occupation_id, competency_id, expected_level, importance) VALUES
  ('oc-swe-1', 'occ-swe-001', 'comp-py-001', 'INTERMEDIATE', 'CRITICAL'),
  ('oc-swe-2', 'occ-swe-001', 'comp-sql-002', 'INTERMEDIATE', 'CRITICAL'),
  ('oc-swe-3', 'occ-swe-001', 'comp-probsol-007', 'ADVANCED', 'CRITICAL'),
  ('oc-ds-1', 'occ-ds-002', 'comp-py-001', 'ADVANCED', 'CRITICAL'),
  ('oc-ds-2', 'occ-ds-002', 'comp-sql-002', 'ADVANCED', 'CRITICAL'),
  ('oc-ds-3', 'occ-ds-002', 'comp-ml-003', 'ADVANCED', 'CRITICAL'),
  ('oc-ux-1', 'occ-ux-003', 'comp-figma-004', 'ADVANCED', 'CRITICAL'),
  ('oc-ux-2', 'occ-ux-003', 'comp-research-005', 'ADVANCED', 'CRITICAL'),
  ('oc-ux-3', 'occ-ux-003', 'comp-comm-006', 'INTERMEDIATE', 'IMPORTANT'),
  ('oc-psy-1', 'occ-psy-004', 'comp-counsel-009', 'ADVANCED', 'CRITICAL'),
  ('oc-psy-2', 'occ-psy-004', 'comp-comm-006', 'ADVANCED', 'CRITICAL'),
  ('oc-mkt-1', 'occ-mkt-005', 'comp-seo-008', 'ADVANCED', 'CRITICAL'),
  ('oc-mkt-2', 'occ-mkt-005', 'comp-comm-006', 'ADVANCED', 'CRITICAL'),
  ('oc-sec-1', 'occ-sec-006', 'comp-py-001', 'INTERMEDIATE', 'CRITICAL'),
  ('oc-sec-2', 'occ-sec-006', 'comp-probsol-007', 'ADVANCED', 'CRITICAL')
ON CONFLICT (id) DO NOTHING;

-- 5. ASSESSMENT DEFINITION (HOLLAND RIASEC)
INSERT INTO assessments (id, title, slug, description, assessment_type, instruction, min_education_level, version, is_active) VALUES
  ('asm-riasec-001', 'Asesmen Minat Karier Holland RIASEC', 'holland-riasec-v1', 'Instrumen psikometri minat terstandarisasi untuk mengidentifikasi dominansi Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional.', 'INTEREST_RIASEC', 'Berikan penilaian sejauh mana Anda menyukai aktivitas berikut pada skala 1 (Sangat Tidak Suka) sampai 5 (Sangat Suka).', 'SMP', 1, 1)
ON CONFLICT (id) DO NOTHING;

-- 6. RIASEC 24 QUESTIONS (4 PER DIMENSION)
INSERT INTO assessment_questions (id, assessment_id, question_text, question_type, dimension, order_num, options_json) VALUES
  ('q-r-01', 'asm-riasec-001', 'Merakit atau membongkar perangkat elektronik, robotika, atau mesin otomotif.', 'LIKERT_5', 'REALISTIC', 1, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-r-02', 'asm-riasec-001', 'Melakukan eksperimen fisik di laboratorium bengkel kerja atau ruang perkakas mekanik.', 'LIKERT_5', 'REALISTIC', 2, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-r-03', 'asm-riasec-001', 'Bekerja di luar ruangan atau lapangan untuk observasi teknis dan instalasi fisik.', 'LIKERT_5', 'REALISTIC', 3, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-r-04', 'asm-riasec-001', 'Memperbaiki instalasi jaringan listrik kabel, wifi, atau sensor Internet of Things.', 'LIKERT_5', 'REALISTIC', 4, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  
  ('q-i-05', 'asm-riasec-001', 'Memecahkan teka-teki logika matematika rumit atau menganalisis algoritma data statistik.', 'LIKERT_5', 'INVESTIGATIVE', 5, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-i-06', 'asm-riasec-001', 'Membaca jurnal penelitian ilmiah atau artikel riset mendalam untuk mencari jawaban objektif.', 'LIKERT_5', 'INVESTIGATIVE', 6, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-i-07', 'asm-riasec-001', 'Menguji hipotesis ilmiah dan mencari pola tersembunyi dari sekumpulan data mentah.', 'LIKERT_5', 'INVESTIGATIVE', 7, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-i-08', 'asm-riasec-001', 'Menyelidiki akar penyebab kerusakan sistem perangkat lunak (debugging mendalam).', 'LIKERT_5', 'INVESTIGATIVE', 8, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  
  ('q-a-09', 'asm-riasec-001', 'Merancang desain antarmuka aplikasi, ilustrasi digital, atau layout estetis.', 'LIKERT_5', 'ARTISTIC', 9, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-a-10', 'asm-riasec-001', 'Menulis cerita pendek, puisi, naskah drama, atau narasi konten kreatif.', 'LIKERT_5', 'ARTISTIC', 10, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-a-11', 'asm-riasec-001', 'Mengekspresikan gagasan tanpa batas aturan yang kaku (pemikiran konseptual orisinal).', 'LIKERT_5', 'ARTISTIC', 11, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-a-12', 'asm-riasec-001', 'Menggubah musik latar, editing audio video kreatif, atau seni pertunjukan multimedia.', 'LIKERT_5', 'ARTISTIC', 12, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  
  ('q-s-13', 'asm-riasec-001', 'Mendengarkan curahan hati teman dan memberikan dukungan konseling emosional yang tulus.', 'LIKERT_5', 'SOCIAL', 13, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-s-14', 'asm-riasec-001', 'Mengajar siswa, memberikan bimbingan belajar, atau membawakan pelatihan keterampilan baru.', 'LIKERT_5', 'SOCIAL', 14, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-s-15', 'asm-riasec-001', 'Menjadi relawan aksi kemanusiaan sosial untuk menolong masyarakat yang membutuhkan.', 'LIKERT_5', 'SOCIAL', 15, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-s-16', 'asm-riasec-001', 'Memediasi perselisihan antar rekan dan memfasilitasi kerja sama tim yang harmonis.', 'LIKERT_5', 'SOCIAL', 16, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  
  ('q-e-17', 'asm-riasec-001', 'Mempresentasikan pitch rencana bisnis di hadapan calon investor atau mitra strategis.', 'LIKERT_5', 'ENTERPRISING', 17, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-e-18', 'asm-riasec-001', 'Memimpin tim kepanitiaan atau organisasi untuk mencapai target bersama yang ambisius.', 'LIKERT_5', 'ENTERPRISING', 18, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-e-19', 'asm-riasec-001', 'Meyakinkan dan menegosiasikan kesepakatan jual-beli dengan konsumen atau klien.', 'LIKERT_5', 'ENTERPRISING', 19, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-e-20', 'asm-riasec-001', 'Mengambil risiko terukur dalam memulai proyek inovasi baru yang bernilai komersial.', 'LIKERT_5', 'ENTERPRISING', 20, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  
  ('q-c-21', 'asm-riasec-001', 'Menyusun berkas arsip dokumen, database pembukuan, atau spreadsheet secara teratur rapi.', 'LIKERT_5', 'CONVENTIONAL', 21, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-c-22', 'asm-riasec-001', 'Memeriksa detail kepatuhan laporan keuangan dan memvalidasi keakuratan neraca anggaran.', 'LIKERT_5', 'CONVENTIONAL', 22, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-c-23', 'asm-riasec-001', 'Mengikuti standar operasional prosedur (SOP) baku yang telah teruji dengan konsisten.', 'LIKERT_5', 'CONVENTIONAL', 23, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]'),
  ('q-c-24', 'asm-riasec-001', 'Mengelola inventaris aset organisasi dan memastikan inventarisasi data tercatat presisi.', 'LIKERT_5', 'CONVENTIONAL', 24, '[{"label":"Sangat Tidak Suka","value":"1","score":1},{"label":"Tidak Suka","value":"2","score":2},{"label":"Netral","value":"3","score":3},{"label":"Suka","value":"4","score":4},{"label":"Sangat Suka","value":"5","score":5}]')
ON CONFLICT (id) DO NOTHING;

-- 7. CURATED NATIONAL OPPORTUNITIES
INSERT INTO opportunities (id, title, type, organization, location, work_type, education_level, description, requirements_json, deadline, url, is_active) VALUES
  ('opp-001', 'Summer Internship Data Analyst 2026', 'INTERNSHIP', 'Telkom Indonesia (DigiTalent)', 'Bandung / Hybrid', 'HYBRID', 'MAHASISWA', 'Program magang intensif 3 bulan mengolah analitik churn pelanggan dan dashboard metrik bisnis.', '["Python/R", "SQL Dasar", "Mahasiswa aktif min semester 5"]', '2026-06-30', 'https://careers.telkom.co.id', 1),
  ('opp-002', 'Beasiswa Prestasi Studi Digital Talenta Nusantara', 'SCHOLARSHIP', 'Kementerian Komunikasi dan Informatika', 'Nasional / Online', 'REMOTE', 'SMA_SMK', 'Bantuan biaya pendidikan dan sertifikasi global bidang kecerdasan buatan dan rekayasa perangkat lunak.', '["WNI", "Siswa SMA/SMK kelas 10-12", "Rata-rata nilai rapor min 80"]', '2026-05-15', 'https://digitalent.kominfo.go.id', 1),
  ('opp-003', 'Bootcamp UI/UX Product Design & Usability Testing', 'TRAINING', 'Binar Academy x Kampus Merdeka', 'Jakarta / Remote', 'REMOTE', 'MAHASISWA', 'Pelatihan bersertifikat merancang produk digital end-to-end dari riset persona hingga wireframe interaktif.', '["Portofolio desain dasar (Figma/Adobe)", "Komitmen 20 jam/minggu"]', '2026-07-10', 'https://binaracademy.com', 1),
  ('opp-004', 'Associate Software Engineer (Fresh Graduate)', 'JOB', 'Gojek Tokopedia (GoTo)', 'Jakarta Selatan', 'ON_SITE', 'MAHASISWA', 'Peluang karier awal bagi lulusan baru untuk mengembangkan microservices skala jutaan transaksi per detik.', '["Pemahaman struktur data & algoritma", "Pengalaman proyek web/mobile"]', '2026-08-01', 'https://careers.goto.com', 1)
ON CONFLICT (id) DO NOTHING;

-- 8. DEFAULT PLATFORM ADMINISTRATOR (Password: CareerPath2026!)
INSERT INTO users (id, email, password_hash, full_name, role, avatar_url) VALUES
  ('user-superadmin', 'admin@careerpath.id', '$2b$10$KhQJDuLFa3giHkvhjiYKBerRzgFhVDQJXB6sPf/aOAcK9NMt0KDQC', 'Platform Lead Administrator', 'PLATFORM_ADMIN', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150')
ON CONFLICT (id) DO NOTHING;

INSERT INTO profiles (id, education_level, career_maturity, career_maturity_score, target_career_id, bio, phone, interests, is_public) VALUES
  ('user-superadmin', 'UMUM', 'READY', 100, NULL, 'Akun Administrator Pengelola Sistem Nasional CareerPath AI.', '081200000000', 'Governance, Data Ethics, Psychometrics', 1)
ON CONFLICT (id) DO NOTHING;
