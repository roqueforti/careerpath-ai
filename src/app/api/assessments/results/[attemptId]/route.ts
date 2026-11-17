import { NextResponse } from "next/server";
import { getAssessmentResultByAttempt } from "@/lib/services/assessment.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const result = await getAssessmentResultByAttempt(attemptId);
    if (!result) {
      return NextResponse.json({ success: false, error: "Hasil asesmen tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Assessment result error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat hasil asesmen." }, { status: 500 });
  }
}
