# CareerPath AI-Assisted Mentoring

CareerPath is a data-driven, evidence-based career guidance and mentoring platform for students from SMP/MTs, SMA/SMK/MA, to university undergraduates and final-year job/higher-education seekers.

It bridges self-assessment profiling, occupational mapping, individual development plans (IDP), portfolio verification, opportunity matching, context-aware AI mentoring, and asynchronous human mentorship into an integrated ecosystem.

---

## 🌟 Core Value Propositions & Pillars

1. **Evidence-Based Competency:** Clear separation between *Declared*, *Evidence-Backed*, and *Mentor-Validated* skills in the Student Skill Passport.
2. **Deterministic Scored Engines:** Assessments (Holland RIASEC), IDP progress %, and Opportunity eligibility are deterministically calculated on the server with clear explanations.
3. **Contextual AI Mentor:** Tailored guidance that injects real student context (education stage, target occupation, skill gaps, IDP status) while preserving privacy and ethical guardrails.
4. **Human-in-the-Loop:** BK teachers, lecturers, and industry mentors review evidence, assign structured tasks, and provide asynchronous feedback.
5. **Career Maturity Framework:** Evaluates students along a 4-tier journey:
   - **L1: EXPLORE** (SMP / MTs)
   - **L2: PLAN** (SMA / SMK / MA)
   - **L3: DEVELOP** (Undergraduates)
   - **L4: READY** (Final Year Transitioners)

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Actions, Route Handlers)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** Persistent SQL Relational Database + Supabase PostgreSQL DDL / RLS Scripts
- **AI Engine:** Multi-provider abstraction (Google Gemini API, OpenAI API, and Offline Rule-Based Simulation Fallback)
- **Validation:** Zod schemas

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ or v20+ (tested on Node v24)
- npm v9+

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd careerpath-ai

# Install dependencies
npm install
```

### 3. Environment Variables (Optional for Live AI)
Create a `.env.local` file in the project root:
```env
# Optional: Set either Gemini or OpenAI API key for live LLM responses
# If neither is set, CareerPath automatically activates its built-in
# Rule-Based Simulation Fallback so all features continue to work smoothly offline!
GEMINI_API_KEY="your-gemini-api-key"
# OPENAI_API_KEY="your-openai-api-key"

# Database Configuration
DATABASE_URL="file:./data/careerpath.db"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Personas & Fast-Switch Testing

For instant evaluation, CareerPath features a top-level **Quick-Switch Demo Bar** enabling you to log in as any role with a single click:

| Role / Persona | Demo Email | Level / Focus |
| :--- | :--- | :--- |
| **Student SMP** | `budi.explore@careerpath.id` | **L1: EXPLORE** - Interest discovery, broad horizons |
| **Student SMA** | `siti.plan@careerpath.id` | **L2: PLAN** - Major & degree planning, target setting |
| **Student Mahasiswa** | `reza.develop@careerpath.id` | **L3: DEVELOP** - Skill gap closing, active IDP (60%) |
| **Student Final Year** | `dewi.ready@careerpath.id` | **L4: READY** - Portfolio ready, validated passport |
| **Human Mentor** | `mentor.sarah@careerpath.id` | BK Teacher / Lecturer review queue & task manager |
| **Institution Admin** | `admin.itb@careerpath.id` | School/University aggregate analytics & student list |
| **Platform Admin** | `superadmin@careerpath.id` | Master catalog editor & system audit log viewer |

*Password for all demo accounts:* `DemoPass123!`

---

## 📚 Complete Project Documentation

Detailed technical and engineering specifications are located in the `docs/` folder:

1. [docs/BLUEPRINT.md](file:///d:/PAL/careerpath-ai/docs/BLUEPRINT.md) — **Master System Blueprint (Full Flowcharts, Architecture & UI/UX Lo-Fi/Hi-Fi Specs)**
2. [docs/SRS.md](file:///d:/PAL/careerpath-ai/docs/SRS.md) — Comprehensive Software Requirements Specification
3. [docs/ARCHITECTURE.md](file:///d:/PAL/careerpath-ai/docs/ARCHITECTURE.md) — System Architecture & Layered Domain Design
4. [docs/DATABASE.md](file:///d:/PAL/careerpath-ai/docs/DATABASE.md) — Relational Data Dictionary & Schema Specifications
5. [docs/ERD.md](file:///d:/PAL/careerpath-ai/docs/ERD.md) — Mermaid Entity Relationship Diagrams
6. [docs/API.md](file:///d:/PAL/careerpath-ai/docs/API.md) — API Contracts, Server Actions & Input/Output Schemas
7. [docs/AI_DESIGN.md](file:///d:/PAL/careerpath-ai/docs/AI_DESIGN.md) — AI Provider Abstraction, Prompts & Fallback Engine
8. [docs/SECURITY.md](file:///d:/PAL/careerpath-ai/docs/SECURITY.md) — RBAC, RLS Policies, Minor Privacy & Threat Model
9. [docs/TESTING.md](file:///d:/PAL/careerpath-ai/docs/TESTING.md) — Comprehensive Acceptance Matrix & Test Cases
10. [docs/ASSUMPTIONS.md](file:///d:/PAL/careerpath-ai/docs/ASSUMPTIONS.md) — Key Design Decisions & Business Assumptions
