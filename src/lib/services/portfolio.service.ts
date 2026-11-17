import { getDb } from "../db/client";
import { recalculateCareerMaturity } from "./analytics.service";
import { logAudit } from "./audit.service";

export interface PortfolioItemDetail {
  id: string;
  portfolioId: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  role?: string | null;
  projectUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  toolsUsed: string[];
  isPublic: boolean;
  createdAt: string;
  evidence: Array<{
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    validationStatus: string;
    reviewedBy?: string | null;
    reviewFeedback?: string | null;
  }>;
}

export interface SkillPassportSummary {
  claimedCompetencies: Array<{ id: string; name: string; code: string; category: string }>;
  evidenceBackedCompetencies: Array<{ id: string; name: string; code: string; category: string; evidenceTitle: string }>;
  mentorValidatedCompetencies: Array<{ id: string; name: string; code: string; category: string; validatedAt: string; mentorName?: string }>;
}

export async function getUserPortfolio(userId: string): Promise<{
  portfolioId: string;
  title: string;
  summary: string;
  isPublic: boolean;
  items: PortfolioItemDetail[];
}> {
  const db = getDb();

  // Ensure portfolio exists
  let portRes = await db.execute({
    sql: `SELECT * FROM portfolios WHERE user_id = ?;`,
    args: [userId],
  });

  if (portRes.rows.length === 0) {
    const portId = `port-${userId}`;
    await db.execute({
      sql: `INSERT INTO portfolios (id, user_id, title, summary, is_public) VALUES (?, ?, 'Portofolio Karier Saya', 'Kumpulan proyek, pencapaian, dan karya bukti kompetensi.', 1);`,
      args: [portId, userId],
    });
    portRes = await db.execute({
      sql: `SELECT * FROM portfolios WHERE user_id = ?;`,
      args: [userId],
    });
  }

  const port = portRes.rows[0];
  const portId = String(port.id);

  const itemsRes = await db.execute({
    sql: `SELECT * FROM portfolio_items WHERE portfolio_id = ? ORDER BY created_at DESC;`,
    args: [portId],
  });

  const items: PortfolioItemDetail[] = [];
  for (const item of itemsRes.rows) {
    const itemId = String(item.id);
    const evidRes = await db.execute({
      sql: `SELECT * FROM evidence_files WHERE portfolio_item_id = ?;`,
      args: [itemId],
    });

    items.push({
      id: itemId,
      portfolioId: portId,
      userId,
      title: String(item.title),
      description: String(item.description),
      category: String(item.category),
      role: item.role ? String(item.role) : null,
      projectUrl: item.project_url ? String(item.project_url) : null,
      startDate: item.start_date ? String(item.start_date) : null,
      endDate: item.end_date ? String(item.end_date) : null,
      toolsUsed: item.tools_used ? String(item.tools_used).split(",").map((s) => s.trim()).filter(Boolean) : [],
      isPublic: Boolean(item.is_public),
      createdAt: String(item.created_at),
      evidence: evidRes.rows.map((e) => ({
        id: String(e.id),
        title: String(e.title),
        fileUrl: String(e.file_url),
        fileType: String(e.file_type),
        fileSize: Number(e.file_size),
        validationStatus: String(e.validation_status),
        reviewedBy: e.reviewed_by ? String(e.reviewed_by) : null,
        reviewFeedback: e.review_feedback ? String(e.review_feedback) : null,
      })),
    });
  }

  return {
    portfolioId: portId,
    title: String(port.title),
    summary: String(port.summary || ""),
    isPublic: Boolean(port.is_public),
    items,
  };
}

