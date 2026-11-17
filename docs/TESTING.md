# Comprehensive Test Plan & Acceptance Matrix
## CareerPath AI-Assisted Mentoring

- **QA Framework:** Unit, Integration, End-to-End & Security Acceptance Testing
- **Version:** 1.0.0 (MVP)

---

## 1. Test Levels & Strategy

1. **Unit Testing:**
   - Assessment scoring algorithms (Likert scale aggregation, Holland RIASEC code synthesis).
   - Career recommendation weighting (Interest 40%, Competency 30%, Education 20%, Preference 10%).
   - IDP progress calculation `(CompletedActivities / TotalActivities) * 100`.
   - Opportunity matching rule engine (`ELIGIBLE`, `POTENTIAL_MATCH`, `NOT_ELIGIBLE`).
   - Career maturity scoring and stage transitions (L1 Explore -> L2 Plan -> L3 Develop -> L4 Ready).
2. **Integration Testing:**
   - Full flow: Registration -> Assessment -> Results -> Career Recommendation -> Target Selection.
   - Full flow: Target Selection -> Skill Gap Analysis -> IDP Creation -> Activity Execution -> Evidence Upload.
   - Mentoring flow: Evidence Submission -> Mentor Review -> Skill Passport Validation -> Opportunity Eligibility Update.
   - AI flow: Contextual prompt construction -> Provider response parsing -> Graceful simulation fallback on API error.
3. **Security Testing:**
   - Verification that Student A cannot access Student B's assessments or IDP.
   - Mentor A cannot review mentees not assigned in `mentor_assignments`.
   - Platform admin endpoints return 403 Forbidden for Student/Mentor tokens.
   - XSS sanitization in portfolio items and discussion comments.
4. **Mobile & Viewport Usability:**
   - Responsive verification at 360px (mobile portrait), 768px (tablet), 1280px+ (desktop).
   - Zero horizontal overflow on cards, tables, and assessment forms.

---

## 2. Test Case Specifications & Acceptance Matrix

| Test ID | Module | Scenario | Inputs / Steps | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AS-01** | ASSESS | Complete Holland RIASEC Assessment | Answers across 18 items with varying Likert scores (1-5). | Scores correctly aggregated into 6 dimensions; primary/secondary traits extracted; attempt and result persisted. |
| **TC-AS-02** | ASSESS | Incomplete Assessment Submission | Submits payload with 2 missing question IDs. | Returns HTTP 400 with specific question validation error; no corrupt attempt created. |
| **TC-MP-01** | MAP | Career Recommendation Generation | Student with Holland Code "IRC" (Investigative, Realistic, Conventional). | Software Engineer and Data Analyst score >=85%; explanation shows high interest & technical fit. |
| **TC-MP-02** | MAP | Set Target Career | Student selects "Data Analyst" as target. | Target career updated in profile; unlocks IDP draft generation and skill gap report. |
| **TC-DV-01** | DEVELOP | Create IDP with Activities | Creates plan with 4 activities (2 High priority, 2 Medium). | IDP created with status `ACTIVE`, progress initial = 0%. |
| **TC-DV-02** | DEVELOP | Update Activity Progress | Marks 2 of 4 activities as `COMPLETED`. | Plan progress percentage dynamically recalculates to 50%; activity log records change. |
| **TC-PV-01** | PROVE | Upload Evidence & Skill Passport | Attaches project URL and links to "SQL Querying" skill. | Evidence stored with status `UNREVIEWED`; competence marked as `EVIDENCE_BACKED`. |
| **TC-PV-02** | PROVE | Mentor Evidence Validation | Assigned mentor reviews evidence and marks `VALIDATED`. | Evidence status becomes `VALIDATED`; competence moves to `MENTOR_VALIDATED` tier; maturity points awarded. |
| **TC-MT-01** | MATCH | Opportunity Eligibility Diagnosis | Evaluates listing requiring 2 mentor-validated skills against student with 1 validated skill. | Status is `POTENTIAL_MATCH` with explicit note on the missing validated competency; NOT marked as `ELIGIBLE`. |
| **TC-AI-01** | AI | AI Mentor Contextual Chat | Student asks for advice on preparing for target career. | Response incorporates student's education level, target career, and RIASEC profile; maintains ethical boundaries. |
| **TC-AI-02** | AI | AI Provider Offline Fallback | Simulated API outage or absent API key. | Server automatically executes Rule Simulator Fallback; returns structured guidance; user workflow uninterrupted. |
| **TC-HM-01** | MENTOR | Mentor-Mentee Boundary Check | Mentor attempts to access unassigned student's IDP. | Returns HTTP 403 Forbidden; audit log records unauthorized attempt. |
| **TC-AN-01** | ANALYTICS | Dynamic Career Maturity Calculation | Evaluates student having completed assessment + chosen career + 50% IDP + 2 validated proofs. | Calculated maturity level advances to `L3: DEVELOP` or `L4: READY` based on criteria. |
| **TC-UI-01** | UI/UX | Mobile Viewport Layout | Render on 360px mobile screen. | Navigation collapses to mobile drawer; cards and forms stack vertically without horizontal scrollbar. |

---

## 3. Defect Severity & Exit Criteria

- **Blocker (P0):** Any broken core flow (cannot log in, cannot submit assessment, cannot view IDP, crash on missing AI key). **Zero allowable P0 defects at MVP release.**
- **Critical (P1):** Data inconsistency in scoring or permissions leak. **Zero allowable P1 defects.**
- **Minor (P2):** Minor stylistic imperfections or advanced filters. Documented in release notes.
