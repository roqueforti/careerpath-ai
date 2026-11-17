import { getDb } from "../db/client";
import { recalculateCareerMaturity } from "./analytics.service";
import { generateCareerRecommendations } from "./career-map.service";

export interface AssessmentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  assessmentType: string;
  instruction: string;
  minEducationLevel: string;
  questionCount: number;
}

export interface QuestionOption {
  label: string;
  value: string;
  score: number;
}

export interface AssessmentQuestion {
  id: string;
  questionText: string;
  questionType: string;
  dimension: string;
  orderNum: number;
  options: QuestionOption[];
}

export async function getAssessmentCatalog(): Promise<AssessmentItem[]> {
  const db = getDb();
  const res = await db.execute(`
    SELECT a.*, COUNT(q.id) as question_count
    FROM assessments a
    LEFT JOIN assessment_questions q ON a.id = q.assessment_id
    WHERE a.is_active = 1
    GROUP BY a.id
    ORDER BY a.created_at ASC;
  `);

  return res.rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    slug: String(r.slug),
    description: String(r.description),
    assessmentType: String(r.assessment_type),
    instruction: String(r.instruction),
    minEducationLevel: String(r.min_education_level),
    questionCount: Number(r.question_count || 0),
  }));
}

export async function getAssessmentDetails(assessmentIdOrSlug: string): Promise<{
  assessment: AssessmentItem;
  questions: AssessmentQuestion[];
} | null> {
  const db = getDb();
  const aRes = await db.execute({
    sql: `SELECT a.*, COUNT(q.id) as question_count 
          FROM assessments a 
          LEFT JOIN assessment_questions q ON a.id = q.assessment_id 
          WHERE a.id = ? OR a.slug = ?
          GROUP BY a.id;`,
    args: [assessmentIdOrSlug, assessmentIdOrSlug],
  });

  if (aRes.rows.length === 0) return null;
  const aRow = aRes.rows[0];

  const assessment: AssessmentItem = {
    id: String(aRow.id),
    title: String(aRow.title),
    slug: String(aRow.slug),
    description: String(aRow.description),
    assessmentType: String(aRow.assessment_type),
    instruction: String(aRow.instruction),
    minEducationLevel: String(aRow.min_education_level),
    questionCount: Number(aRow.question_count || 0),
  };

  const qRes = await db.execute({
    sql: `SELECT * FROM assessment_questions WHERE assessment_id = ? ORDER BY order_num ASC;`,
    args: [assessment.id],
  });

  const questions: AssessmentQuestion[] = qRes.rows.map((q) => {
    let options: QuestionOption[] = [];
    try {
      options = JSON.parse(String(q.options_json));
    } catch {
      options = [];
    }
    return {
      id: String(q.id),
      questionText: String(q.question_text),
      questionType: String(q.question_type),
      dimension: String(q.dimension),
      orderNum: Number(q.order_num),
      options,
    };
  });

  return { assessment, questions };
}

