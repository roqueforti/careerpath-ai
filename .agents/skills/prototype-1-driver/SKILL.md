---
name: prototype-1-driver
description: >-
  Enforces a strict Production Prototype 1 (P1) engineering mindset, forbidding demo-toy mockups, hardcoded shortcuts, and superficial stubs. Use this skill when developing, refactoring, testing, or reviewing any feature in CareerPath AI to ensure real PostgreSQL persistence, mathematical algorithmic rigor, resilient error handling, strict type safety, universal multi-tenant generalization, and verifiable scientific benchmarks.
---

# Prototype 1 (P1) Engineering Driver

> **Mission:** Transform the AI agent's role from a "toy demo / mockup builder" into a rigorous **Prototype 1 (P1) Lead Software Engineer**. Every feature developed, modified, or maintained under this skill must satisfy production-grade prototype standards capable of real user trials, thesis defense evaluation, and enterprise stakeholder scrutiny.

---

## 1. Philosophy: The Great Divide (Demo vs. Prototype 1)

| Dimension | ❌ Toy Demo / Mockup Mindset (BANNED) | ✅ Prototype 1 (P1) Standard (MANDATORY) |
| :--- | :--- | :--- |
| **Data Persistence** | Ephemeral `useState`, dummy JSON arrays in memory, simulated `setTimeout` saves. | **Real PostgreSQL Persistence:** Prisma ORM, transactional writes, relational integrity, audit logging. |
| **AI & Matching Engine** | Random numbers, hardcoded fit percentages, hallucinated career tips. | **Deterministic Math & O\*NET Standards:** Holland RIASEC cosine/Euclidean distance, skill coverage set intersections, auditable weighted scoring. |
| **Error Handling** | Blank screens, unhandled exceptions, console-only errors, happy-path assumptions. | **Resilient Architecture:** Zod validation, try/catch with graceful fallback heuristics, user-facing error banners, resilient external API timeouts. |
| **Type Safety** | Pervasive `any`, untyped API payloads, loose type assertions. | **Strict TypeScript Contracts:** Shared DTO interfaces, validated request/response schemas, zero compile warnings. |
| **UI Completeness** | Dead buttons (`href="#"`, empty callbacks), fake tabs, unclickable cards. | **Closed Functional Loops:** Every interactive element triggers real CRUD operations, routes, or functional modals. |
| **Platform Scope** | Coupled to a single company (e.g. hardcoding "PT PAL" or specific sponsors). | **Universal National Architecture:** General enterprise multi-tenancy, standardized KBJI & KBLI 6201 nomenclature. |
| **Scientific Rigor** | Subjective claims without empirical backing. | **Auditable Evaluation:** Confusion Matrix calculation, F1-Score benchmarking against OpenPsychometrics & O\*NET ground truth, Grid Search tuning. |
| **Rule Compliance** | Running prohibited local scripts or healthchecks. | **Absolute Rule Adherence:** Strictly uphold `dont do check local` at all times. |

---

## 2. Seven Non-Negotiable P1 Engineering Mandates

### Mandate 1: Real Database First (Zero Ephemeral Stubs)
- Any action that claims to "Simpan", "Kirim Bukti", "Update Status", or "Buat Rencana" **MUST** persist to PostgreSQL.
- Database queries must leverage the Prisma client (`src/lib/prisma.ts`) or dedicated repository services (`src/lib/services/*`).
- When adding a new entity, always define its Prisma model, apply the migration, and seed corresponding lookup/catalog data.

### Mandate 2: Algorithmic & Mathematical Rigor
- The matching score formula is the core scientific intellectual property of this platform:
  $$S_{\text{fit}} = w_1 \cdot \text{Sim}_{\text{RIASEC}}(u, c) + w_2 \cdot \text{Coverage}_{\text{Skill}}(u, c) + w_3 \cdot \text{Academic}(u, c) + w_4 \cdot \text{Experience}(u, c)$$
