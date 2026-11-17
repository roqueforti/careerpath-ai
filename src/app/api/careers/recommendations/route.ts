import { NextResponse } from "next/server";
import { getUserCareerRecommendations } from "@/lib/services/career-map.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const recommendations = await getUserCareerRecommendations(user.id);
    return NextResponse.json({ success: true, recommendations });
  } catch (err) {
    console.error("Recommendations error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat rekomendasi karier." }, { status: 500 });
  }
}
