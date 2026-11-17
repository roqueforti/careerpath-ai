import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya platform admin yang diizinkan." },
        { status: 403 }
      );
    }

    const db = getDb();

    // Query aggregate counts
    const [
      usersCount,
      studentsCount,
      mentorsCount,
      institutionsCount,
      occupationsCount,
      competenciesCount,
      assessmentsCount,
      opportunitiesCount,
      idpsCount,
      evidencesCount,
      aiMessagesCount,
    ] = await Promise.all([
      db.execute("SELECT COUNT(*) as count FROM users;"),
      db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'STUDENT';"),
      db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'MENTOR';"),
      db.execute("SELECT COUNT(*) as count FROM institutions;"),
      db.execute("SELECT COUNT(*) as count FROM occupations;"),
      db.execute("SELECT COUNT(*) as count FROM competencies;"),
      db.execute("SELECT COUNT(*) as count FROM assessments;"),
      db.execute("SELECT COUNT(*) as count FROM opportunities;"),
      db.execute("SELECT COUNT(*) as count FROM development_plans;"),
      db.execute("SELECT COUNT(*) as count FROM evidence_files;"),
      db.execute("SELECT COUNT(*) as count FROM ai_messages;"),
    ]);

    const stats = {
      totalUsers: Number(usersCount.rows[0]?.count ?? 0),
      totalStudents: Number(studentsCount.rows[0]?.count ?? 0),
      totalMentors: Number(mentorsCount.rows[0]?.count ?? 0),
      totalInstitutions: Number(institutionsCount.rows[0]?.count ?? 0),
      totalOccupations: Number(occupationsCount.rows[0]?.count ?? 0),
      totalCompetencies: Number(competenciesCount.rows[0]?.count ?? 0),
      totalAssessments: Number(assessmentsCount.rows[0]?.count ?? 0),
      totalOpportunities: Number(opportunitiesCount.rows[0]?.count ?? 0),
      totalIdps: Number(idpsCount.rows[0]?.count ?? 0),
      totalEvidences: Number(evidencesCount.rows[0]?.count ?? 0),
      totalAiMessages: Number(aiMessagesCount.rows[0]?.count ?? 0),
    };

    return NextResponse.json({ success: true, stats });
  } catch (err) {
    console.error("Admin stats API error:", err);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil statistik platform admin." },
      { status: 500 }
    );
  }
}
