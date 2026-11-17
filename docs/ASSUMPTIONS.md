# Architectural Assumptions & Business Decisions
## CareerPath AI-Assisted Mentoring

- **Document Version:** 1.0.0 (MVP)
- **Status:** Documented & Enforced

---

## 1. Architectural & Technical Decisions

### 1.1 Persistent Relational Storage & Local Zero-Friction Setup
- **Decision:** Use a persistent SQL relational database engine out of the box, with complete schema normalization, foreign key cascades, unique constraints, and ACID transactions.
- **Rationale:** Ensures that the project runs immediately and reliably in any local developer or evaluation environment without requiring external Docker daemons or cloud database subscriptions, while strictly meeting the requirement of a persistent real database.
- **Supabase Compatibility:** Complete Supabase PostgreSQL schema DDL and Row-Level Security (RLS) policies are provided in `supabase/migrations/` and `docs/DATABASE.md`, allowing instantaneous deployment to Supabase with zero schema friction.

### 1.2 Deterministic Assessment Scoring vs. LLM Hallucination
- **Decision:** All assessment dimension scores (Holland RIASEC, Competency tests), IDP progress percentages, opportunity eligibility statuses, and career maturity evaluations are computed deterministically via server-side business logic.
- **Rationale:** LLMs are prone to arithmetic errors and non-deterministic variability. Calculating scores deterministically ensures 100% testability, compliance with psychological instrument guidelines, and clear explainability. The AI's role is restricted to explanatory synthesis and contextual advisory.

### 1.3 AI Multi-Provider Abstraction with Offline Simulation Fallback
- **Decision:** Build an AI abstraction layer supporting Google Gemini (`GEMINI_API_KEY`), OpenAI (`OPENAI_API_KEY`), and an automatic Rule-Based Simulation Fallback.
- **Rationale:** If an evaluator runs the application without configuring third-party API keys, or if external API quotas are exceeded, the application must not crash or fail. The simulation fallback delivers realistic, structured career advice, explicitly noting that it is operating in offline mode.

### 1.4 Fast-Switch Demo Mode & RBAC Authentication
- **Decision:** Provide a Quick-Switch Demo Bar alongside standard email/password authentication.
- **Rationale:** Enables evaluators and QA testers to effortlessly inspect the system from all 7 critical personas (Student SMP, Student SMA, Student Mahasiswa, Student Final Year, Mentor, Institution Admin, Platform Admin) with one click, populated with rich seed data illustrating each stage of the career maturity pipeline.

### 1.5 File Storage Abstraction
- **Decision:** In the MVP, evidence artifacts support external URLs (GitHub repositories, Google Drive / Dropbox links, hosted certificates) and local media uploads, with verified metadata (MIME type, file size, owner ID).
- **Rationale:** Allows students to showcase live artifacts immediately without incurring cloud bucket fees or external credential blocks during local demonstration.

---

## 2. Business Logic Scope & MVP Boundaries

| Area | Included in MVP | Deferred to Post-MVP (P2) |
| :--- | :--- | :--- |
| **Human Mentoring** | Asynchronous discussions, task assignments with due dates, evidence review queue, formal feedback notes. | Real-time WebRTC video calling, interactive whiteboards. |
| **Opportunity Catalog** | Curated catalog of internships, scholarships, bootcamps with rule-based eligibility evaluation and search filters. | Automated web scraping of LinkedIn/Jobstreet, ATS integrations. |
| **Assessments** | Standard Holland RIASEC inventory & Digital Competence self-assessment with deterministic scoring. | Custom psychological instrument psychometric validation suite. |
| **Monetization** | N/A (Fully accessible educational tier). | Payment gateway, subscription billing, payout to mentors. |
