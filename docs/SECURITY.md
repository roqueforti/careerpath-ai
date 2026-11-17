# Security & Data Protection Architecture
## CareerPath AI-Assisted Mentoring

- **Security Model:** Defense in Depth (RBAC, Server-Side Authorization, Input Sanitization, Cryptographic Hashing)
- **Compliance Alignment:** Indonesian PDP Law (UU Pelindungan Data Pribadi) & OWASP Top 10
- **Version:** 1.0.0 (MVP)

---

## 1. Threat Modeling & Attack Surface

| Threat Vector | Potential Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Horizontal Privilege Escalation (IDOR)** | Student A views or modifies Student B's assessment results or IDP. | Server-side ownership verification (`user_id === session.userId`). Mentors restricted strictly to assigned mentees. |
| **Vertical Privilege Escalation** | Student invokes Administrative catalog editing or Evidence validation endpoints. | Strict role-based guard middleware checking token claims on every server mutation. |
| **SQL / Query Injection** | Unauthorized extraction of user data or credential tables. | Parameterized queries via ORM / prepared statements. No raw string interpolation in queries. |
| **Cross-Site Scripting (XSS)** | Malicious code injected into portfolio descriptions or mentor comments. | React automatic output escaping; explicit HTML sanitization on rich inputs; restrictive CSP headers. |
| **Prompt Injection / Jailbreak** | Manipulating AI Mentor into leaking system prompts or giving harmful advice. | Separation of user input into raw data parameter blocks; strict behavioral system prompts; output validation. |
| **Unrestricted File Upload** | Malicious binaries uploaded as portfolio evidence artifacts. | Strict MIME-type allowlist (PDF, PNG, JPG, ZIP), size limit (max 10MB), random UUID filename generation. |

---

## 2. Authentication & Session Security

1. **Password Hashing:** Passwords are never stored in plaintext. They are salted and hashed using `bcrypt` (12 rounds) or `argon2id`.
2. **Session Cookies:**
   - Name: `careerpath_session`
   - Attributes: `HttpOnly: true`, `Secure: true` (in production), `SameSite: Lax`, `Path: /`.
   - Lifespan: 7 days sliding expiration with server-side revocation capability.
3. **Multi-Role Protection:**
   - Role claims (`STUDENT`, `MENTOR`, `INSTITUTION_ADMIN`, `PLATFORM_ADMIN`) are digitally signed within session tokens and re-verified against the database upon privileged actions.

---

## 3. Row-Level Security (RLS) & Authorization Matrix

For Supabase / PostgreSQL deployments, all tables enforce RLS:

```sql
-- Example RLS Policy for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profiles or own profile"
ON profiles FOR SELECT
USING (is_public = true OR auth.uid() = id);

CREATE POLICY "Users can only edit their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Example RLS Policy for Evidence Reviews
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors can review assigned mentee evidence"
ON evidence_files FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM mentor_assignments
    WHERE mentor_assignments.mentor_id = auth.uid()
      AND mentor_assignments.mentee_id = evidence_files.user_id
      AND mentor_assignments.status = 'ACTIVE'
  )
  OR auth.jwt() ->> 'role' = 'PLATFORM_ADMIN'
);
```

---

## 4. Student Privacy & Minor Protection

Underage students (SMP / MTs and SMA) require heightened protective boundaries:
1. **Explicit Consent Ledger:** The `user_consents` table stores timestamps and acceptance of terms and AI context processing.
2. **Portfolio Privacy Toggle:** Portfolios default to private (`is_public = false`) until explicitly opted-in by the student.
3. **No External PII Exposure:** AI prompts strip all physical contact information (home address, personal phone numbers, parent names).
4. **Aggregated Institutional Reporting:** Institutional dashboards enforce k-anonymity principles; cohorts with fewer than 5 students suppress granular metric breakdowns to prevent de-anonymization.

---

## 5. Security Audit Logging

Security-critical actions automatically write to the immutable `audit_logs` table:
- Account role modifications.
- Evidence approvals and rejections.
- Master catalog creation, editing, or archiving.
- Mentor assignment creations and revocations.
- Data export or account deletion requests.
