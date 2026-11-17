# Software Requirements Specification (SRS)
## CareerPath AI-Assisted Mentoring

- **Project Name:** CareerPath AI-Assisted Mentoring
- **Document Version:** 1.0.0 (MVP Release)
- **Status:** Approved / In Implementation
- **Target Audience:** SMP/MTs (L1 Explore), SMA/SMK/MA (L2 Plan), University Students (L3 Develop), Final Year University Students (L4 Ready), Mentors (BK Teachers, Lecturers, Practitioners), Institution Admins, Platform Admins.

---

## 1. Executive Summary & Purpose

CareerPath AI-Assisted Mentoring is an evidence-based, data-driven career development and mentoring web platform connecting self-discovery assessments, career mapping, individualized development planning (IDP), competency validation, opportunity matching, contextual AI mentoring, and asynchronous human mentorship into a cohesive ecosystem.

Unlike generic career chatbots or static job boards, CareerPath bridges personal profile insights with tangible progress tracking and verified competency claims ("Evidence-Based Competence" and "Human-in-the-Loop").

---

## 2. Target Users & Role-Based Access Control (RBAC)

### 2.1 User Personas & Roles

1. **Student (`STUDENT`):**
   - Grade Levels: SMP/MTs, SMA/SMK/MA, Mahasiswa, Mahasiswa Tingkat Akhir.
   - Maturity Levels: L1 (EXPLORE), L2 (PLAN), L3 (DEVELOP), L4 (READY).
   - Core Capabilities: Undertake assessments, explore occupations, set career targets, generate & execute IDP, upload portfolio items & evidence, converse with AI Mentor, receive asynchronous feedback from assigned human mentors, browse & save opportunities.
2. **Mentor (`MENTOR`):**
   - BK Teachers, Academic Advisors, Lecturers, Alumni, Certified Industry Practitioners.
   - Core Capabilities: View assigned mentees, review mentee IDPs, evaluate evidence submissions (Approve / Reject / Request Revision), assign mentoring tasks with deadlines, participate in asynchronous mentoring discussions.
3. **Institution Admin (`INSTITUTION_ADMIN`):**
   - School or University Career Center / Counseling Unit Administrators.
   - Core Capabilities: Manage institution profile, invite/manage members, assign mentors to mentees, inspect aggregated institution analytics (career maturity distribution, common skill gaps, IDP progress).
4. **Platform Admin (`PLATFORM_ADMIN`):**
   - System Operator.
   - Core Capabilities: Manage user accounts and statuses, manage master catalogs (occupations, competencies, assessments, opportunities), view security audit logs, monitor AI consumption and system health.

### 2.2 Permissions Matrix

| Resource / Action | Student | Mentor | Institution Admin | Platform Admin |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Own Profile & Privacy** | CRUD (Self) | CRUD (Self) | CRUD (Self) | CRUD (All) |
| **Take Assessment & View Own Results** | CR (Self) | R (Assigned Mentees)* | R (Aggregated only) | CRUD |
| **Manage Career Target & Map** | CRU (Self) | R (Assigned Mentees) | R (Aggregated only) | CRUD (Master Catalog) |
| **Individual Development Plan (IDP)** | CRUD (Self) | R + Review / Comment | R (Aggregated only) | R |
| **Portfolio & Evidence Upload** | CRUD (Self) | R (Assigned Mentees) | - | R (Audit) |
| **Evidence Validation** | - | Validate (Assigned) | - | Validate / Override |
| **Skill Passport** | R (Self) | R (Assigned Mentees) | R (Aggregated) | R |
| **Opportunity Catalog** | R + Save | R | R | CRUD |
| **AI Career Mentor** | CR (Self) | - | - | R (Telemetry/Logs) |
| **Mentoring Tasks & Discussions** | R + Complete | CRUD (Assigned) | R (Overview) | R |
| **Institution Analytics** | - | - | R (Own Institution) | R (Platform-wide) |
| **Audit Logs & Master Catalogs** | - | - | - | CRUD |

