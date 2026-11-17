import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/services/audit.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "PLATFORM_ADMIN") {
      return NextResponse.json({ success: false, error: "Hanya platform admin yang dapat membaca audit log." }, { status: 403 });
    }

    const logs = await getAuditLogs(50);
    return NextResponse.json({ success: true, logs });
  } catch (err) {
    console.error("Audit logs error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat audit log." }, { status: 500 });
  }
}
