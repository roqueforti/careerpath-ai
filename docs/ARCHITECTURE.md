# System Architecture & Technical Design
## CareerPath AI-Assisted Mentoring

- **Architecture Pattern:** Modular Monolith (Next.js App Router Full-Stack)
- **Version:** 1.0.0 (MVP)

---

## 1. High-Level Architecture Overview

CareerPath is constructed as a high-cohesion, low-coupling **Modular Monolith**. Rather than fragmenting the early product into fragile microservices, the system leverages Next.js App Router to co-locate secure server-side domain logic, type-safe data access, deterministic algorithmic engines, and responsive client interfaces.

```
+-----------------------------------------------------------------------+
|                           CLIENT TIER                                 |
|  - Mobile Viewport (360px+) / Desktop Responsive Views                |
|  - Role-Optimized UI (Student, Mentor, Institution Admin, Sysadmin)   |
|  - Lucide Icons + Tailwind CSS Modern Design System                   |
+-----------------------------------------------------------------------+
                                   | (HTTPS / Server Actions / REST API)
                                   v
+-----------------------------------------------------------------------+
|                        APPLICATION GATEWAY                            |
|  - Next.js App Router Middleware (Route Protection & RBAC)            |
|  - Input Validation Layer (Zod Schemas)                               |
|  - CSRF, Rate Limiting & Tamper Prevention                            |
+-----------------------------------------------------------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                      APPLICATION DOMAIN SERVICES                      |
|  +--------------------+  +--------------------+  +------------------+ |
|  | Assessment Engine  |  | Career Map Service |  | IDP Engine       | |
|  | (Deterministic)   |  | (Weighted Match)   |  | (Life Cycle)     | |
|  +--------------------+  +--------------------+  +------------------+ |
|  +--------------------+  +--------------------+  +------------------+ |
|  | Portfolio & Proof  |  | Match & Eligibility|  | Human Mentoring  | |
|  | (3-Tier Passport)  |  | (Rule Engine)      |  | (Async Collab)   | |
|  +--------------------+  +--------------------+  +------------------+ |
|  +--------------------+  +--------------------+  +------------------+ |
|  | AI Mentor Service  |  | Analytics Engine   |  | Audit & Security | |
|  | (LLM Abstraction)  |  | (Maturity L1-L4)   |  | (Activity Logs)  | |
|  +--------------------+  +--------------------+  +------------------+ |
+-----------------------------------------------------------------------+
                                   |
                  +----------------+----------------+
                  |                                 |
                  v                                 v
+-----------------------------------+   +-------------------------------+
|      PERSISTENT DATABASE TIER     |   |      AI SERVICE ADAPTER       |
|  - Prisma ORM (ACID Transactions) |   |  - Google Gemini API Adapter  |
|  - Persistent SQL Storage         |   |  - OpenAI API Adapter         |
|  - Foreign Keys & Unique Indexes  |   |  - Rule-Based Simulation      |
|  - Supabase PostgreSQL / RLS Ready|   |    Fallback (Offline Mode)    |
+-----------------------------------+   +-------------------------------+
```

---

## 2. Layered Responsibilities

### 2.1 Presentation & UI Layer (`src/components/`, `src/app/`)
- Pure presentation and user interaction.
- Strict isolation from database connections or secret environment variables.
- Responsive design tailored for viewports from 360px mobile to wide desktop monitors.
- Accessible ARIA labels, semantic HTML, visible focus outlines, and rich visual states (loading, empty, error, success).

### 2.2 Route & Action Dispatcher (`src/app/api/`, `src/actions/`)
- Server Actions for state-altering operations (taking assessment, saving target career, updating IDP progress, submitting evidence, submitting mentor feedback).
- Route Handlers for streamable AI chat completions and export endpoints.
- Authentication validation and role verification on every incoming call.

### 2.3 Domain Services Layer (`src/lib/services/`)
- Contains pure business logic, avoiding UI dependencies.
- **`assessment.service.ts`:** Manages assessment lifecycle, validates responses, computes deterministic scores.
- **`career-map.service.ts`:** Computes match scores between student assessment/competencies and occupation catalogs.
- **`idp.service.ts`:** Calculates IDP progress %, manages activity statuses, ensures history preservation.
- **`portfolio.service.ts`:** Manages evidence, verifies owner identity, transitions evidence status from Unreviewed to Validated.
- **`opportunity.service.ts`:** Evaluates candidate eligibility against requirements (Eligible, Potential Match, Not Eligible).
- **`mentoring.service.ts`:** Mentee assignment checks, asynchronous comment threads, mentor tasks with due dates.
- **`analytics.service.ts`:** Aggregates career maturity points and computes institution-wide distributions.
- **`audit.service.ts`:** Emits immutable audit log entries.

### 2.4 AI Integration Layer (`src/lib/ai/`)
- Abstract interface: `generateChatResponse()`, `analyzeSkillGap()`, `draftDevelopmentPlan()`, `reviewPortfolioItem()`, `conductInterview()`.
- Provider switching:
  1. Primary: Google Gemini (`GEMINI_API_KEY`).
  2. Secondary: OpenAI (`OPENAI_API_KEY`).
  3. Offline Simulation Fallback: Rule-based engine ensuring zero crash when external APIs are disconnected.

---

## 3. Inter-Module Data Flow

```
[ ASSESS ] 
   |-> Dimension Scores (e.g. Investigative 85%, Enterprising 70%)
   v
[ MAP ] 
   |-> Matches Occupations (e.g. Data Scientist: 92% match)
   |-> Identifies Missing Competencies (Skill Gap)
   v
[ DEVELOP ] 
   |-> Generates IDP Activities addressing Skill Gap
   |-> Student executes activities & achieves milestones
   v
[ PROVE ] 
   |-> Student uploads Evidence linked to completed Activities
   |-> Mentor reviews and Validates Competencies in Skill Passport
   v
[ MATCH ] 
   |-> Evaluates Opportunities based on Validated Competencies
   |-> Produces transparent eligibility diagnosis
   v
[ ANALYTICS & DASHBOARD ]
   |-> Dynamic computation of Career Maturity (L1 Explore -> L4 Ready)
```

---

## 4. Security & Fault Tolerance Design

1. **Authorization at the Gate:** Role checking occurs on the server prior to data queries. Mentors can only query students explicitly assigned in `mentor_assignments`.
2. **Deterministic Calculations:** Scoring algorithms (Assessment, IDP %, Opportunity Eligibility) run purely on deterministic server code, preventing LLM arithmetic hallucination.
3. **Resilient AI Calling:** Every AI request has strict timeouts, format validation via Zod, and automatic fallback so the core web application remains completely operational even during external provider outages.
