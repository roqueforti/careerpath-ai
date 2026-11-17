import { getDb } from "../db/client";

export interface StudentDashboardData {
  studentName: string;
  educationLevel: string;
  careerMaturity: "EXPLORE" | "PLAN" | "DEVELOP" | "READY";
  careerMaturityScore: number;
  assessmentCompleted: boolean;
  hollandSummary?: string | null;
  targetCareerTitle?: string | null;
  targetCareerCategory?: string | null;
  activeIdp?: {
    id: string;
    title: string;
    progressPercentage: number;
    activityCount: number;
    completedCount: number;
  } | null;
  pendingTasksCount: number;
  skillPassportCounts: {
    claimed: number;
    evidenceBacked: number;
    mentorValidated: number;
  };
  recentNotifications: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
  }>;
}

export interface InstitutionAnalyticsData {
  totalStudents: number;
  totalMentors: number;
  maturityDistribution: {
    EXPLORE: number;
    PLAN: number;
    DEVELOP: number;
    READY: number;
  };
  averageIdpCompletion: number;
  topCareerTargets: Array<{ title: string; count: number }>;
  commonSkillGaps: Array<{ name: string; count: number }>;
}

export async function recalculateCareerMaturity(userId: string): Promise<{
  careerMaturity: "EXPLORE" | "PLAN" | "DEVELOP" | "READY";
  careerMaturityScore: number;
}> {
  const db = getDb();

  // 1. Assessment check
  const attRes = await db.execute({
    sql: `SELECT COUNT(*) as count FROM assessment_results WHERE user_id = ?;`,
    args: [userId],
  });
  const hasAssessment = Number(attRes.rows[0]?.count ?? 0) > 0 ? 1 : 0;

  // 2. Target career check
  const profRes = await db.execute({
    sql: `SELECT target_career_id FROM profiles WHERE id = ?;`,
    args: [userId],
  });
  const hasTargetCareer = profRes.rows[0]?.target_career_id ? 1 : 0;

  // 3. IDP progress check
  const idpRes = await db.execute({
    sql: `SELECT progress_percentage FROM development_plans WHERE user_id = ? AND status = 'ACTIVE';`,
    args: [userId],
  });
  const idpProgress = idpRes.rows[0]?.progress_percentage ? Number(idpRes.rows[0].progress_percentage) : 0;

  // 4. Evidence check
  const evidRes = await db.execute({
    sql: `SELECT validation_status FROM evidence_files WHERE user_id = ?;`,
    args: [userId],
  });
  const totalEvidence = evidRes.rows.length;
  const validatedEvidence = evidRes.rows.filter((r) => String(r.validation_status) === "VALIDATED").length;

  let evidencePoints = 0;
  if (validatedEvidence >= 2) {
    evidencePoints = 30;
  } else if (validatedEvidence === 1) {
    evidencePoints = 20;
  } else if (totalEvidence > 0) {
    evidencePoints = 10;
  }

  // Formula: (Assessment * 20) + (Target * 20) + (IDP Progress * 0.3) + EvidencePoints
  const rawScore = hasAssessment * 20 + hasTargetCareer * 20 + Math.round(idpProgress * 0.3) + evidencePoints;
  const score = Math.min(100, Math.max(0, rawScore));

  let stage: "EXPLORE" | "PLAN" | "DEVELOP" | "READY" = "EXPLORE";
  if (score >= 85) {
    stage = "READY";
  } else if (score >= 60) {
    stage = "DEVELOP";
  } else if (score >= 30) {
    stage = "PLAN";
  } else {
    stage = "EXPLORE";
  }

  await db.execute({
    sql: `UPDATE profiles SET career_maturity = ?, career_maturity_score = ?, updated_at = datetime('now') WHERE id = ?;`,
    args: [stage, score, userId],
  });

  return { careerMaturity: stage, careerMaturityScore: score };
}

