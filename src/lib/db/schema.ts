import { getDb } from "./client";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function initializeSchema(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = getDb();

  const statements = [
    // USERS & PROFILES
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('STUDENT', 'MENTOR', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN')),
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      education_level TEXT NOT NULL CHECK (education_level IN ('SMP', 'SMA', 'SMK', 'MA', 'MAHASISWA', 'MAHASISWA_AKHIR', 'UMUM')),
      career_maturity TEXT NOT NULL DEFAULT 'EXPLORE' CHECK (career_maturity IN ('EXPLORE', 'PLAN', 'DEVELOP', 'READY')),
      career_maturity_score INTEGER DEFAULT 0,
      target_career_id TEXT,
      bio TEXT,
      phone TEXT,
      interests TEXT DEFAULT '',
      is_public INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    // INSTITUTIONS
    `CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('SEKOLAH', 'UNIVERSITAS', 'LEMBAGA_PELATIHAN')),
      code TEXT UNIQUE NOT NULL,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS institution_memberships (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      institution_id TEXT NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
      member_role TEXT NOT NULL CHECK (member_role IN ('STUDENT', 'MENTOR', 'ADMIN')),
      student_id_number TEXT,
      joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, institution_id)
    );`,

    `CREATE TABLE IF NOT EXISTS mentor_assignments (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      institution_id TEXT REFERENCES institutions(id) ON DELETE SET NULL,
      status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'REVOKED')),
      assigned_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(mentor_id, mentee_id)
    );`,

    `CREATE TABLE IF NOT EXISTS user_consents (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      consent_type TEXT NOT NULL,
      is_granted INTEGER NOT NULL DEFAULT 1,
      granted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    // ASSESSMENTS
    `CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      assessment_type TEXT NOT NULL CHECK (assessment_type IN ('INTEREST_RIASEC', 'COMPETENCY_GENERAL', 'WORK_VALUES')),
      instruction TEXT NOT NULL,
      min_education_level TEXT DEFAULT 'SMP',
      version INTEGER DEFAULT 1,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS assessment_questions (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL CHECK (question_type IN ('LIKERT_5', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
      dimension TEXT NOT NULL,
      order_num INTEGER NOT NULL,
      options_json TEXT NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS assessment_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED')),
      started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS assessment_answers (
      id TEXT PRIMARY KEY,
      attempt_id TEXT NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
      question_id TEXT NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
      selected_value TEXT NOT NULL,
      score_value INTEGER NOT NULL,
      UNIQUE(attempt_id, question_id)
    );`,

    `CREATE TABLE IF NOT EXISTS assessment_results (
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    // OCCUPATIONS & COMPETENCIES
    `CREATE TABLE IF NOT EXISTS occupations (
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS competencies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('TECHNICAL', 'SOFT_SKILL', 'METHODOLOGY')),
      description TEXT NOT NULL,
      standard_ref TEXT,
      proficiency_level TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS occupation_competencies (
      id TEXT PRIMARY KEY,
      occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
      competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
      expected_level TEXT NOT NULL CHECK (expected_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')),
      importance TEXT NOT NULL CHECK (importance IN ('CRITICAL', 'IMPORTANT', 'NICE_TO_HAVE')),
      UNIQUE(occupation_id, competency_id)
    );`,

    `CREATE TABLE IF NOT EXISTS career_recommendations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
      match_score INTEGER NOT NULL,
      match_factors_json TEXT NOT NULL,
      calculated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, occupation_id)
    );`,

    `CREATE TABLE IF NOT EXISTS saved_careers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      occupation_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
      saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, occupation_id)
    );`,

    // DEVELOPMENT PLANS (IDP)
    `CREATE TABLE IF NOT EXISTS development_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_career_id TEXT NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      rationale TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
      progress_percentage INTEGER NOT NULL DEFAULT 0,
      target_end_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS development_activities (
      id TEXT PRIMARY KEY,
      plan_id TEXT NOT NULL REFERENCES development_plans(id) ON DELETE CASCADE,
      competency_id TEXT REFERENCES competencies(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
      target_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
      success_indicators TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS activity_progress_logs (
      id TEXT PRIMARY KEY,
      activity_id TEXT NOT NULL REFERENCES development_activities(id) ON DELETE CASCADE,
      status_before TEXT NOT NULL,
      status_after TEXT NOT NULL,
      notes TEXT,
      logged_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    // PORTFOLIOS & EVIDENCE
    `CREATE TABLE IF NOT EXISTS portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      summary TEXT,
      is_public INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS portfolio_items (
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
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS evidence_files (
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
      reviewed_at TEXT,
      review_feedback TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS competency_evidence (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
      evidence_file_id TEXT REFERENCES evidence_files(id) ON DELETE CASCADE,
      tier TEXT NOT NULL CHECK (tier IN ('CLAIMED', 'EVIDENCE_BACKED', 'MENTOR_VALIDATED')),
      validated_at TEXT,
      UNIQUE(user_id, competency_id, evidence_file_id)
    );`,

    // OPPORTUNITIES
    `CREATE TABLE IF NOT EXISTS opportunities (
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
      verified_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS opportunity_competencies (
      id TEXT PRIMARY KEY,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      competency_id TEXT NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
      is_mandatory INTEGER DEFAULT 1,
      UNIQUE(opportunity_id, competency_id)
    );`,

    `CREATE TABLE IF NOT EXISTS saved_opportunities (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opportunity_id TEXT NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
      saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, opportunity_id)
    );`,

    // AI & MENTORING
    `CREATE TABLE IF NOT EXISTS ai_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      context_topic TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS ai_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
      sender_role TEXT NOT NULL CHECK (sender_role IN ('USER', 'ASSISTANT', 'SYSTEM')),
      content TEXT NOT NULL,
      structured_output_json TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mentoring_tasks (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'COMPLETED', 'REJECTED')),
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mentoring_discussions (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO_ITEM', 'EVIDENCE', 'GENERAL')),
      target_id TEXT,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mentoring_comments (
      id TEXT PRIMARY KEY,
      discussion_id TEXT NOT NULL REFERENCES mentoring_discussions(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mentor_feedback (
      id TEXT PRIMARY KEY,
      mentor_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mentee_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO', 'EVIDENCE')),
      target_id TEXT NOT NULL,
      feedback_text TEXT NOT NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    // NOTIFICATIONS & AUDIT LOGS
    `CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL CHECK (type IN ('FEEDBACK_RECEIVED', 'TASK_ASSIGNED', 'EVIDENCE_VALIDATED', 'DEADLINE_APPROACHING', 'SYSTEM')),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link_url TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      resource_id TEXT,
      details_json TEXT,
      ip_address TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
  ];

    for (const sql of statements) {
      await db.execute(sql);
    }

    // Non-destructive column additions for existing installations
    const columnMigrations = [
      `ALTER TABLE occupations ADD COLUMN IF NOT EXISTS onet_code TEXT;`,
      `ALTER TABLE occupations ADD COLUMN IF NOT EXISTS kbji_code TEXT;`,
      `ALTER TABLE occupations ADD COLUMN IF NOT EXISTS kbli_code TEXT;`,
      `ALTER TABLE occupations ADD COLUMN IF NOT EXISTS growth_rate TEXT;`,
      `ALTER TABLE occupations ADD COLUMN IF NOT EXISTS industry_sector TEXT;`,
      `ALTER TABLE competencies ADD COLUMN IF NOT EXISTS standard_ref TEXT;`,
      `ALTER TABLE competencies ADD COLUMN IF NOT EXISTS proficiency_level TEXT;`,
    ];
    for (const colSql of columnMigrations) {
      try {
        await db.execute(colSql);
      } catch {
        // ignore if not supported
      }
    }
    isInitialized = true;
  })();

  return initPromise;
}
