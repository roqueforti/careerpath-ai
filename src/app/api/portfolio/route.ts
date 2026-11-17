import { NextResponse } from "next/server";
import { getUserPortfolio } from "@/lib/services/portfolio.service";
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

    const portfolio = await getUserPortfolio(targetUserId);
    return NextResponse.json({ success: true, portfolio });
  } catch (err) {
    console.error("Get portfolio error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat portofolio." }, { status: 500 });
  }
}
