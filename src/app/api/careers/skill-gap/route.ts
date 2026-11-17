import { NextResponse } from "next/server";
import { getSkillGapAnalysis } from "@/lib/services/career-map.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const occupationId = searchParams.get("occupationId") || undefined;

    const analysis = await getSkillGapAnalysis(user.id, occupationId);
    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("Skill gap error:", err);
    return NextResponse.json({ success: false, error: "Gagal menganalisis skill gap." }, { status: 500 });
  }
}
