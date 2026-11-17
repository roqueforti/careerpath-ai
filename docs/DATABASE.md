# Database Schema & Data Dictionary
## CareerPath AI-Assisted Mentoring

- **Database Engine:** PostgreSQL (Supabase Compatible) / Persistent SQLite Engine
- **Primary Keys:** UUID (v4)
- **Time Format:** UTC ISO-8601 Timestamps (`timestamptz`)
- **Version:** 1.0.0 (MVP)

---

## 1. Entity Overview & Relationship Summary

The schema is normalized to 3NF where appropriate, utilizing relational integrity constraints (`ON DELETE CASCADE` / `SET NULL`), unique composite indexes, and check constraints to guarantee business rules at the persistence layer.

---

## 2. Table Specifications

### 2.1 Identity, Users & Institutions

#### `users`
Represents core authenticated identity accounts.
- `id` (UUID, PK, Default: `gen_random_uuid()`): Unique user ID.
- `email` (VARCHAR(255), UNIQUE, NOT NULL): Authentication email.
- `password_hash` (VARCHAR(255), NOT NULL): Hashed credential (bcrypt/argon2).
- `full_name` (VARCHAR(255), NOT NULL): Real name of the user.
- `role` (VARCHAR(50), NOT NULL, Check: `STUDENT`, `MENTOR`, `INSTITUTION_ADMIN`, `PLATFORM_ADMIN`): RBAC role.
- `avatar_url` (VARCHAR(500), NULL): Profile photo URL.
- `created_at` (TIMESTAMPTZ, Default: `NOW()`): Account registration time.
- `updated_at` (TIMESTAMPTZ, Default: `NOW()`): Last account update.

#### `profiles`
Domain profile storing education and career progress attributes.
- `id` (UUID, PK, FK `users.id` ON DELETE CASCADE): 1-to-1 link with user.
- `education_level` (VARCHAR(50), NOT NULL, Check: `SMP`, `SMA`, `SMK`, `MA`, `MAHASISWA`, `MAHASISWA_AKHIR`, `UMUM`): Academic level.
- `career_maturity` (VARCHAR(20), NOT NULL, Default: `EXPLORE`, Check: `EXPLORE`, `PLAN`, `DEVELOP`, `READY`): Evaluated maturity stage.
- `career_maturity_score` (INT, Default: 0): Computed maturity point total (0-100).
- `target_career_id` (UUID, NULL, FK `occupations.id` ON DELETE SET NULL): Active target career.
- `bio` (TEXT, NULL): Self-summary or aspiration note.
- `phone` (VARCHAR(50), NULL): Contact number.
- `interests` (TEXT[], Default: `{}`): Stated fields of interest.
- `is_public` (BOOLEAN, Default: false): Privacy visibility toggle.

#### `institutions`
Partner schools, colleges, or career counseling centers.
- `id` (UUID, PK): Institution ID.
- `name` (VARCHAR(255), NOT NULL): Name (e.g. "SMA Negeri 1 Jakarta", "Institut Teknologi Bandung").
- `type` (VARCHAR(50), NOT NULL, Check: `SEKOLAH`, `UNIVERSITAS`, `LEMBAGA_PELATIHAN`): Category.
- `code` (VARCHAR(50), UNIQUE, NOT NULL): Institution registration code.
- `address` (TEXT, NULL): Physical location.
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `institution_memberships`
Affiliation linking users (students or mentors) to institutions.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `institution_id` (UUID, NOT NULL, FK `institutions.id` ON DELETE CASCADE).
- `member_role` (VARCHAR(50), NOT NULL, Check: `STUDENT`, `MENTOR`, `ADMIN`).
- `student_id_number` (VARCHAR(100), NULL): NISN / NIM.
- `joined_at` (TIMESTAMPTZ, Default: `NOW()`).
- *Constraint:* UNIQUE(`user_id`, `institution_id`).

#### `mentor_assignments`
Formal pairing between a mentor and student.
- `id` (UUID, PK).
- `mentor_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `mentee_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `institution_id` (UUID, NULL, FK `institutions.id` ON DELETE SET NULL).
- `status` (VARCHAR(20), Default: `ACTIVE`, Check: `ACTIVE`, `COMPLETED`, `REVOKED`).
- `assigned_at` (TIMESTAMPTZ, Default: `NOW()`).
- *Constraint:* UNIQUE(`mentor_id`, `mentee_id`).