- Vector similarity $\text{Sim}_{\text{RIASEC}}$ must be computed against standardized O\*NET v31.0 6-dimensional vectors:
  $$\text{Cosine Similarity} = \frac{\vec{u}_{\text{RIASEC}} \cdot \vec{c}_{\text{RIASEC}}}{\|\vec{u}_{\text{RIASEC}}\| \|\vec{c}_{\text{RIASEC}}\|}$$
- Skill coverage must reflect true set-theoretic intersection between verified student competency claims and occupation requirements.
- Hyperparameter weights ($w_1, w_2, w_3, w_4$) must be mathematically defensible and tuneable via Grid Search.

### Mandate 3: Absolute Universal Platform Neutrality
- **NEVER** hardcode specific external entities, company names (such as "PT PAL"), or vendor-locked terms into UI components, headers, or database schema columns.
- The platform serves the national ecosystem: SMK/Vokasi, Universitas, Mitra Industri Nasional, and BUMN/Swasta secara umum.
- Sector classifications must align with standard taxonomies: **KBJI (Klasifikasi Baku Jabatan Indonesia)** and **KBLI (Klasifikasi Baku Lapangan Usaha Indonesia)**.

### Mandate 4: Typed Contracts & Resilient Services
- Every API endpoint in `src/app/api/` must validate incoming JSON using `zod`.
- External service calls (e.g. Google Gemini API, external job search aggregators) must feature:
  1. Strict timeouts (maximum 8-10 seconds).
  2. Fallback heuristic responses if the third-party API is unreachable or rate-limited.
  3. No cascading failures that crash the frontend.

### Mandate 5: Closed Functional User Flows
Prototype 1 must pass the full end-to-end user journey without hitting dead ends:
1. **Public Guest:** Lands on `/`, explores the interactive Career Tree canvas, reads system architecture on `/architecture`, clicks "Masuk Akun" or "Mulai Asesmen".
2. **Student User:** Completes RIASEC & Skill Assessment (`/input`), receives deterministic O\*NET recommendations (`/output`), activates 3-Phase IDP (`/development-plans`), uploads portfolio proof to Digital Skill Passport (`/portfolio`), explores live matched opportunities (`/opportunities`).
3. **Mentor User:** Inspects assigned student submissions (`/mentoring`), reviews evidence, issues endorsements or feedback comments.
4. **Admin User:** Monitors system audits, edits master competency catalogs, manages platform configurations (`/admin`).

### Mandate 6: Scientific Evaluation & Thesis Defense Readiness
- The platform includes a dedicated evaluation runner (`scripts/evaluate-model.ts`).
- Ground-truth validation must benchmark model predictions against established open-source datasets (OpenPsychometrics RIASEC raw benchmark & O\*NET 31.0 database).
- Automated reporting outputs:
  - Confusion Matrix (TP, FP, FN, TN per occupation cluster).
  - Accuracy, Precision, Recall, and Macro/Micro F1-Score.
  - Hyperparameter grid optimization logs.

### Mandate 7: Strict Environmental Boundaries
- **STRICT PROHIBITION:** Never run healthcheck, check-local, or diagnostic probing commands violating the `dont do check local` rule.
- Code verification must rely exclusively on sanctioned build pipelines (`npx tsc --noEmit` and `npm run build`).

---

## 3. P1 Quality Gate Checklist (Run Before Completing Any Task)

Before declaring any feature complete, verify every item:
- [ ] **Data Persistence:** Does this feature write to and read from the real PostgreSQL database?
- [ ] **Type Check:** Does `npx tsc --noEmit` pass with 0 errors?
- [ ] **Build Check:** Does `npm run build` compile all routes successfully?
- [ ] **Neutrality:** Is the code 100% free of hardcoded single-company references?
- [ ] **Error Handling:** Are loading spinners, empty states, and error alerts present?
- [ ] **Dual-Language:** Does the UI support both Indonesian (`id`) and English (`en`) seamlessly?
- [ ] **Rule Compliance:** Did you strictly refrain from running any check-local commands?

