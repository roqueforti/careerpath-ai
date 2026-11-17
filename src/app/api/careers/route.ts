import { NextResponse } from "next/server";
import { getOccupations } from "@/lib/services/career-map.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const occupations = await getOccupations({ category, search });
    return NextResponse.json({ success: true, occupations });
  } catch (err) {
    console.error("Careers catalog error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat katalog karier." }, { status: 500 });
  }
}