*\*Subject to user consent and active mentor assignment.*

---

## 3. Four-Tier Career Journey & Career Maturity Framework

Career maturity is decoupled from physical age or biological grade; it reflects proven development milestones:

1. **L1: EXPLORE (SMP / MTs & Early Explorers)**
   - *Focus:* Self-discovery, interest profiling (RIASEC), broad occupational horizon, exploration activities.
   - *Milestone Output:* Interest profile, 3+ explored occupations, basic curiosity log.
2. **L2: PLAN (SMA / SMK / MA & Path Selectors)**
   - *Focus:* Academic path selection (IPA/IPS, Kejuruan, Major choice), prerequisite mapping, initial target setting.
   - *Milestone Output:* Target career selected, educational comparison matrix, initial skill requirements identified.
3. **L3: DEVELOP (University Undergraduates & Skill Builders)**
   - *Focus:* Skill-gap closing, structured IDP, coursework & organizational projects, internships, training.
   - *Milestone Output:* Active IDP with >=50% completion, initial evidence uploaded to Skill Passport.
4. **L4: READY (Final Year Students & Job/Higher-Ed Transitioners)**
   - *Focus:* Work-ready portfolio, CV optimization, text interview simulations, opportunity applications.
   - *Milestone Output:* Validated competencies, complete portfolio, >=80% IDP completion, interview simulation practice completed.

### Deterministic Maturity Evaluation Rule:
```
Score = (AssessmentCompleted * 20) + (HasTargetCareer * 20) + (IDPProgress% * 0.3) + (ValidatedEvidenceCount >= 2 ? 30 : EvidenceCount * 10)
If Score < 30 => L1: EXPLORE
If Score < 60 => L2: PLAN
If Score < 85 => L3: DEVELOP
If Score >= 85 => L4: READY
```

---

## 4. Functional Modules & Requirements

### Module 1: ASSESS (Self-Assessment & Profiling)
- **FR-AS-001:** Assessment Catalog with active instruments (e.g. Holland RIASEC Interest Inventory, Digital & Soft Skill Competency Self-Assessment).
- **FR-AS-002:** Structured Question Types (Likert 1-5, Single Choice, Multiple Choice) with clear dimension mapping.
- **FR-AS-003:** Deterministic Server-Side Scoring Engine.
- **FR-AS-004:** Comprehensive Result Interpretation showing primary/secondary dimensions, scores, radar charts, and explicit guidance.
- **FR-AS-005:** Assessment Versioning and Attempt History preservation.

### Module 2: MAP (Career Exploration & Recommendation)
- **FR-MP-001:** Curated Occupation Catalog with required hard & soft competencies, education pathways, median outlook, exploration tasks.
- **FR-MP-002:** Rule-Based Match Scoring Algorithm:
  - Input: Holland Codes / Assessment Dimensions (40%), Claimed/Proven Competencies (30%), Educational Level Alignment (20%), User Preference (10%).
  - Explainability: Explicit breakdown of why each occupation is recommended.
- **FR-MP-003:** Career Target Selection & Side-by-Side Occupation Comparison.
- **FR-MP-004:** Skill Gap Analysis calculating missing competencies between user profile and target occupation.

### Module 3: DEVELOP (Individual Development Plan - IDP)
- **FR-DV-001:** Manual IDP Creation & AI-Assisted IDP Draft Generation.
- **FR-DV-002:** Granular Activities with competency association, priority (High/Medium/Low), target date, and success indicators.
- **FR-DV-003:** Activity Status Lifecycle: `NOT_STARTED` -> `IN_PROGRESS` -> `COMPLETED` / `CANCELLED`.
- **FR-DV-004:** Dynamic IDP Completion Calculation based on verified activity completions.
- **FR-DV-005:** Direct Linking between IDP Activities and Portfolio Evidence items.

