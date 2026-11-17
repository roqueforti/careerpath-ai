import { getDb } from "../db/client";
import { logAudit } from "./audit.service";

export interface MenteeSummary {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  educationLevel: string;
  careerMaturity: string;
  careerMaturityScore: number;
  targetCareerTitle?: string | null;
  activeIdpTitle?: string | null;
  idpProgressPercentage?: number;
  pendingEvidenceCount: number;
}

export interface MentoringTaskItem {
  id: string;
  mentorId: string;
  mentorName?: string;
  menteeId: string;
  menteeName?: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "COMPLETED" | "REJECTED";
  completedAt?: string | null;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  mentorId: string;
  menteeId: string;
  targetType: string;
  title: string;
  createdAt: string;
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    message: string;
    createdAt: string;
  }>;
}

export async function getAssignedMentees(mentorId: string): Promise<MenteeSummary[]> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT u.id, u.full_name, u.email, u.avatar_url, p.education_level, p.career_maturity, 
                 p.career_maturity_score, o.title as target_career_title,
                 dp.title as active_idp_title, dp.progress_percentage as idp_progress,
                 COUNT(ef.id) as pending_evidence_count
          FROM mentor_assignments ma
          JOIN users u ON ma.mentee_id = u.id
          JOIN profiles p ON u.id = p.id
          LEFT JOIN occupations o ON p.target_career_id = o.id
          LEFT JOIN development_plans dp ON u.id = dp.user_id AND dp.status = 'ACTIVE'
          LEFT JOIN evidence_files ef ON u.id = ef.user_id AND ef.validation_status = 'UNREVIEWED'
          WHERE ma.mentor_id = ? AND ma.status = 'ACTIVE'
          GROUP BY u.id, u.full_name, u.email, u.avatar_url, p.education_level, p.career_maturity, p.career_maturity_score, o.title, dp.title, dp.progress_percentage
          ORDER BY u.full_name ASC;`,
    args: [mentorId],
  });

  return res.rows.map((r) => ({
    id: String(r.id),
    name: String(r.full_name),
    email: String(r.email),
    avatarUrl: r.avatar_url ? String(r.avatar_url) : null,
    educationLevel: String(r.education_level),
    careerMaturity: String(r.career_maturity),
    careerMaturityScore: Number(r.career_maturity_score || 0),
    targetCareerTitle: r.target_career_title ? String(r.target_career_title) : null,
    activeIdpTitle: r.active_idp_title ? String(r.active_idp_title) : null,
    idpProgressPercentage: r.idp_progress !== null ? Number(r.idp_progress) : undefined,
    pendingEvidenceCount: Number(r.pending_evidence_count || 0),
  }));
}

export async function getPendingEvidenceReviews(mentorId: string): Promise<Array<Record<string, unknown>>> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT ef.*, u.full_name as mentee_name, u.email as mentee_email, pi.title as project_title 
          FROM evidence_files ef 
          JOIN users u ON ef.user_id = u.id 
          JOIN mentor_assignments ma ON u.id = ma.mentee_id 
          LEFT JOIN portfolio_items pi ON ef.portfolio_item_id = pi.id 
          WHERE ma.mentor_id = ? AND ma.status = 'ACTIVE' AND ef.validation_status = 'UNREVIEWED' 
          ORDER BY ef.created_at ASC;`,
    args: [mentorId],
  });

  return res.rows as unknown as Array<Record<string, unknown>>;
}

export async function createMentoringTask(
  mentorId: string,
  data: { menteeId: string; title: string; description: string; dueDate: string }
): Promise<{ success: boolean; taskId?: string }> {
  const db = getDb();
  const taskId = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.execute({
    sql: `INSERT INTO mentoring_tasks (id, mentor_id, mentee_id, title, description, due_date, status) 
          VALUES (?, ?, ?, ?, ?, ?, 'PENDING');`,
    args: [taskId, mentorId, data.menteeId, data.title, data.description, data.dueDate],
  });

  // Notify student
  await db.execute({
    sql: `INSERT INTO notifications (id, user_id, type, title, message, link_url) 
          VALUES (?, ?, 'TASK_ASSIGNED', 'Tugas Mentoring Baru', ?, '/mentoring');`,
    args: [`notif-${Date.now()}`, data.menteeId, `Mentor menugaskan: '${data.title}'. Tenggat: ${data.dueDate}`],
  });

  await logAudit(mentorId, "TASK_ASSIGNED", "mentoring_tasks", taskId, { menteeId: data.menteeId });
  return { success: true, taskId };
}

