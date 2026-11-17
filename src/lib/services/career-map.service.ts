import { getDb } from "../db/client";
import { recalculateCareerMaturity } from "./analytics.service";

export interface OccupationSummary {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  hollandCode: string;
  educationPaths: string;
  salaryRange?: string | null;
  outlook: string;
}

export interface OccupationDetail extends OccupationSummary {
  explorationActivities: string;
  competencies: Array<{
    id: string;
    name: string;
    code: string;
    category: string;
    expectedLevel: string;
    importance: string;
  }>;
}

export async function getOccupations(options?: {
  search?: string;
  category?: string;
}): Promise<OccupationSummary[]> {
  const db = getDb();
  let sql = `SELECT * FROM occupations WHERE 1=1`;
  const args: (string | number)[] = [];

  if (options?.category && options.category !== "ALL") {
    sql += ` AND category = ?`;
    args.push(options.category);
  }

  if (options?.search) {
    sql += ` AND (title LIKE ? OR description LIKE ? OR category LIKE ?)`;
    const pattern = `%${options.search}%`;
    args.push(pattern, pattern, pattern);
  }

  sql += ` ORDER BY title ASC;`;
  const res = await db.execute({ sql, args });

  return res.rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    category: String(r.category),
    description: String(r.description),
    hollandCode: String(r.holland_code),
    educationPaths: String(r.education_paths),
    salaryRange: r.salary_range ? String(r.salary_range) : null,
    outlook: String(r.outlook),
  }));
}

export async function getOccupationByIdOrSlug(idOrSlug: string): Promise<OccupationDetail | null> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM occupations WHERE id = ? OR slug = ?;`,
    args: [idOrSlug, idOrSlug],
  });

  if (res.rows.length === 0) return null;
  const occ = res.rows[0];

  const compRes = await db.execute({
    sql: `SELECT c.id, c.name, c.code, c.category, oc.expected_level, oc.importance 
          FROM occupation_competencies oc 
          JOIN competencies c ON oc.competency_id = c.id 
          WHERE oc.occupation_id = ? 
          ORDER BY oc.importance DESC, c.name ASC;`,
    args: [String(occ.id)],
  });

  return {
    id: String(occ.id),
    title: String(occ.title),
    slug: String(occ.slug),
    category: String(occ.category),
    description: String(occ.description),
    hollandCode: String(occ.holland_code),
    educationPaths: String(occ.education_paths),
    explorationActivities: String(occ.exploration_activities),
    salaryRange: occ.salary_range ? String(occ.salary_range) : null,
    outlook: String(occ.outlook),
    competencies: compRes.rows.map((c) => ({
      id: String(c.id),
      name: String(c.name),
      code: String(c.code),
      category: String(c.category),
      expectedLevel: String(c.expected_level),
      importance: String(c.importance),
    })),
  };
}

export async function generateCareerRecommendations(userId: string): Promise<void> {
  const db = getDb();

  // 1. Fetch user's latest assessment result
  const resResult = await db.execute({
    sql: `SELECT * FROM assessment_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
    args: [userId],
  });

  // 2. Fetch user's acquired competencies
  const resUserComp = await db.execute({
    sql: `SELECT competency_id, tier FROM competency_evidence WHERE user_id = ?;`,
    args: [userId],
  });
  const userCompIds = new Set(resUserComp.rows.map((r) => String(r.competency_id)));

  // 3. Fetch user profile
  const resProf = await db.execute({
    sql: `SELECT * FROM profiles WHERE id = ?;`,
    args: [userId],
  });
  const userProf = resProf.rows[0];
  const interests = userProf?.interests ? String(userProf.interests).toLowerCase() : "";

  // 4. Fetch all occupations with required competencies
  const allOccs = await getOccupations();

  for (const occ of allOccs) {
    const detail = await getOccupationByIdOrSlug(occ.id);
    if (!detail) continue;

    let interestFitScore = 50; // default baseline
    let interestFitReason = "Eksplorasi umum berbasis minat karier.";

    if (resResult.rows.length > 0) {
      const primaryDim = String(resResult.rows[0].primary_dimension || "");
      const secondaryDim = String(resResult.rows[0].secondary_dimension || "");
      const occCode = detail.hollandCode;

      if (occCode.includes(primaryDim[0])) {
        interestFitScore = 95;
        interestFitReason = `Sangat cocok dengan tipe kepribadian utamamu (${primaryDim}).`;
      } else if (secondaryDim && occCode.includes(secondaryDim[0])) {
        interestFitScore = 80;
        interestFitReason = `Sesuai dengan potensi minat keduamu (${secondaryDim}).`;
      } else {
        interestFitScore = 40;
        interestFitReason = `Tuntutan lingkungan kerja berbeda dari profil dominan RIASEC saat ini.`;
      }
    }

    // Evaluate competence overlap
    const requiredSkills = detail.competencies;
    const matchedSkills: string[] = [];
    const gapSkills: string[] = [];

    for (const req of requiredSkills) {
      if (userCompIds.has(req.id)) {
        matchedSkills.push(req.name);
      } else {
        gapSkills.push(req.name);
      }
    }

    const competenceRatio = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 50;

    // Preference Fit
    let prefScore = 50;
    if (interests && (interests.includes(detail.category.toLowerCase()) || detail.title.toLowerCase().includes(interests))) {
      prefScore = 90;
    }

    // Weighted Total Score: Interest (40%) + Competencies (35%) + Preference (25%)
    const matchScore = Math.round(interestFitScore * 0.4 + competenceRatio * 0.35 + prefScore * 0.25);

    const matchFactors = {
      interest_fit: interestFitReason,
      matched_skills: matchedSkills,
      gap_skills: gapSkills,
      education_fit: detail.educationPaths,
    };

    const recId = `rec-${userId}-${occ.id}`;
    await db.execute({
      sql: `INSERT OR REPLACE INTO career_recommendations (id, user_id, occupation_id, match_score, match_factors_json, calculated_at) 
            VALUES (?, ?, ?, ?, ?, datetime('now'));`,
      args: [recId, userId, occ.id, matchScore, JSON.stringify(matchFactors)],
    });
  }
}

