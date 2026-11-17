import { NextResponse } from "next/server";
import { getSkillPassport } from "@/lib/services/portfolio.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get("userId") || user.id;

    const passport = await getSkillPassport(targetUserId);
    return NextResponse.json({ success: true, passport });
  } catch (err) {
    console.error("Skill passport error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat Skill Passport." }, { status: 500 });
  }
}
