import { getDb } from "../db/client";
import { callAiProvider, ChatMessage } from "../ai/provider";

export async function chatWithAiMentor(
  userId: string,
  userMessage: string,
  conversationId?: string
): Promise<{
  conversationId: string;
  response: string;
  provider: string;
}> {
  const db = getDb();

  // 1. Fetch user context safely
  const pRes = await db.execute({
    sql: `SELECT u.full_name, p.education_level, p.career_maturity, p.career_maturity_score, o.title as target_career_title 
          FROM users u 
          JOIN profiles p ON u.id = p.id 
          LEFT JOIN occupations o ON p.target_career_id = o.id 
          WHERE u.id = ?;`,
    args: [userId],
  });
  const uContext = pRes.rows[0];

  const aRes = await db.execute({
    sql: `SELECT summary, primary_dimension FROM assessment_results WHERE user_id = ? ORDER BY created_at DESC LIMIT 1;`,
    args: [userId],
  });
  const assessContext = aRes.rows[0]?.summary ? String(aRes.rows[0].summary) : "Belum menyelesaikan asesmen minat";

  const idpRes = await db.execute({
    sql: `SELECT title, progress_percentage FROM development_plans WHERE user_id = ? AND status = 'ACTIVE' LIMIT 1;`,
    args: [userId],
  });
  const idpContext = idpRes.rows[0]
    ? `${idpRes.rows[0].title} (Progres: ${idpRes.rows[0].progress_percentage}%)`
    : "Belum memiliki IDP aktif";

  // Ensure conversation exists
  let cId = conversationId;
  if (!cId) {
    cId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await db.execute({
      sql: `INSERT INTO ai_conversations (id, user_id, title) VALUES (?, ?, ?);`,
      args: [cId, userId, userMessage.substring(0, 40) + "..."],
    });
  }

  // Record user message
  await db.execute({
    sql: `INSERT INTO ai_messages (id, conversation_id, sender_role, content) VALUES (?, ?, 'USER', ?);`,
    args: [`msg-${Date.now()}-u`, cId, userMessage],
  });

  // Build system prompt with strictly sanitized context grounded in SDT & Career Construction Theory
  const systemPrompt = `Kamu adalah CareerPath AI Mentor profesional, empatik, objektif, dan berlandaskan Self-Determination Theory (SDT) serta Career Construction Theory (Savickas).
Konteks Pengguna:
- Nama: ${uContext?.full_name || "Siswa"}
- Jenjang Pendidikan: ${uContext?.education_level || "Umum"}
- Tahap Kematangan Karier: ${uContext?.career_maturity || "L1: EXPLORE"} (Skor: ${uContext?.career_maturity_score || 0}/100)
- Target Profesi Pilihan: ${uContext?.target_career_title || "Belum ditentukan"}
- Hasil Asesmen: ${assessContext}
- IDP Aktif: ${idpContext}

Prinsip Pendampingan Ilmiah (Sesuai Rekomendasi Frontiers in Education 2026):
1. DUKUNG OTONOMI (AUTONOMY SUPPORT): Jangan mendikte atau memutuskan karier pengguna secara sepihak. Ajukan pertanyaan pemantik reflektif (Socratic coaching) agar mahasiswa secara mandiri merumuskan narasi identitas vokasional mereka, menghindari jebakan Automation Bias.
2. TINGKATKAN KOMPETENSI (COMPETENCE SCAFFOLDING): Uraikan target karier menjadi langkah terukur, realistis, dan terstruktur di modul CareerPath (Asesmen RIASEC, Peta Karier, IDP Sprints, dan Skill Passport).
3. FASILITASI KETERHUBUNGAN & ESKALASI HIBRIDA (HYBRID MENTORING): Jika pengguna merasa sangat bimbang, cemas, atau mengalami konflik nilai hidup, berikan validasi emosional yang hangat dan secara proaktif sarankan konsultasi mendalam dengan mentor manusia di menu Mentoring CareerPath.
4. INTEGRITAS & BOUNDARY OBJECT: Perlakukan analisis data sebagai instrumen eksplorasi awal, bukan takdir mutlak. Jangan pernah mengarang data pengguna atau memberikan jaminan kelulusan/kerja.`;

  // Fetch recent messages
  const recentMsgs = await db.execute({
    sql: `SELECT sender_role, content FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 10;`,
    args: [cId],
  });

  const chatMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...recentMsgs.rows.map((m) => ({
      role: String(m.sender_role).toLowerCase() as ChatMessage["role"],
      content: String(m.content),
    })),
  ];

  // Call provider
  const aiResult = await callAiProvider(chatMessages);

  // Record assistant response
  await db.execute({
    sql: `INSERT INTO ai_messages (id, conversation_id, sender_role, content) VALUES (?, ?, 'ASSISTANT', ?);`,
    args: [`msg-${Date.now()}-a`, cId, aiResult.content],
  });

  return {
    conversationId: cId,
    response: aiResult.content,
    provider: aiResult.provider,
  };
}

export async function getUserAiConversations(userId: string): Promise<Array<Record<string, unknown>>> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM ai_conversations WHERE user_id = ? ORDER BY updated_at DESC;`,
    args: [userId],
  });

  return res.rows.map((r) => ({
    id: String(r.id),
    title: String(r.title),
    createdAt: String(r.created_at),
  }));
}

export async function getConversationMessages(conversationId: string): Promise<Array<Record<string, unknown>>> {
  const db = getDb();
  const res = await db.execute({
    sql: `SELECT * FROM ai_messages WHERE conversation_id = ? ORDER BY created_at ASC;`,
    args: [conversationId],
  });

  return res.rows.map((r) => ({
    id: String(r.id),
    senderRole: String(r.sender_role),
    content: String(r.content),
    createdAt: String(r.created_at),
  }));
}