export async function getUserCareerRecommendations(userId: string): Promise<Array<Record<string, unknown>>> {
  const db = getDb();

  // If no recommendations yet, generate them
  const check = await db.execute({
    sql: `SELECT COUNT(*) as count FROM career_recommendations WHERE user_id = ?;`,
    args: [userId],
  });
  if (Number(check.rows[0]?.count ?? 0) === 0) {
    await generateCareerRecommendations(userId);
  }

  const res = await db.execute({
    sql: `SELECT r.*, o.title, o.slug, o.category, o.outlook, o.salary_range, o.description 
          FROM career_recommendations r 
          JOIN occupations o ON r.occupation_id = o.id 
          WHERE r.user_id = ? 
          ORDER BY r.match_score DESC 
          LIMIT 10;`,
    args: [userId],
  });

  return res.rows.map((row) => {
    let factors = {};
    try {
      factors = JSON.parse(String(row.match_factors_json));
    } catch {
      factors = {};
    }

    return {
      id: String(row.id),
      occupationId: String(row.occupation_id),
      title: String(row.title),
      slug: String(row.slug),
      category: String(row.category),
      outlook: String(row.outlook),
      salaryRange: row.salary_range ? String(row.salary_range) : null,
      description: String(row.description),
      matchScore: Number(row.match_score),
      factors,
    };
  });
}

export async function setTargetCareer(userId: string, occupationId: string): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `UPDATE profiles SET target_career_id = ?, updated_at = datetime('now') WHERE id = ?;`,
    args: [occupationId, userId],
  });

  await recalculateCareerMaturity(userId);
}

export async function toggleSaveCareer(userId: string, occupationId: string): Promise<boolean> {
  const db = getDb();
  const existing = await db.execute({
    sql: `SELECT id FROM saved_careers WHERE user_id = ? AND occupation_id = ?;`,
    args: [userId, occupationId],
  });

  if (existing.rows.length > 0) {
    await db.execute({
      sql: `DELETE FROM saved_careers WHERE user_id = ? AND occupation_id = ?;`,
      args: [userId, occupationId],
    });
    return false;
  } else {
    await db.execute({
      sql: `INSERT INTO saved_careers (id, user_id, occupation_id) VALUES (?, ?, ?);`,
      args: [`save-${userId}-${occupationId}`, userId, occupationId],
    });
    return true;
  }
}

export async function getSkillGapAnalysis(userId: string, targetOccupationId?: string): Promise<{
  targetCareerTitle: string;
  acquiredSkills: Array<{ name: string; tier: string }>;
  gapSkills: Array<{ name: string; expectedLevel: string; importance: string }>;
  completionPercentage: number;
}> {
  const db = getDb();

  let occupationId = targetOccupationId;
  if (!occupationId) {
    const pRes = await db.execute({
      sql: `SELECT target_career_id FROM profiles WHERE id = ?;`,
      args: [userId],
    });
    occupationId = pRes.rows[0]?.target_career_id ? String(pRes.rows[0].target_career_id) : undefined;
  }

  if (!occupationId) {
    return {
      targetCareerTitle: "Belum Memilih Target Karier",
      acquiredSkills: [],
      gapSkills: [],
      completionPercentage: 0,
    };
  }

  const occ = await getOccupationByIdOrSlug(occupationId);
  if (!occ) {
    return {
      targetCareerTitle: "Karier Tidak Ditemukan",
      acquiredSkills: [],
      gapSkills: [],
      completionPercentage: 0,
    };
  }

  // User competency evidence
  const userCompRes = await db.execute({
    sql: `SELECT ce.competency_id, ce.tier, c.name 
          FROM competency_evidence ce 
          JOIN competencies c ON ce.competency_id = c.id 
          WHERE ce.user_id = ?;`,
    args: [userId],
  });

  const userCompMap = new Map<string, { name: string; tier: string }>();
  for (const row of userCompRes.rows) {
    userCompMap.set(String(row.competency_id), {
      name: String(row.name),
      tier: String(row.tier),
    });
  }

  const acquiredSkills: Array<{ name: string; tier: string }> = [];
  const gapSkills: Array<{ name: string; expectedLevel: string; importance: string }> = [];

  for (const req of occ.competencies) {
    const existing = userCompMap.get(req.id);
    if (existing) {
      acquiredSkills.push(existing);
    } else {
      gapSkills.push({
        name: req.name,
        expectedLevel: req.expectedLevel,
        importance: req.importance,
      });
    }
  }

  const total = occ.competencies.length;
  const completionPercentage = total > 0 ? Math.round((acquiredSkills.length / total) * 100) : 0;

  return {
    targetCareerTitle: occ.title,
    acquiredSkills,
    gapSkills,
    completionPercentage,
  };
}
