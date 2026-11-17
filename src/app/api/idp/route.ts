import { NextResponse } from "next/server";
import { getUserActiveIdp, createDevelopmentPlan } from "@/lib/services/idp.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const idp = await getUserActiveIdp(user.id);
    return NextResponse.json({ success: true, idp });
  } catch (err) {
    console.error("Get IDP error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat IDP." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { targetCareerId, title, rationale, targetEndDate, activities } = body;

    if (!targetCareerId || !title || !targetEndDate || !Array.isArray(activities)) {
      return NextResponse.json({ success: false, error: "Field IDP tidak lengkap." }, { status: 400 });
    }

    const result = await createDevelopmentPlan(user.id, {
      targetCareerId,
      title,
      rationale: rationale || "Rencana pengembangan karier terstruktur.",
      targetEndDate,
      activities,
    });

    return NextResponse.json({ success: true, planId: result.planId }, { status: 201 });
  } catch (err) {
    console.error("Create IDP error:", err);
    return NextResponse.json({ success: false, error: "Gagal membuat IDP." }, { status: 500 });
  }
}
