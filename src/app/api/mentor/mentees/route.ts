import { NextResponse } from "next/server";
import { getAssignedMentees } from "@/lib/services/mentoring.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "MENTOR") {
      return NextResponse.json({ success: false, error: "Hanya mentor yang dapat mengakses daftar mentee." }, { status: 403 });
    }

    const mentees = await getAssignedMentees(user.id);
    return NextResponse.json({ success: true, mentees });
  } catch (err) {
    console.error("Get mentees error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat daftar mentee." }, { status: 500 });
  }
}
