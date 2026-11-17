import { NextResponse } from "next/server";
import { updateActivityStatus } from "@/lib/services/idp.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    if (!["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ success: false, error: "Status aktivitas tidak valid." }, { status: 400 });
    }

    const result = await updateActivityStatus(user.id, id, status, notes);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Gagal memperbarui status aktivitas." }, { status: 400 });
    }

    return NextResponse.json({ success: true, newProgressPercentage: result.newProgressPercentage });
  } catch (err) {
    console.error("Update activity error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui aktivitas." }, { status: 500 });
  }
}
