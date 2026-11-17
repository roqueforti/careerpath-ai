-- CareerPath AI-Assisted Mentoring Initial Schema
-- PostgreSQL / Supabase Compatible Migration with Row Level Security (RLS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'MENTOR', 'INSTITUTION_ADMIN', 'PLATFORM_ADMIN')),
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('SMP', 'SMA', 'SMK', 'MA', 'MAHASISWA', 'MAHASISWA_AKHIR', 'UMUM')),
    career_maturity VARCHAR(20) NOT NULL DEFAULT 'EXPLORE' CHECK (career_maturity IN ('EXPLORE', 'PLAN', 'DEVELOP', 'READY')),
    career_maturity_score INT DEFAULT 0,
    target_career_id UUID,
    bio TEXT,
    phone VARCHAR(50),
    interests TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INSTITUTIONS & MEMBERSHIPS
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('SEKOLAH', 'UNIVERSITAS', 'LEMBAGA_PELATIHAN')),
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institution_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    member_role VARCHAR(50) NOT NULL CHECK (member_role IN ('STUDENT', 'MENTOR', 'ADMIN')),
    student_id_number VARCHAR(100),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, institution_id)
);

CREATE TABLE IF NOT EXISTS mentor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'REVOKED')),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mentor_id, mentee_id)
);

CREATE TABLE IF NOT EXISTS user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(100) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ASSESSMENTS
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL CHECK (assessment_type IN ('INTEREST_RIASEC', 'COMPETENCY_GENERAL', 'WORK_VALUES')),
    instruction TEXT NOT NULL,
    min_education_level VARCHAR(50) DEFAULT 'SMP',
    version INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN ('LIKERT_5', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
    dimension VARCHAR(50) NOT NULL,
    order_num INT NOT NULL,
    options_json JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    version INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EVALUATED')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES assessment_questions(id) ON DELETE CASCADE,
    selected_value VARCHAR(100) NOT NULL,
    score_value INT NOT NULL,
    UNIQUE(attempt_id, question_id)
);

CREATE TABLE IF NOT EXISTS assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID UNIQUE NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    primary_dimension VARCHAR(50) NOT NULL,
    secondary_dimension VARCHAR(50),
    dimensions_json JSONB NOT NULL,
    interpretation TEXT NOT NULL,
    next_steps TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. OCCUPATIONS & COMPETENCIES
CREATE TABLE IF NOT EXISTS occupations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    holland_code VARCHAR(10) NOT NULL,
    education_paths TEXT NOT NULL,
    exploration_activities TEXT NOT NULL,
    salary_range VARCHAR(100),
    outlook VARCHAR(50) NOT NULL CHECK (outlook IN ('VERY_HIGH', 'HIGH', 'MODERATE', 'GROWING')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('TECHNICAL', 'SOFT_SKILL', 'METHODOLOGY')),
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS occupation_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    occupation_id UUID NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    expected_level VARCHAR(20) NOT NULL CHECK (expected_level IN ('BASIC', 'INTERMEDIATE', 'ADVANCED')),
    importance VARCHAR(20) NOT NULL CHECK (importance IN ('CRITICAL', 'IMPORTANT', 'NICE_TO_HAVE')),
    UNIQUE(occupation_id, competency_id)
);

CREATE TABLE IF NOT EXISTS career_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occupation_id UUID NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
    match_score INT NOT NULL,
    match_factors_json JSONB NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, occupation_id)
);

CREATE TABLE IF NOT EXISTS saved_careers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occupation_id UUID NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, occupation_id)
);

-- 6. INDIVIDUAL DEVELOPMENT PLAN (IDP)
CREATE TABLE IF NOT EXISTS development_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_career_id UUID NOT NULL REFERENCES occupations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    rationale TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED')),
    progress_percentage INT NOT NULL DEFAULT 0,
    target_end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS development_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES development_plans(id) ON DELETE CASCADE,
    competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    target_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED' CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    success_indicators TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES development_activities(id) ON DELETE CASCADE,
    status_before VARCHAR(20) NOT NULL,
    status_after VARCHAR(20) NOT NULL,
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PORTFOLIO & EVIDENCE
CREATE TABLE IF NOT EXISTS portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('PROJECT', 'CERTIFICATE', 'EXPERIENCE', 'ORGANIZATION', 'WRITING')),
    role VARCHAR(100),
    project_url VARCHAR(500),
    start_date DATE,
    end_date DATE,
    tools_used TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evidence_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    portfolio_item_id UUID REFERENCES portfolio_items(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES development_activities(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INT NOT NULL,
    validation_status VARCHAR(20) DEFAULT 'UNREVIEWED' CHECK (validation_status IN ('UNREVIEWED', 'IN_REVIEW', 'VALIDATED', 'REJECTED')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competency_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    evidence_file_id UUID REFERENCES evidence_files(id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL CHECK (tier IN ('CLAIMED', 'EVIDENCE_BACKED', 'MENTOR_VALIDATED')),
    validated_at TIMESTAMPTZ,
    UNIQUE(user_id, competency_id, evidence_file_id)
);

-- 8. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('INTERNSHIP', 'SCHOLARSHIP', 'TRAINING', 'JOB')),
    organization VARCHAR(255) NOT NULL,
    location VARCHAR(150) NOT NULL,
    work_type VARCHAR(50) NOT NULL CHECK (work_type IN ('REMOTE', 'HYBRID', 'ON_SITE')),
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('SMP', 'SMA_SMK', 'MAHASISWA', 'SEMUA')),
    description TEXT NOT NULL,
    requirements_json JSONB NOT NULL,
    deadline DATE,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunity_competencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
    is_mandatory BOOLEAN DEFAULT true,
    UNIQUE(opportunity_id, competency_id)
);

CREATE TABLE IF NOT EXISTS saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- 9. AI & MENTORING
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    context_topic VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('USER', 'ASSISTANT', 'SYSTEM')),
    content TEXT NOT NULL,
    structured_output_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentoring_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED', 'COMPLETED', 'REJECTED')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentoring_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO_ITEM', 'EVIDENCE', 'GENERAL')),
    target_id UUID,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentoring_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discussion_id UUID NOT NULL REFERENCES mentoring_discussions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('IDP', 'PORTFOLIO', 'EVIDENCE')),
    target_id UUID NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS & AUDIT
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('FEEDBACK_RECEIVED', 'TASK_ASSIGNED', 'EVIDENCE_VALIDATED', 'DEADLINE_APPROACHING', 'SYSTEM')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link_url VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details_json JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles or owner can view" ON profiles FOR SELECT USING (is_public = true OR auth.uid() = id);
CREATE POLICY "Owner can update profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student can see own attempts" ON assessment_attempts FOR ALL USING (auth.uid() = user_id);

ALTER TABLE development_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage IDP" ON development_plans FOR ALL USING (auth.uid() = user_id);

ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can view own evidence" ON evidence_files FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Mentors can review assigned evidence" ON evidence_files FOR UPDATE USING (
    EXISTS (SELECT 1 FROM mentor_assignments WHERE mentor_assignments.mentor_id = auth.uid() AND mentor_assignments.mentee_id = evidence_files.user_id AND mentor_assignments.status = 'ACTIVE')
);
