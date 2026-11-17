# API Specification & Contract
## CareerPath AI-Assisted Mentoring

- **Protocol:** HTTPS (Next.js Server Actions & Route Handlers)
- **Data Format:** JSON (`application/json`)
- **Authentication:** HTTP-Only Secure Cookie Session Token (`careerpath_session`)
- **Version:** 1.0.0 (MVP)

---

## 1. Authentication & User Profile

### `POST /api/auth/register`
- **Description:** Registers a new account and initializes a base profile and GDPR consents.
- **Access:** Public.
- **Input Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "Min8CharactersPassword!",
    "full_name": "Budi Santoso",
    "role": "STUDENT",
    "education_level": "SMA",
    "institution_code": "SMAN1-JKT" // optional
  }
  ```
- **Validation:** Email format, password min 8 chars, valid role enum (`STUDENT`, `MENTOR`).
- **Success (201):** `{ "success": true, "user": { "id": "...", "email": "...", "role": "..." } }`
- **Errors:** 400 (Validation failed), 409 (Email already registered).

### `POST /api/auth/login`
- **Description:** Authenticates user credentials and issues a secure session cookie.
- **Access:** Public.
- **Input Payload:** `{ "email": "...", "password": "..." }`
- **Success (200):** `{ "success": true, "user": { "id": "...", "email": "...", "role": "...", "full_name": "..." } }`
- **Errors:** 401 (Invalid email or password).

### `POST /api/auth/demo-switch`
- **Description:** Instant one-click authentication switch for evaluators and test demonstrations across all personas.
- **Access:** Public (Development / Evaluation Mode).
- **Input Payload:** `{ "demo_role": "STUDENT_SMP" | "STUDENT_SMA" | "STUDENT_MAHASISWA" | "STUDENT_FINAL" | "MENTOR" | "INSTITUTION_ADMIN" | "PLATFORM_ADMIN" }`
- **Success (200):** Sets session cookie and returns user profile.

---

## 2. Assessment Module (ASSESS)

### `GET /api/assessments`
- **Description:** Returns list of active assessment instruments.
- **Access:** Authenticated.
- **Success (200):**
  ```json
  {
    "assessments": [
      {
        "id": "uuid",
        "title": "Holland RIASEC Career Interest Inventory",
        "slug": "riasec-interest",
        "description": "Explores interest distribution across 6 personality types.",
        "question_count": 18,
        "estimated_minutes": 10
      }
    ]
  }
  ```

### `GET /api/assessments/[id]`
- **Description:** Fetches questions for the selected assessment.
- **Access:** Authenticated.
- **Success (200):** Returns assessment metadata and ordered array of questions with options.

### `POST /api/assessments/[id]/submit`
- **Description:** Submits student responses, calculates deterministic scores, and stores attempt and results.
- **Access:** Student.
- **Input Payload:**
  ```json
  {
    "answers": [
      { "question_id": "uuid", "selected_value": "4", "score_value": 4 }
    ]
  }
  ```
- **Business Process:**
  1. Validates all required questions are answered.
  2. Aggregates scores per dimension (`REALISTIC`, `INVESTIGATIVE`, `ARTISTIC`, `SOCIAL`, `ENTERPRISING`, `CONVENTIONAL`).
  3. Sorts dimensions to identify primary and secondary traits (Holland Code, e.g. "ISA").
  4. Generates interpretive narrative and recommended career pathways.
  5. Updates student career maturity points (+20 pts).
- **Success (200):** Returns calculated `result` object including dimensions, Holland Code, and next step suggestions.

---

## 3. Career Map Module (MAP)

### `GET /api/careers`
- **Description:** Filterable catalog of verified occupations.
- **Query Params:** `category`, `search`, `min_outlook`.
- **Success (200):** Array of occupation summaries.

### `GET /api/careers/recommendations`
- **Description:** Generates explainable career recommendations for the authenticated student.
- **Access:** Student.
- **Scoring Engine:**
  - RIASEC Alignment: 40%
  - Existing Competency Overlap: 30%
  - Education Level Fit: 20%
  - Preference Fit: 10%
- **Success (200):**
  ```json
  {
    "recommendations": [
      {
        "occupation_id": "uuid",
        "title": "Data Analyst",
        "category": "Teknologi Informasi",
        "match_score": 88,
        "factors": {
          "interest_fit": "High alignment with Investigative & Conventional profile",
          "matched_skills": ["SQL", "Statistical Thinking"],
          "gap_skills": ["PowerBI", "Python for Data Analysis"]
        }
      }
    ]
  }
  ```

### `POST /api/careers/target`
- **Description:** Sets or updates user's active target career.
- **Access:** Student.
- **Input Payload:** `{ "occupation_id": "uuid" }`
- **Success (200):** Updates profile and triggers maturity point recalculation.

---

## 4. Development Plan Module (DEVELOP)

### `GET /api/idp`
- **Description:** Retrieves user's active IDP with activities, competencies, and completion percentage.
- **Access:** Student (own IDP), Mentor (assigned mentee's IDP).

### `POST /api/idp`
- **Description:** Creates an Individual Development Plan manually or confirms an AI draft.
- **Input Payload:**
  ```json
  {
    "title": "Data Analyst Prep 2026",
    "target_career_id": "uuid",
    "target_end_date": "2026-12-31",
    "rationale": "Closing technical gaps in Python & Data Viz",
    "activities": [
      {
        "title": "Complete Python Data Fundamentals Course",
        "description": "Finish 20 modules with capstone project",
        "priority": "HIGH",
        "target_date": "2026-06-30",
        "competency_id": "uuid",
        "success_indicators": "Certificate of completion & GitHub repo"
      }
    ]
  }
  ```

### `PATCH /api/idp/activities/[id]`
- **Description:** Updates status (`NOT_STARTED` -> `IN_PROGRESS` -> `COMPLETED`) and logs progress.
- **Access:** Student (Owner).
- **Business Process:** Recalculates parent IDP `progress_percentage = (CompletedActivities / TotalActivities) * 100`.

---

## 5. Portfolio, Evidence & Skill Passport (PROVE)

### `POST /api/portfolio/items`
- **Description:** Creates a portfolio showcase item.
- **Input Payload:** Title, category, description, role, project_url, tools_used, is_public.

### `POST /api/evidence/upload`
- **Description:** Attaches proof artifact (file URL, project link, certificate) to an IDP activity or portfolio item.
- **Input Payload:** `{ "title": "...", "file_url": "...", "activity_id": "...", "competency_ids": ["uuid"] }`
- **Initial Status:** `UNREVIEWED`, Tier: `EVIDENCE_BACKED`.

### `POST /api/evidence/[id]/review`
- **Description:** Validates or rejects evidence submission.
- **Access:** Mentor (assigned to student) or Platform Admin.
- **Input Payload:** `{ "validation_status": "VALIDATED" | "REJECTED", "feedback": "Excellent code quality" }`
- **Business Process:** When `VALIDATED`, transitions associated competencies in `competency_evidence` to `MENTOR_VALIDATED` tier and awards maturity points.

### `GET /api/skill-passport`
- **Description:** Displays structured competence passport grouped into:
  1. Claimed (Self-reported)
  2. Evidence-Backed (Artifact submitted)
  3. Mentor-Validated (Verified by authorized mentor)

---

## 6. Opportunity Match Module (MATCH)

### `GET /api/opportunities`
- **Description:** Browsable catalog of internships, scholarships, and training.
- **Filters:** `type`, `education_level`, `search`, `work_type`.

### `GET /api/opportunities/[id]/match-analysis`
- **Description:** Diagnoses student eligibility against the opportunity's prerequisites.
- **Output:**
  ```json
  {
    "status": "POTENTIAL_MATCH", // ELIGIBLE | POTENTIAL_MATCH | NOT_ELIGIBLE
    "match_percentage": 75,
    "fulfilled_requirements": ["Undergraduate Student", "Technical Portfolio exists"],
    "unfulfilled_requirements": ["Minimum 3 Mentor-Validated Competencies (Has 1)"],
    "actionable_recommendations": "Complete pending IDP activities to validate remaining competencies."
  }
  ```

---

## 7. AI Career Mentor Module

### `POST /api/ai/chat`
- **Description:** Streams or returns contextual AI mentoring guidance.
- **Payload:** `{ "conversation_id": "uuid", "message": "How do I prepare for a data engineering internship?" }`
- **Context Injection:** Injects user's career stage, target career, RIASEC code, and top skill gaps without leaking private data of other users.
- **Fallback Behavior:** If external LLM API is unavailable, gracefully delivers structured rule-based career guidance with explicit offline notification.

---

## 8. Human Mentoring Module

### `GET /api/mentor/mentees`
- **Description:** Lists students assigned to the authenticated mentor.
- **Access:** Mentor.

### `POST /api/mentor/tasks`
- **Description:** Assigns structured mentoring task with deadline.
- **Access:** Mentor.
- **Payload:** `{ "mentee_id": "uuid", "title": "Revise Project Readme", "due_date": "2026-05-15", "description": "..." }`

### `POST /api/mentor/discussions/[id]/comments`
- **Description:** Asynchronous message exchange on IDP or Portfolio items.
- **Access:** Assigned Mentor & Mentee.