#### `user_consents`
Explicit audit trail of GDPR/data protection consents.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `consent_type` (VARCHAR(100), NOT NULL, e.g. `TERMS_OF_SERVICE`, `DATA_PROCESSING`, `AI_CONTEXT_USAGE`).
- `is_granted` (BOOLEAN, NOT NULL, Default: true).
- `granted_at` (TIMESTAMPTZ, Default: `NOW()`).

---

### 2.2 Assessments (ASSESS)

#### `assessments`
Master catalog of psychological & competence assessment instruments.
- `id` (UUID, PK).
- `title` (VARCHAR(255), NOT NULL): Instrument name (e.g. "Holland RIASEC Interest Inventory").
- `slug` (VARCHAR(100), UNIQUE, NOT NULL).
- `description` (TEXT, NOT NULL).
- `assessment_type` (VARCHAR(50), NOT NULL, Check: `INTEREST_RIASEC`, `COMPETENCY_GENERAL`, `WORK_VALUES`).
- `instruction` (TEXT, NOT NULL).
- `min_education_level` (VARCHAR(50), Default: `SMP`).
- `version` (INT, Default: 1).
- `is_active` (BOOLEAN, Default: true).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `assessment_questions`
Individual test items.
- `id` (UUID, PK).
- `assessment_id` (UUID, NOT NULL, FK `assessments.id` ON DELETE CASCADE).
- `question_text` (TEXT, NOT NULL).
- `question_type` (VARCHAR(50), NOT NULL, Check: `LIKERT_5`, `SINGLE_CHOICE`, `MULTIPLE_CHOICE`).
- `dimension` (VARCHAR(50), NOT NULL, e.g. `REALISTIC`, `INVESTIGATIVE`, `ARTISTIC`, `SOCIAL`, `ENTERPRISING`, `CONVENTIONAL`).
- `order_num` (INT, NOT NULL).
- `options_json` (JSONB, NOT NULL, Array of `{ label, value, score }`).

#### `assessment_attempts`
Student test-taking sessions.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `assessment_id` (UUID, NOT NULL, FK `assessments.id` ON DELETE CASCADE).
- `version` (INT, NOT NULL).
- `status` (VARCHAR(20), NOT NULL, Default: `IN_PROGRESS`, Check: `IN_PROGRESS`, `SUBMITTED`, `EVALUATED`).
- `started_at` (TIMESTAMPTZ, Default: `NOW()`).
- `completed_at` (TIMESTAMPTZ, NULL).

#### `assessment_answers`
Granular item responses for auditability.
- `id` (UUID, PK).
- `attempt_id` (UUID, NOT NULL, FK `assessment_attempts.id` ON DELETE CASCADE).
- `question_id` (UUID, NOT NULL, FK `assessment_questions.id` ON DELETE CASCADE).
- `selected_value` (VARCHAR(100), NOT NULL).
- `score_value` (INT, NOT NULL).
- *Constraint:* UNIQUE(`attempt_id`, `question_id`).

