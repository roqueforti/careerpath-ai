import { NextResponse } from "next/server";
import { getOccupationByIdOrSlug } from "@/lib/services/career-map.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const occupation = await getOccupationByIdOrSlug(slug);
    if (!occupation) {
      return NextResponse.json({ success: false, error: "Profesi tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, occupation });
  } catch (err) {
    console.error("Occupation detail error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat detail profesi." }, { status: 500 });
  }
}
