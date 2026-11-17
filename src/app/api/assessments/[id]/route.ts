import { NextResponse } from "next/server";
import { getAssessmentDetails, submitAssessmentAttempt } from "@/lib/services/assessment.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const details = await getAssessmentDetails(id);
    if (!details) {
      return NextResponse.json({ success: false, error: "Asesmen tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, ...details });
  } catch (err) {
    console.error("Assessment details error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat detail asesmen." }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { answers } = body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ success: false, error: "Jawaban asesmen tidak valid." }, { status: 400 });
    }

    const result = await submitAssessmentAttempt(user.id, id, answers);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, attemptId: result.attemptId });
  } catch (err) {
    console.error("Submit assessment error:", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan hasil asesmen." }, { status: 500 });
  }
}
