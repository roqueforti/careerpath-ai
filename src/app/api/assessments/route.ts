import { NextResponse } from "next/server";
import { getAssessmentCatalog } from "@/lib/services/assessment.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assessments = await getAssessmentCatalog();
    return NextResponse.json({ success: true, assessments });
  } catch (err) {
    console.error("Assessment catalog error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat katalog asesmen." }, { status: 500 });
  }
}
