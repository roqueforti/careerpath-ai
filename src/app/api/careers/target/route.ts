import { NextResponse } from "next/server";
import { setTargetCareer } from "@/lib/services/career-map.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { occupationId } = body;
    if (!occupationId) {
      return NextResponse.json({ success: false, error: "Occupation ID diperlukan." }, { status: 400 });
    }

    await setTargetCareer(user.id, occupationId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Set target career error:", err);
    return NextResponse.json({ success: false, error: "Gagal menetapkan target karier." }, { status: 500 });
  }
}
