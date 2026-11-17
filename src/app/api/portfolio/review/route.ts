import { NextResponse } from "next/server";
import { reviewEvidence } from "@/lib/services/portfolio.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "MENTOR" && user.role !== "PLATFORM_ADMIN")) {
      return NextResponse.json({ success: false, error: "Hanya mentor atau admin yang berwenang memvalidasi bukti." }, { status: 403 });
    }

    const body = await request.json();
    const { evidenceId, status, feedback } = body;

    if (!evidenceId || !status || (status !== "VALIDATED" && status !== "REJECTED")) {
      return NextResponse.json({ success: false, error: "Data review tidak valid." }, { status: 400 });
    }

    const result = await reviewEvidence(user.id, evidenceId, status, feedback || "");
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Gagal memproses review bukti." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Review evidence error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses review." }, { status: 500 });
  }
}