#### `assessment_results`
Calculated dimensional scores and explanatory analysis.
- `id` (UUID, PK).
- `attempt_id` (UUID, UNIQUE, NOT NULL, FK `assessment_attempts.id` ON DELETE CASCADE).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `assessment_id` (UUID, NOT NULL, FK `assessments.id` ON DELETE CASCADE).
- `summary` (TEXT, NOT NULL).
- `primary_dimension` (VARCHAR(50), NOT NULL).
- `secondary_dimension` (VARCHAR(50), NULL).
- `dimensions_json` (JSONB, NOT NULL): Key-value pairs of `{ [dimension]: score }`.
- `interpretation` (TEXT, NOT NULL).
- `next_steps` (TEXT, NOT NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

---

### 2.3 Occupations & Competencies (MAP)

#### `occupations`
Master database of verified career options.
- `id` (UUID, PK).
- `title` (VARCHAR(255), NOT NULL, e.g. "Software Engineer", "Clinical Psychologist").
- `slug` (VARCHAR(150), UNIQUE, NOT NULL).
- `category` (VARCHAR(100), NOT NULL, e.g. "Teknologi Informasi", "Kesehatan", "Bisnis & Manajemen").
- `description` (TEXT, NOT NULL).
- `holland_code` (VARCHAR(10), NOT NULL, e.g. "IRC", "SEC").
- `education_paths` (TEXT[], NOT NULL): Recommended degree/major paths.
- `exploration_activities` (TEXT[], NOT NULL): Concrete tasks for SMP/SMA.
- `salary_range` (VARCHAR(100), NULL).
- `outlook` (VARCHAR(50), NOT NULL, Check: `VERY_HIGH`, `HIGH`, `MODERATE`, `GROWING`).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `competencies`
Granular skill dictionary.
- `id` (UUID, PK).
- `name` (VARCHAR(255), NOT NULL).
- `code` (VARCHAR(50), UNIQUE, NOT NULL).
- `category` (VARCHAR(50), NOT NULL, Check: `TECHNICAL`, `SOFT_SKILL`, `METHODOLOGY`).
- `description` (TEXT, NOT NULL).

#### `occupation_competencies`
Competencies required per career.
- `id` (UUID, PK).
- `occupation_id` (UUID, NOT NULL, FK `occupations.id` ON DELETE CASCADE).
- `competency_id` (UUID, NOT NULL, FK `competencies.id` ON DELETE CASCADE).
- `expected_level` (VARCHAR(20), NOT NULL, Check: `BASIC`, `INTERMEDIATE`, `ADVANCED`).
- `importance` (VARCHAR(20), NOT NULL, Check: `CRITICAL`, `IMPORTANT`, `NICE_TO_HAVE`).
- *Constraint:* UNIQUE(`occupation_id`, `competency_id`).

#### `career_recommendations`
Personalized career matching scores.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `occupation_id` (UUID, NOT NULL, FK `occupations.id` ON DELETE CASCADE).
- `match_score` (INT, NOT NULL, 0-100).
- `match_factors_json` (JSONB, NOT NULL): Breakdown of RIASEC alignment, competence overlap, education fit.
- `calculated_at` (TIMESTAMPTZ, Default: `NOW()`).
- *Constraint:* UNIQUE(`user_id`, `occupation_id`).

#### `saved_careers`
User's bookmarked careers for exploration.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `occupation_id` (UUID, NOT NULL, FK `occupations.id` ON DELETE CASCADE).
- `saved_at` (TIMESTAMPTZ, Default: `NOW()`).
- *Constraint:* UNIQUE(`user_id`, `occupation_id`).

---

### 2.4 Individual Development Plan (DEVELOP)

#### `development_plans`
User's structured career development roadmap.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `target_career_id` (UUID, NOT NULL, FK `occupations.id` ON DELETE CASCADE).
- `title` (VARCHAR(255), NOT NULL).
- `rationale` (TEXT, NOT NULL).
- `status` (VARCHAR(20), NOT NULL, Default: `ACTIVE`, Check: `DRAFT`, `ACTIVE`, `COMPLETED`, `ARCHIVED`).
- `progress_percentage` (INT, NOT NULL, Default: 0).
- `target_end_date` (DATE, NOT NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).
- `updated_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `development_activities`
Granular milestone tasks in an IDP.
- `id` (UUID, PK).
- `plan_id` (UUID, NOT NULL, FK `development_plans.id` ON DELETE CASCADE).
- `competency_id` (UUID, NULL, FK `competencies.id` ON DELETE SET NULL).
- `title` (VARCHAR(255), NOT NULL).
- `description` (TEXT, NOT NULL).
- `priority` (VARCHAR(20), NOT NULL, Check: `HIGH`, `MEDIUM`, `LOW`).
- `target_date` (DATE, NOT NULL).
- `status` (VARCHAR(20), NOT NULL, Default: `NOT_STARTED`, Check: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
- `success_indicators` (TEXT, NOT NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).
- `updated_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `activity_progress_logs`
Chronological progress log per activity.
- `id` (UUID, PK).
- `activity_id` (UUID, NOT NULL, FK `development_activities.id` ON DELETE CASCADE).
- `status_before` (VARCHAR(20), NOT NULL).
- `status_after` (VARCHAR(20), NOT NULL).
- `notes` (TEXT, NULL).
- `logged_at` (TIMESTAMPTZ, Default: `NOW()`).

---

### 2.5 Portfolios & Evidence (PROVE)

#### `portfolios`
Main portfolio profile container.
- `id` (UUID, PK).
- `user_id` (UUID, UNIQUE, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `title` (VARCHAR(255), NOT NULL).
- `summary` (TEXT, NULL).
- `is_public` (BOOLEAN, Default: false).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `portfolio_items`
Individual work samples, projects, certifications, or leadership accomplishments.
- `id` (UUID, PK).
- `portfolio_id` (UUID, NOT NULL, FK `portfolios.id` ON DELETE CASCADE).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `title` (VARCHAR(255), NOT NULL).
- `description` (TEXT, NOT NULL).
- `category` (VARCHAR(50), NOT NULL, Check: `PROJECT`, `CERTIFICATE`, `EXPERIENCE`, `ORGANIZATION`, `WRITING`).
- `role` (VARCHAR(100), NULL).
- `project_url` (VARCHAR(500), NULL).
- `start_date` (DATE, NULL).
- `end_date` (DATE, NULL).
- `tools_used` (TEXT[], Default: `{}`).
- `is_public` (BOOLEAN, Default: true).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `evidence_files`
Tangible artifacts uploaded to support portfolio items or IDP activities.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `portfolio_item_id` (UUID, NULL, FK `portfolio_items.id` ON DELETE CASCADE).
- `activity_id` (UUID, NULL, FK `development_activities.id` ON DELETE SET NULL).
- `title` (VARCHAR(255), NOT NULL).
- `file_url` (VARCHAR(500), NOT NULL).
- `file_type` (VARCHAR(50), NOT NULL).
- `file_size` (INT, NOT NULL).
- `validation_status` (VARCHAR(20), Default: `UNREVIEWED`, Check: `UNREVIEWED`, `IN_REVIEW`, `VALIDATED`, `REJECTED`).
- `reviewed_by` (UUID, NULL, FK `users.id` ON DELETE SET NULL).
- `reviewed_at` (TIMESTAMPTZ, NULL).
- `review_feedback` (TEXT, NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `competency_evidence`
Links specific competencies to evidence and tracks validation tier.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `competency_id` (UUID, NOT NULL, FK `competencies.id` ON DELETE CASCADE).
- `evidence_file_id` (UUID, NULL, FK `evidence_files.id` ON DELETE CASCADE).
- `tier` (VARCHAR(20), NOT NULL, Check: `CLAIMED`, `EVIDENCE_BACKED`, `MENTOR_VALIDATED`).
- `validated_at` (TIMESTAMPTZ, NULL).
- *Constraint:* UNIQUE(`user_id`, `competency_id`, `evidence_file_id`).

---

### 2.6 Opportunities (MATCH)

#### `opportunities`
Curated scholarships, internships, training bootcamps, and jobs.
- `id` (UUID, PK).
- `title` (VARCHAR(255), NOT NULL).
- `type` (VARCHAR(50), NOT NULL, Check: `INTERNSHIP`, `SCHOLARSHIP`, `TRAINING`, `JOB`).
- `organization` (VARCHAR(255), NOT NULL).
- `location` (VARCHAR(150), NOT NULL).
- `work_type` (VARCHAR(50), NOT NULL, Check: `REMOTE`, `HYBRID`, `ON_SITE`).
- `education_level` (VARCHAR(50), NOT NULL, Check: `SMP`, `SMA_SMK`, `MAHASISWA`, `SEMUA`).
- `description` (TEXT, NOT NULL).
- `requirements_json` (JSONB, NOT NULL, Array of required attributes).
- `deadline` (DATE, NULL).
- `url` (VARCHAR(500), NOT NULL).
- `is_active` (BOOLEAN, Default: true).
- `verified_at` (TIMESTAMPTZ, Default: `NOW()`).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `opportunity_competencies`
Prerequisite competencies for each listing.
- `id` (UUID, PK).
- `opportunity_id` (UUID, NOT NULL, FK `opportunities.id` ON DELETE CASCADE).
- `competency_id` (UUID, NOT NULL, FK `competencies.id` ON DELETE CASCADE).
- `is_mandatory` (BOOLEAN, Default: true).
- *Constraint:* UNIQUE(`opportunity_id`, `competency_id`).

#### `saved_opportunities`
Bookmarked listings.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `opportunity_id` (UUID, NOT NULL, FK `opportunities.id` ON DELETE CASCADE).
- `saved_at` (TIMESTAMPTZ, Default: `NOW()`).
- *Constraint:* UNIQUE(`user_id`, `opportunity_id`).

---

### 2.7 AI Mentoring & Human Mentoring

#### `ai_conversations`
Chat sessions with the AI Career Mentor.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `title` (VARCHAR(255), NOT NULL).
- `context_topic` (VARCHAR(100), NULL, e.g. "IDP Planning", "Skill Gap Analysis", "CV Review").
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).
- `updated_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `ai_messages`
Messages exchanged within an AI conversation.
- `id` (UUID, PK).
- `conversation_id` (UUID, NOT NULL, FK `ai_conversations.id` ON DELETE CASCADE).
- `sender_role` (VARCHAR(20), NOT NULL, Check: `USER`, `ASSISTANT`, `SYSTEM`).
- `content` (TEXT, NOT NULL).
- `structured_output_json` (JSONB, NULL): Structured IDP drafts or feedback payloads.
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `mentoring_tasks`
Tasks assigned by human mentors.
- `id` (UUID, PK).
- `mentor_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `mentee_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `title` (VARCHAR(255), NOT NULL).
- `description` (TEXT, NOT NULL).
- `due_date` (DATE, NOT NULL).
- `status` (VARCHAR(20), NOT NULL, Default: `PENDING`, Check: `PENDING`, `SUBMITTED`, `COMPLETED`, `REJECTED`).
- `completed_at` (TIMESTAMPTZ, NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `mentoring_discussions`
Asynchronous message threads between mentor and mentee.
- `id` (UUID, PK).
- `mentor_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `mentee_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `target_type` (VARCHAR(50), NOT NULL, Check: `IDP`, `PORTFOLIO_ITEM`, `EVIDENCE`, `GENERAL`).
- `target_id` (UUID, NULL).
- `title` (VARCHAR(255), NOT NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `mentoring_comments`
Comments within an asynchronous discussion.
- `id` (UUID, PK).
- `discussion_id` (UUID, NOT NULL, FK `mentoring_discussions.id` ON DELETE CASCADE).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `message` (TEXT, NOT NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `mentor_feedback`
Formal feedback on milestones or evidence.
- `id` (UUID, PK).
- `mentor_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `mentee_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `target_type` (VARCHAR(50), NOT NULL, Check: `IDP`, `PORTFOLIO`, `EVIDENCE`).
- `target_id` (UUID, NOT NULL).
- `feedback_text` (TEXT, NOT NULL).
- `rating` (INT, NULL, Check: 1-5).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

---

### 2.8 System Notifications & Audit Logs

#### `notifications`
In-app notifications.
- `id` (UUID, PK).
- `user_id` (UUID, NOT NULL, FK `users.id` ON DELETE CASCADE).
- `type` (VARCHAR(50), NOT NULL, Check: `FEEDBACK_RECEIVED`, `TASK_ASSIGNED`, `EVIDENCE_VALIDATED`, `DEADLINE_APPROACHING`, `SYSTEM`).
- `title` (VARCHAR(255), NOT NULL).
- `message` (TEXT, NOT NULL).
- `link_url` (VARCHAR(500), NULL).
- `is_read` (BOOLEAN, Default: false).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).

#### `audit_logs`
Immutable record of security-sensitive operations.
- `id` (UUID, PK).
- `user_id` (UUID, NULL, FK `users.id` ON DELETE SET NULL).
- `action` (VARCHAR(100), NOT NULL, e.g. `USER_ROLE_UPDATED`, `EVIDENCE_VALIDATED`, `CATALOG_MODIFIED`).
- `resource` (VARCHAR(100), NOT NULL).
- `resource_id` (VARCHAR(100), NULL).
- `details_json` (JSONB, NULL).
- `ip_address` (VARCHAR(50), NULL).
- `created_at` (TIMESTAMPTZ, Default: `NOW()`).
