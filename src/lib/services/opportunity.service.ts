import { getDb } from "../db/client";

export interface OpportunityItem {
  id: string;
  title: string;
  type: "INTERNSHIP" | "SCHOLARSHIP" | "TRAINING" | "JOB";
  organization: string;
  location: string;
  workType: "REMOTE" | "HYBRID" | "ON_SITE";
  educationLevel: string;
  description: string;
  requirements: string[];
  deadline?: string | null;
  url: string;
  isActive: boolean;
  isSaved?: boolean;
}

export interface EligibilityDiagnosis {
  status: "ELIGIBLE" | "POTENTIAL_MATCH" | "NOT_ELIGIBLE";
  matchPercentage: number;
  fulfilledRequirements: string[];
  unfulfilledRequirements: string[];
  actionableRecommendations: string;
}

export async function getOpportunities(
  userId?: string,
  filters?: {
    type?: string;
    educationLevel?: string;
    search?: string;
  }
): Promise<OpportunityItem[]> {
  const db = getDb();
  let sql = `SELECT o.* FROM opportunities o WHERE o.is_active = 1`;
  const args: (string | number)[] = [];

  if (filters?.type && filters.type !== "ALL") {
    sql += ` AND o.type = ?`;
    args.push(filters.type);
  }

  if (filters?.educationLevel && filters.educationLevel !== "SEMUA") {
    sql += ` AND (o.education_level = ? OR o.education_level = 'SEMUA')`;
    args.push(filters.educationLevel);
  }

  if (filters?.search) {
    sql += ` AND (o.title LIKE ? OR o.organization LIKE ? OR o.description LIKE ?)`;
    const pattern = `%${filters.search}%`;
    args.push(pattern, pattern, pattern);
  }

  sql += ` ORDER BY o.deadline ASC;`;
  const res = await db.execute({ sql, args });

  // Saved opportunities set
  let savedSet = new Set<string>();
  if (userId) {
    const sRes = await db.execute({
      sql: `SELECT opportunity_id FROM saved_opportunities WHERE user_id = ?;`,
      args: [userId],
    });
    savedSet = new Set(sRes.rows.map((r) => String(r.opportunity_id)));
  }

  return res.rows.map((r) => {
    let reqs: string[] = [];
    try {
      reqs = JSON.parse(String(r.requirements_json));
    } catch {
      reqs = [];
    }

    return {
      id: String(r.id),
      title: String(r.title),
      type: r.type as OpportunityItem["type"],
      organization: String(r.organization),
      location: String(r.location),
      workType: r.work_type as OpportunityItem["workType"],
      educationLevel: String(r.education_level),
      description: String(r.description),
      requirements: reqs,
      deadline: r.deadline ? String(r.deadline) : null,
      url: String(r.url),
      isActive: Boolean(r.is_active),
      isSaved: savedSet.has(String(r.id)),
    };
  });
}

