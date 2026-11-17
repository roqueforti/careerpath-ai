import { getDb } from "../db/client";
import { recalculateCareerMaturity } from "./analytics.service";
import { logAudit } from "./audit.service";

export interface IdpActivity {
  id: string;
  planId: string;
  competencyId?: string | null;
  competencyName?: string | null;
  title: string;
  description: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  targetDate: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  successIndicators: string;
}

export interface DevelopmentPlanDetail {
  id: string;
  userId: string;
  targetCareerId: string;
  targetCareerTitle: string;
  title: string;
  rationale: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
  progressPercentage: number;
  targetEndDate: string;
  createdAt: string;
  activities: IdpActivity[];
}

export async function getUserActiveIdp(userId: string): Promise<DevelopmentPlanDetail | null> {
  const db = getDb();
  const planRes = await db.execute({
    sql: `SELECT p.*, o.title as target_career_title 
          FROM development_plans p 
          JOIN occupations o ON p.target_career_id = o.id 
          WHERE p.user_id = ? AND p.status = 'ACTIVE' 
          ORDER BY p.created_at DESC 
          LIMIT 1;`,
    args: [userId],
  });

  if (planRes.rows.length === 0) return null;
  const planRow = planRes.rows[0];

  const actRes = await db.execute({
    sql: `SELECT a.*, c.name as competency_name 
          FROM development_activities a 
          LEFT JOIN competencies c ON a.competency_id = c.id 
          WHERE a.plan_id = ? 
          ORDER BY 
            CASE a.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, 
            a.target_date ASC;`,
    args: [String(planRow.id)],
  });

  const activities: IdpActivity[] = actRes.rows.map((r) => ({
    id: String(r.id),
    planId: String(r.plan_id),
    competencyId: r.competency_id ? String(r.competency_id) : null,
    competencyName: r.competency_name ? String(r.competency_name) : null,
    title: String(r.title),
    description: String(r.description),
    priority: r.priority as IdpActivity["priority"],
    targetDate: String(r.target_date),
    status: r.status as IdpActivity["status"],
    successIndicators: String(r.success_indicators),
  }));

  return {
    id: String(planRow.id),
    userId: String(planRow.user_id),
    targetCareerId: String(planRow.target_career_id),
    targetCareerTitle: String(planRow.target_career_title),
    title: String(planRow.title),
    rationale: String(planRow.rationale),
    status: planRow.status as DevelopmentPlanDetail["status"],
    progressPercentage: Number(planRow.progress_percentage),
    targetEndDate: String(planRow.target_end_date),
    createdAt: String(planRow.created_at),
    activities,
  };
}

export async function createDevelopmentPlan(
  userId: string,
  data: {
    targetCareerId: string;
    title: string;
    rationale: string;
    targetEndDate: string;
    activities: Array<{
      title: string;
      description: string;
      priority: "HIGH" | "MEDIUM" | "LOW";
      targetDate: string;
      competencyId?: string | null;
      successIndicators: string;
    }>;
  }
): Promise<{ success: boolean; planId?: string }> {
  const db = getDb();
  const planId = `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // Archive any existing active plan
  await db.execute({
    sql: `UPDATE development_plans SET status = 'ARCHIVED', updated_at = datetime('now') WHERE user_id = ? AND status = 'ACTIVE';`,
    args: [userId],
  });

  await db.execute({
    sql: `INSERT INTO development_plans (id, user_id, target_career_id, title, rationale, status, progress_percentage, target_end_date) 
          VALUES (?, ?, ?, ?, ?, 'ACTIVE', 0, ?);`,
    args: [planId, userId, data.targetCareerId, data.title, data.rationale, data.targetEndDate],
  });

  for (const act of data.activities) {
    const actId = `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO development_activities (id, plan_id, competency_id, title, description, priority, target_date, status, success_indicators) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'NOT_STARTED', ?);`,
      args: [actId, planId, act.competencyId || null, act.title, act.description, act.priority, act.targetDate, act.successIndicators],
    });
  }

  await logAudit(userId, "IDP_CREATED", "development_plans", planId, { title: data.title });
  await recalculateCareerMaturity(userId);

  return { success: true, planId };
}

export async function updateActivityStatus(
  userId: string,
  activityId: string,
  newStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  notes?: string
): Promise<{ success: boolean; newProgressPercentage?: number }> {
  const db = getDb();

  // Verify ownership
  const actRes = await db.execute({
    sql: `SELECT a.*, p.user_id, p.id as plan_id 
          FROM development_activities a 
          JOIN development_plans p ON a.plan_id = p.id 
          WHERE a.id = ?;`,
    args: [activityId],
  });

  if (actRes.rows.length === 0) return { success: false };
  const act = actRes.rows[0];

  if (String(act.user_id) !== userId) {
    return { success: false };
  }

  const oldStatus = String(act.status);
  const planId = String(act.plan_id);

  // 1. Update activity status
  await db.execute({
    sql: `UPDATE development_activities SET status = ?, updated_at = datetime('now') WHERE id = ?;`,
    args: [newStatus, activityId],
  });

  // 2. Log progress
  await db.execute({
    sql: `INSERT INTO activity_progress_logs (id, activity_id, status_before, status_after, notes) VALUES (?, ?, ?, ?, ?);`,
    args: [`log-${Date.now()}`, activityId, oldStatus, newStatus, notes || `Status diubah menjadi ${newStatus}`],
  });

  // 3. Recalculate plan percentage
  const allActs = await db.execute({
    sql: `SELECT status FROM development_activities WHERE plan_id = ?;`,
    args: [planId],
  });

  const total = allActs.rows.length;
  const completedCount = allActs.rows.filter((r) => String(r.status) === "COMPLETED").length;
  const newPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  await db.execute({
    sql: `UPDATE development_plans SET progress_percentage = ?, updated_at = datetime('now') WHERE id = ?;`,
    args: [newPercentage, planId],
  });

  // 4. Recalculate career maturity
  await recalculateCareerMaturity(userId);

  return { success: true, newProgressPercentage: newPercentage };
}