export async function createPortfolioItem(
  userId: string,
  data: {
    title: string;
    description: string;
    category: string;
    role?: string;
    projectUrl?: string;
    toolsUsed?: string;
    isPublic?: boolean;
    competencyId?: string;
    evidenceTitle?: string;
    evidenceUrl?: string;
  }
): Promise<{ success: boolean; itemId?: string }> {
  const db = getDb();
  const port = await getUserPortfolio(userId);

  const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  await db.execute({
    sql: `INSERT INTO portfolio_items (id, portfolio_id, user_id, title, description, category, role, project_url, tools_used, is_public) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      itemId,
      port.portfolioId,
      userId,
      data.title,
      data.description,
      data.category,
      data.role || null,
      data.projectUrl || null,
      data.toolsUsed || "",
      data.isPublic !== false ? 1 : 0,
    ],
  });

  if (data.evidenceTitle && data.evidenceUrl) {
    const evidId = `evid-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO evidence_files (id, user_id, portfolio_item_id, title, file_url, file_type, file_size, validation_status) 
            VALUES (?, ?, ?, ?, ?, 'link/external', 1024, 'UNREVIEWED');`,
      args: [evidId, userId, itemId, data.evidenceTitle, data.evidenceUrl],
    });

    if (data.competencyId) {
      await db.execute({
        sql: `INSERT OR REPLACE INTO competency_evidence (id, user_id, competency_id, evidence_file_id, tier) 
              VALUES (?, ?, ?, ?, 'EVIDENCE_BACKED');`,
        args: [`ce-${userId}-${data.competencyId}`, userId, data.competencyId, evidId],
      });
    }
  }

  await recalculateCareerMaturity(userId);
  return { success: true, itemId };
}

export async function reviewEvidence(
  mentorId: string,
  evidenceId: string,
  status: "VALIDATED" | "REJECTED",
  feedback: string
): Promise<{ success: boolean }> {
  const db = getDb();

  // Find evidence and check mentee pairing
  const evidRes = await db.execute({
    sql: `SELECT e.*, u.full_name as student_name 
          FROM evidence_files e 
          JOIN users u ON e.user_id = u.id 
          WHERE e.id = ?;`,
    args: [evidenceId],
  });

  if (evidRes.rows.length === 0) return { success: false };
  const evid = evidRes.rows[0];
  const studentId = String(evid.user_id);

  // Update evidence file record
  await db.execute({
    sql: `UPDATE evidence_files 
          SET validation_status = ?, reviewed_by = ?, reviewed_at = datetime('now'), review_feedback = ? 
          WHERE id = ?;`,
    args: [status, mentorId, feedback, evidenceId],
  });

  // If validated, update competency tier to MENTOR_VALIDATED
  if (status === "VALIDATED") {
    await db.execute({
      sql: `UPDATE competency_evidence 
            SET tier = 'MENTOR_VALIDATED', validated_at = datetime('now') 
            WHERE evidence_file_id = ?;`,
      args: [evidenceId],
    });
  }

  // Notify student
  const notifId = `notif-${Date.now()}`;
  await db.execute({
    sql: `INSERT INTO notifications (id, user_id, type, title, message, link_url) 
          VALUES (?, ?, 'EVIDENCE_VALIDATED', ?, ?, '/portfolio');`,
    args: [
      notifId,
      studentId,
      status === "VALIDATED" ? "Bukti Portofolio Tervalidasi" : "Revisi Diperlukan pada Bukti Portofolio",
      `Mentor telah ${status === "VALIDATED" ? "menyetujui" : "memberikan catatan pada"} bukti '${evid.title}': ${feedback}`,
    ],
  });

  await logAudit(mentorId, "EVIDENCE_REVIEWED", "evidence_files", evidenceId, { status, studentId });
  await recalculateCareerMaturity(studentId);

  return { success: true };
}

export async function getSkillPassport(userId: string): Promise<SkillPassportSummary> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT ce.*, c.name as competency_name, c.code as competency_code, c.category, 
                 ef.title as evidence_title, m.full_name as mentor_name 
          FROM competency_evidence ce 
          JOIN competencies c ON ce.competency_id = c.id 
          LEFT JOIN evidence_files ef ON ce.evidence_file_id = ef.id 
          LEFT JOIN users m ON ef.reviewed_by = m.id 
          WHERE ce.user_id = ? 
          ORDER BY c.name ASC;`,
    args: [userId],
  });

  const claimed: SkillPassportSummary["claimedCompetencies"] = [];
  const evidenceBacked: SkillPassportSummary["evidenceBackedCompetencies"] = [];
  const mentorValidated: SkillPassportSummary["mentorValidatedCompetencies"] = [];

  for (const row of res.rows) {
    const comp = {
      id: String(row.competency_id),
      name: String(row.competency_name),
      code: String(row.competency_code),
      category: String(row.category),
    };

    if (row.tier === "MENTOR_VALIDATED") {
      mentorValidated.push({
        ...comp,
        validatedAt: String(row.validated_at || "Tervalidasi"),
        mentorName: row.mentor_name ? String(row.mentor_name) : undefined,
      });
    } else if (row.tier === "EVIDENCE_BACKED") {
      evidenceBacked.push({
        ...comp,
        evidenceTitle: String(row.evidence_title || "Tautan Proyek"),
      });
    } else {
      claimed.push(comp);
    }
  }

  return {
    claimedCompetencies: claimed,
    evidenceBackedCompetencies: evidenceBacked,
    mentorValidatedCompetencies: mentorValidated,
  };
}
