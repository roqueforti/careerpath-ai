import { NextResponse } from "next/server";
import { getOpportunities } from "@/lib/services/opportunity.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const educationLevel = searchParams.get("educationLevel") || undefined;
    const search = searchParams.get("search") || undefined;

    const opportunities = await getOpportunities(user?.id, { type, educationLevel, search });
    return NextResponse.json({ success: true, opportunities });
  } catch (err) {
    console.error("Opportunities catalog error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat katalog peluang." }, { status: 500 });
  }
}