export async function submitAssessmentAttempt(
  userId: string,
  assessmentId: string,
  answers: Array<{ questionId: string; selectedValue: string; scoreValue: number }>
): Promise<{ success: boolean; attemptId?: string; error?: string }> {
  const db = getDb();

  const details = await getAssessmentDetails(assessmentId);
  if (!details) {
    return { success: false, error: "Asesmen tidak ditemukan." };
  }

  if (answers.length < details.questions.length) {
    return { success: false, error: `Harap jawab semua ${details.questions.length} pertanyaan asesmen.` };
  }

  // 1. Calculate deterministic dimension scores
  const dimensionsMap: Record<string, number> = {};
  const questionDimMap: Record<string, string> = {};
  for (const q of details.questions) {
    questionDimMap[q.id] = q.dimension;
    if (!dimensionsMap[q.dimension]) {
      dimensionsMap[q.dimension] = 0;
    }
  }

  for (const a of answers) {
    const dim = questionDimMap[a.questionId];
    if (dim) {
      dimensionsMap[dim] = (dimensionsMap[dim] || 0) + a.scoreValue;
    }
  }

  // 2. Sort dimensions to determine primary and secondary traits
  const sortedDims = Object.entries(dimensionsMap).sort((a, b) => b[1] - a[1]);
  const primaryDim = sortedDims[0]?.[0] || "GENERAL";
  const secondaryDim = sortedDims[1]?.[0] || null;

  // 3. Build interpretive text
  const hollandDescriptions: Record<string, string> = {
    REALISTIC: "Menyukai aktivitas praktis, mekanis, teknis, dan interaksi langsung dengan objek nyata atau perkakas.",
    INVESTIGATIVE: "Memiliki rasa ingin tahu analitis tinggi, pemikir mandiri, menyukai observasi sains dan penyelesaian masalah logis.",
    ARTISTIC: "Ekspresif, kreatif, imajinatif, menyukai inovasi desain, estetika, dan lingkungan kerja fleksibel.",
    SOCIAL: "Empatik, komunikatif, senang mengajar, membimbing, dan bekerja sama membantu orang lain.",
    ENTERPRISING: "Percaya diri, persuasif, memiliki jiwa kepemimpinan, dan tertarik pada inisiatif bisnis atau proyek strategis.",
    CONVENTIONAL: "Teliti, teratur, metodis, menyukai akurasi data, prosedur standar, dan pengelolaan sistem terstruktur.",
  };

  const codeChars = sortedDims.slice(0, 3).map(([d]) => d[0]).join("");
  const summary = `Profil Holland RIASEC: ${codeChars} (${primaryDim}${secondaryDim ? " - " + secondaryDim : ""})`;
  const interpretation = `Berdasarkan skor jawabanmu, kekuatan minat utamamu berada pada dimensi ${primaryDim}: ${hollandDescriptions[primaryDim] || ""} ${
    secondaryDim ? "Didukung oleh dimensi " + secondaryDim + ": " + (hollandDescriptions[secondaryDim] || "") : ""
  }`;

  const nextSteps = `1. Telusuri katalog profesi yang cocok dengan kode minat ${codeChars} pada modul Career Map.\n2. Tetapkan 1 target profesi awal untuk memulai analisis skill gap.\n3. Susun Individual Development Plan (IDP) untuk mengasah kompetensi teknis dan soft skill yang relevan.`;

  const attemptId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const resultId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  // 4. Atomic Database insertions
  await db.execute({
    sql: `INSERT INTO assessment_attempts (id, user_id, assessment_id, version, status, completed_at) VALUES (?, ?, ?, 1, 'EVALUATED', datetime('now'));`,
    args: [attemptId, userId, details.assessment.id],
  });

  for (const a of answers) {
    await db.execute({
      sql: `INSERT INTO assessment_answers (id, attempt_id, question_id, selected_value, score_value) VALUES (?, ?, ?, ?, ?);`,
      args: [`ans-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, attemptId, a.questionId, a.selectedValue, a.scoreValue],
    });
  }

  await db.execute({
    sql: `INSERT INTO assessment_results (id, attempt_id, user_id, assessment_id, summary, primary_dimension, secondary_dimension, dimensions_json, interpretation, next_steps) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [
      resultId,
      attemptId,
      userId,
      details.assessment.id,
      summary,
      primaryDim,
      secondaryDim,
      JSON.stringify(dimensionsMap),
      interpretation,
      nextSteps,
    ],
  });

  // 5. Trigger downstream career recommendations & career maturity recalculation
  await generateCareerRecommendations(userId);
  await recalculateCareerMaturity(userId);

  return { success: true, attemptId };
}

export async function getAssessmentResultByAttempt(attemptId: string): Promise<Record<string, unknown> | null> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT r.*, a.title as assessment_title, a.assessment_type 
          FROM assessment_results r 
          JOIN assessments a ON r.assessment_id = a.id 
          WHERE r.attempt_id = ?;`,
    args: [attemptId],
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];

  let dimensions: Record<string, number> = {};
  try {
    dimensions = JSON.parse(String(row.dimensions_json));
  } catch {
    dimensions = {};
  }

  return {
    id: String(row.id),
    attemptId: String(row.attempt_id),
    userId: String(row.user_id),
    assessmentTitle: String(row.assessment_title),
    assessmentType: String(row.assessment_type),
    summary: String(row.summary),
    primaryDimension: String(row.primary_dimension),
    secondaryDimension: row.secondary_dimension ? String(row.secondary_dimension) : null,
    dimensions,
    interpretation: String(row.interpretation),
    nextSteps: String(row.next_steps),
    createdAt: String(row.created_at),
  };
}

export async function getUserAssessmentHistory(userId: string): Promise<Array<Record<string, unknown>>> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT r.*, a.title as assessment_title, att.completed_at 
          FROM assessment_results r 
          JOIN assessments a ON r.assessment_id = a.id 
          JOIN assessment_attempts att ON r.attempt_id = att.id 
          WHERE r.user_id = ? 
          ORDER BY r.created_at DESC;`,
    args: [userId],
  });

  return res.rows.map((row) => ({
    id: String(row.id),
    attemptId: String(row.attempt_id),
    assessmentTitle: String(row.assessment_title),
    summary: String(row.summary),
    primaryDimension: String(row.primary_dimension),
    completedAt: String(row.completed_at || row.created_at),
  }));
}