### Module 4: PROVE (Portfolio, Evidence & Skill Passport)
- **FR-PV-001:** Portfolio Management (Title, description, category, role, project URL, attachments).
- **FR-PV-002:** Evidence-Based Competence Tiers:
  1. *Declared / Claimed:* Stated by user without supporting artifact.
  2. *Evidence-Backed:* Accompanied by uploaded document, project URL, or IDP proof.
  3. *Mentor-Validated:* Formally verified and approved by an authorized mentor.
- **FR-PV-003:** Skill Passport aggregating hard & soft competencies categorized by validation tier.
- **FR-PV-004:** AI Portfolio & CV Feedback (objective analysis of clarity, structure, alignment without hallucinating user facts).
- **FR-PV-005:** Text-Based Interview Simulation (interactive Q&A tailored to target occupation with constructive scoring).

### Module 5: MATCH (Opportunity Catalog & Eligibility Engine)
- **FR-MT-001:** Curated Opportunity Listings (Internships, Scholarships, Training Bootcamps, Jobs).
- **FR-MT-002:** Rule-Based Eligibility Engine:
  - `ELIGIBLE`: All mandatory educational and competency requirements met.
  - `POTENTIAL_MATCH`: 60-99% criteria met or pending verification.
  - `NOT_ELIGIBLE`: Key mandatory prerequisites missing.
- **FR-MT-003:** Search, Categorization, and Opportunity Bookmarking.

### Module 6: AI CAREER MENTOR
- **FR-AI-001:** Context-Aware Mentoring Chat injecting student's current career target, assessment results, IDP status, and education level.
- **FR-AI-002:** Structured Output Generation for IDP drafting and skill gap summaries.
- **FR-AI-003:** Graceful Fallback Engine operating in offline/deterministic simulation mode when external API keys are unavailable.
- **FR-AI-004:** Safety Guardrails: Non-hallucinatory, no medical/psychological diagnosis, no employment guarantees.

### Module 7: HUMAN MENTORING (Asynchronous Collaboration)
- **FR-HM-001:** Mentor-Mentee Pairing & Access Boundary Enforcement.
- **FR-HM-002:** Evidence Review Queue with Approve / Reject / Revision workflow.
- **FR-HM-003:** Asynchronous Mentoring Discussions & IDP Feedback notes.
- **FR-HM-004:** Structured Mentoring Tasks with deadlines and progress verification.

### Module 8: CAREER ANALYTICS & DASHBOARD
- **FR-AN-001:** Student Dashboard featuring Career Maturity gauge, active target, IDP progress bar, pending tasks, recent mentor notes.
- **FR-AN-002:** Mentor Dashboard tracking active mentees, pending reviews, upcoming task deadlines.
- **FR-AN-003:** Institution Dashboard showing aggregate student counts, maturity stage breakdown, high-demand career pathways, and systemic skill gaps.

### Module 9: SYSTEM GOVERNANCE & AUDIT LOGS
- **FR-GV-001:** Platform Admin Catalog Management (Occupations, Competencies, Assessments, Opportunities).
- **FR-GV-002:** Tamper-Evident Audit Logging for security-critical actions (role modifications, evidence validation, catalog updates).
- **FR-GV-003:** User Privacy Controls & Consent Management.

---

## 5. Non-Functional Requirements (NFR)

1. **Responsive UI/UX:** Full mobile-first optimization down to 360px viewport width without horizontal scrollbars. Touch-friendly UI targets (min 44px).
2. **Performance:** Standard database queries p95 < 200ms; page interactive within 2.5s on 4G networks.
3. **Security:** Server-enforced authorization for all mutations, hashed passwords (bcrypt), HTTP-only secure session cookies, strict input sanitization via Zod.
4. **Data Integrity:** Foreign key integrity, database transactions for multi-step mutations, deterministic assessment calculations.
5. **Observability:** Centralized audit logs recording actor, target resource, timestamp, and metadata.
