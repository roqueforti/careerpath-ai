import { NextResponse } from "next/server";
import { getStudentDashboard } from "@/lib/services/analytics.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const dashboard = await getStudentDashboard(user.id);
    return NextResponse.json({ success: true, dashboard });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat analitik dashboard." }, { status: 500 });
  }
}
