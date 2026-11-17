import { NextResponse } from "next/server";
import { toggleSaveOpportunity } from "@/lib/services/opportunity.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { opportunityId } = body;
    if (!opportunityId) {
      return NextResponse.json({ success: false, error: "Opportunity ID wajib diisi." }, { status: 400 });
    }

    const isSaved = await toggleSaveOpportunity(user.id, opportunityId);
    return NextResponse.json({ success: true, isSaved });
  } catch (err) {
    console.error("Save opportunity error:", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan peluang." }, { status: 500 });
  }
}