export async function getOpportunityById(id: string): Promise<OpportunityItem | null> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM opportunities WHERE id = ?;`,
    args: [id],
  });
  if (res.rows.length === 0) return null;
  const r = res.rows[0];

  let reqs: string[] = [];
  try {
    reqs = JSON.parse(String(r.requirements_json));
  } catch {
    reqs = [];
  }

  return {
    id: String(r.id),
    title: String(r.title),
    type: r.type as OpportunityItem["type"],
    organization: String(r.organization),
    location: String(r.location),
    workType: r.work_type as OpportunityItem["workType"],
    educationLevel: String(r.education_level),
    description: String(r.description),
    requirements: reqs,
    deadline: r.deadline ? String(r.deadline) : null,
    url: String(r.url),
    isActive: Boolean(r.is_active),
  };
}

export async function evaluateOpportunityEligibility(
  userId: string,
  opportunityId: string
): Promise<EligibilityDiagnosis> {
  const db = getDb();
  const opp = await getOpportunityById(opportunityId);
  if (!opp) {
    return {
      status: "NOT_ELIGIBLE",
      matchPercentage: 0,
      fulfilledRequirements: [],
      unfulfilledRequirements: ["Peluang tidak ditemukan."],
      actionableRecommendations: "Pilih peluang aktif lain.",
    };
  }

  // Fetch user profile
  const profRes = await db.execute({
    sql: `SELECT * FROM profiles WHERE id = ?;`,
    args: [userId],
  });
  const userEdu = profRes.rows[0]?.education_level ? String(profRes.rows[0].education_level) : "UMUM";

  // Fetch user validated / backed competencies
  const compRes = await db.execute({
    sql: `SELECT competency_id, tier FROM competency_evidence WHERE user_id = ?;`,
    args: [userId],
  });
  const userCompMap = new Map<string, string>();
  for (const c of compRes.rows) {
    userCompMap.set(String(c.competency_id), String(c.tier));
  }

  // Fetch opportunity required competencies
  const reqCompRes = await db.execute({
    sql: `SELECT oc.*, c.name FROM opportunity_competencies oc JOIN competencies c ON oc.competency_id = c.id WHERE oc.opportunity_id = ?;`,
    args: [opportunityId],
  });

  const fulfilled: string[] = [];
  const unfulfilled: string[] = [];

  // 1. Evaluate Education Level
  const isEduMatched =
    opp.educationLevel === "SEMUA" ||
    (opp.educationLevel === "MAHASISWA" && (userEdu === "MAHASISWA" || userEdu === "MAHASISWA_AKHIR")) ||
    (opp.educationLevel === "SMA_SMK" && (userEdu === "SMA" || userEdu === "SMK" || userEdu === "MA")) ||
    (opp.educationLevel === "SMP" && userEdu === "SMP");

  if (isEduMatched) {
    fulfilled.push(`Jenjang pendidikan memenuhi syarat (${userEdu})`);
  } else {
    unfulfilled.push(`Jenjang pendidikan disyaratkan: ${opp.educationLevel} (Profil saat ini: ${userEdu})`);
  }

  // 2. Evaluate Required Competencies
  for (const rc of reqCompRes.rows) {
    const compId = String(rc.competency_id);
    const compName = String(rc.name);
    const userTier = userCompMap.get(compId);

    if (userTier === "MENTOR_VALIDATED") {
      fulfilled.push(`Kompetensi tervalidasi mentor: ${compName}`);
    } else if (userTier === "EVIDENCE_BACKED") {
      fulfilled.push(`Kompetensi didukung bukti karya: ${compName}`);
    } else if (userTier === "CLAIMED") {
      unfulfilled.push(`Kompetensi '${compName}' masih klaim mandiri (perlu bukti atau validasi mentor)`);
    } else {
      unfulfilled.push(`Belum memiliki kompetensi yang disyaratkan: ${compName}`);
    }
  }

  // Total check ratio
  const totalChecks = 1 + reqCompRes.rows.length;
  const matchPercentage = Math.round((fulfilled.length / totalChecks) * 100);

  let status: EligibilityDiagnosis["status"] = "NOT_ELIGIBLE";
  let recommendations = "";

  if (matchPercentage >= 90 && isEduMatched) {
    status = "ELIGIBLE";
    recommendations = "Profilmu sangat memenuhi kualifikasi utama! Segera siapkan berkas dan ajukan pendaftaran.";
  } else if (matchPercentage >= 50 && isEduMatched) {
    status = "POTENTIAL_MATCH";
    recommendations = "Kamu berpotensi lolos. Lengkapi bukti kompetensi yang belum divalidasi pada modul Portfolio & Skill Passport sebelum mendaftar.";
  } else {
    status = "NOT_ELIGIBLE";
    recommendations = "Terdapat persyaratan prasyarat utama yang belum terpenuhi. Tambahkan aktivitas terkait ke IDP kamu untuk membangun kualifikasi ini.";
  }

  return {
    status,
    matchPercentage,
    fulfilledRequirements: fulfilled,
    unfulfilledRequirements: unfulfilled,
    actionableRecommendations: recommendations,
  };
}

export async function toggleSaveOpportunity(userId: string, opportunityId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.execute({
    sql: `SELECT id FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?;`,
    args: [userId, opportunityId],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: `DELETE FROM saved_opportunities WHERE user_id = ? AND opportunity_id = ?;`,
      args: [userId, opportunityId],
    });
    return false;
  } else {
    await db.execute({
      sql: `INSERT INTO saved_opportunities (id, user_id, opportunity_id) VALUES (?, ?, ?);`,
      args: [`save-opp-${userId}-${opportunityId}`, userId, opportunityId],
    });
    return true;
  }
}
