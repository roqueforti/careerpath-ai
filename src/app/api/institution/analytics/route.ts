import { NextResponse } from "next/server";
import { getInstitutionAnalytics } from "@/lib/services/analytics.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "INSTITUTION_ADMIN" && user.role !== "PLATFORM_ADMIN")) {
      return NextResponse.json({ success: false, error: "Akses ditolak." }, { status: 403 });
    }

    const analytics = await getInstitutionAnalytics();
    return NextResponse.json({ success: true, analytics });
  } catch (err) {
    console.error("Institution analytics error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat analitik institusi." }, { status: 500 });
  }
}