export async function getStudentDashboard(userId: string): Promise<StudentDashboardData> {
  const db = getDb();

  // Profile & user
  const uRes = await db.execute({
    sql: `SELECT u.full_name, p.*, o.title as target_title, o.category as target_category 
          FROM users u 
          JOIN profiles p ON u.id = p.id 
          LEFT JOIN occupations o ON p.target_career_id = o.id 
          WHERE u.id = ?;`,
    args: [userId],
  });
  const user = uRes.rows[0];

  // Assessment summary
  const aRes = await db.execute({
    sql: `SELECT summary FROM assessment_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
    args: [userId],
  });

  // Active IDP
  const idpRes = await db.execute({
    sql: `SELECT dp.*, COUNT(da.id) as act_count, 
                 SUM(CASE WHEN da.status = 'COMPLETED' THEN 1 ELSE 0 END) as comp_count 
          FROM development_plans dp 
          LEFT JOIN development_activities da ON dp.id = da.plan_id 
          WHERE dp.user_id = ? AND dp.status = 'ACTIVE' 
          GROUP BY dp.id;`,
    args: [userId],
  });

  // Pending tasks
  const tRes = await db.execute({
    sql: `SELECT COUNT(*) as count FROM mentoring_tasks WHERE mentee_id = ? AND status = 'PENDING';`,
    args: [userId],
  });

  // Skill passport counts
  const spRes = await db.execute({
    sql: `SELECT tier, COUNT(*) as count FROM competency_evidence WHERE user_id = ? GROUP BY tier;`,
    args: [userId],
  });
  const spCounts = { claimed: 0, evidenceBacked: 0, mentorValidated: 0 };
  for (const row of spRes.rows) {
    if (row.tier === "MENTOR_VALIDATED") spCounts.mentorValidated = Number(row.count);
    else if (row.tier === "EVIDENCE_BACKED") spCounts.evidenceBacked = Number(row.count);
    else spCounts.claimed = Number(row.count);
  }

  // Recent notifications
  const nRes = await db.execute({
    sql: `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 5;`,
    args: [userId],
  });

  const activeIdp =
    idpRes.rows.length > 0
      ? {
          id: String(idpRes.rows[0].id),
          title: String(idpRes.rows[0].title),
          progressPercentage: Number(idpRes.rows[0].progress_percentage),
          activityCount: Number(idpRes.rows[0].act_count || 0),
          completedCount: Number(idpRes.rows[0].comp_count || 0),
        }
      : null;

  return {
    studentName: user ? String(user.full_name) : "Pengguna",
    educationLevel: user ? String(user.education_level) : "UMUM",
    careerMaturity: (user?.career_maturity as StudentDashboardData["careerMaturity"]) || "EXPLORE",
    careerMaturityScore: user ? Number(user.career_maturity_score || 0) : 0,
    assessmentCompleted: aRes.rows.length > 0,
    hollandSummary: aRes.rows[0]?.summary ? String(aRes.rows[0].summary) : null,
    targetCareerTitle: user?.target_title ? String(user.target_title) : null,
    targetCareerCategory: user?.target_category ? String(user.target_category) : null,
    activeIdp,
    pendingTasksCount: Number(tRes.rows[0]?.count ?? 0),
    skillPassportCounts: spCounts,
    recentNotifications: nRes.rows.map((n) => ({
      id: String(n.id),
      type: String(n.type),
      title: String(n.title),
      message: String(n.message),
      createdAt: String(n.created_at),
    })),
  };
}

export async function getInstitutionAnalytics(institutionId?: string): Promise<InstitutionAnalyticsData> {
  const db = getDb();

  // Total students & mentors
  const sRes = await db.execute({
    sql: `SELECT COUNT(*) as count FROM institution_memberships WHERE member_role = 'STUDENT' ${
      institutionId ? "AND institution_id = ?" : ""
    };`,
    args: institutionId ? [institutionId] : [],
  });
  const mRes = await db.execute({
    sql: `SELECT COUNT(*) as count FROM institution_memberships WHERE member_role = 'MENTOR' ${
      institutionId ? "AND institution_id = ?" : ""
    };`,
    args: institutionId ? [institutionId] : [],
  });

  // Maturity distribution
  const matRes = await db.execute({
    sql: `SELECT p.career_maturity, COUNT(*) as count 
          FROM profiles p 
          JOIN institution_memberships im ON p.id = im.user_id 
          WHERE im.member_role = 'STUDENT' ${institutionId ? "AND im.institution_id = ?" : ""}
          GROUP BY p.career_maturity;`,
    args: institutionId ? [institutionId] : [],
  });

  const dist = { EXPLORE: 0, PLAN: 0, DEVELOP: 0, READY: 0 };
  for (const r of matRes.rows) {
    const k = String(r.career_maturity) as keyof typeof dist;
    if (dist[k] !== undefined) {
      dist[k] = Number(r.count);
    }
  }

  // Average IDP completion
  const idpRes = await db.execute({
    sql: `SELECT AVG(dp.progress_percentage) as avg_prog 
          FROM development_plans dp 
          JOIN institution_memberships im ON dp.user_id = im.user_id 
          WHERE im.member_role = 'STUDENT' AND dp.status = 'ACTIVE' ${institutionId ? "AND im.institution_id = ?" : ""};`,
    args: institutionId ? [institutionId] : [],
  });
  const avgIdp = Math.round(Number(idpRes.rows[0]?.avg_prog || 0));

  // Top career targets
  const topOccRes = await db.execute({
    sql: `SELECT o.title, COUNT(*) as count 
          FROM profiles p 
          JOIN occupations o ON p.target_career_id = o.id 
          JOIN institution_memberships im ON p.id = im.user_id 
          WHERE im.member_role = 'STUDENT' ${institutionId ? "AND im.institution_id = ?" : ""}
          GROUP BY o.id 
          ORDER BY count DESC 
          LIMIT 5;`,
    args: institutionId ? [institutionId] : [],
  });

  // Common skill gaps
  const gapRes = await db.execute(`
    SELECT c.name, COUNT(*) as count 
    FROM occupation_competencies oc 
    JOIN competencies c ON oc.competency_id = c.id 
    GROUP BY c.id 
    ORDER BY count DESC 
    LIMIT 5;
  `);

  return {
    totalStudents: Number(sRes.rows[0]?.count ?? 0),
    totalMentors: Number(mRes.rows[0]?.count ?? 0),
    maturityDistribution: dist,
    averageIdpCompletion: avgIdp,
    topCareerTargets: topOccRes.rows.map((r) => ({ title: String(r.title), count: Number(r.count) })),
    commonSkillGaps: gapRes.rows.map((r) => ({ name: String(r.name), count: Number(r.count) })),
  };
}
