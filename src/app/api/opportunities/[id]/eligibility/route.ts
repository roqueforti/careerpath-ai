import { NextResponse } from "next/server";
import { evaluateOpportunityEligibility } from "@/lib/services/opportunity.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { id } = await params;
    const diagnosis = await evaluateOpportunityEligibility(user.id, id);
    return NextResponse.json({ success: true, diagnosis });
  } catch (err) {
    console.error("Opportunity eligibility error:", err);
    return NextResponse.json({ success: false, error: "Gagal mengevaluasi kelayakan." }, { status: 500 });
  }
}