export async function updateMentoringTaskStatus(
  userId: string,
  taskId: string,
  newStatus: "SUBMITTED" | "COMPLETED" | "REJECTED"
): Promise<{ success: boolean }> {
  const db = getDb();
  const taskRes = await db.execute({
    sql: `SELECT * FROM mentoring_tasks WHERE id = ?;`,
    args: [taskId],
  });
  if (taskRes.rows.length === 0) return { success: false };
  const task = taskRes.rows[0];

  // Mentee can submit; Mentor can complete or reject
  if (String(task.mentee_id) !== userId && String(task.mentor_id) !== userId) {
    return { success: false };
  }

  await db.execute({
    sql: `UPDATE mentoring_tasks 
          SET status = ?, completed_at = CASE WHEN ? = 'COMPLETED' THEN datetime('now') ELSE completed_at END 
          WHERE id = ?;`,
    args: [newStatus, newStatus, taskId],
  });

  return { success: true };
}

export async function getUserTasks(userId: string): Promise<MentoringTaskItem[]> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT t.*, m.full_name as mentor_name, s.full_name as mentee_name 
          FROM mentoring_tasks t 
          JOIN users m ON t.mentor_id = m.id 
          JOIN users s ON t.mentee_id = s.id 
          WHERE t.mentee_id = ? OR t.mentor_id = ? 
          ORDER BY 
            CASE t.status WHEN 'PENDING' THEN 1 WHEN 'SUBMITTED' THEN 2 ELSE 3 END, 
            t.due_date ASC;`,
    args: [userId, userId],
  });

  return res.rows.map((r) => ({
    id: String(r.id),
    mentorId: String(r.mentor_id),
    mentorName: String(r.mentor_name),
    menteeId: String(r.mentee_id),
    menteeName: String(r.mentee_name),
    title: String(r.title),
    description: String(r.description),
    dueDate: String(r.due_date),
    status: r.status as MentoringTaskItem["status"],
    completedAt: r.completed_at ? String(r.completed_at) : null,
    createdAt: String(r.created_at),
  }));
}

export async function getDiscussions(userId: string): Promise<DiscussionThread[]> {
  const db = getDb();
  const discRes = await db.execute({
    sql: `SELECT d.* FROM mentoring_discussions d 
          WHERE d.mentee_id = ? OR d.mentor_id = ? 
          ORDER BY d.created_at DESC;`,
    args: [userId, userId],
  });

  const threads: DiscussionThread[] = [];
  for (const d of discRes.rows) {
    const dId = String(d.id);
    const commRes = await db.execute({
      sql: `SELECT c.*, u.full_name, u.role 
            FROM mentoring_comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.discussion_id = ? 
            ORDER BY c.created_at ASC;`,
      args: [dId],
    });

    threads.push({
      id: dId,
      mentorId: String(d.mentor_id),
      menteeId: String(d.mentee_id),
      targetType: String(d.target_type),
      title: String(d.title),
      createdAt: String(d.created_at),
      comments: commRes.rows.map((c) => ({
        id: String(c.id),
        userId: String(c.user_id),
        userName: String(c.full_name),
        userRole: String(c.role),
        message: String(c.message),
        createdAt: String(c.created_at),
      })),
    });
  }

  return threads;
}

export async function addDiscussionComment(
  userId: string,
  discussionId: string,
  message: string
): Promise<{ success: boolean; commentId?: string }> {
  const db = getDb();
  const cId = `comm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.execute({
    sql: `INSERT INTO mentoring_comments (id, discussion_id, user_id, message) VALUES (?, ?, ?, ?);`,
    args: [cId, discussionId, userId, message.trim()],
  });

  return { success: true, commentId: cId };
}
