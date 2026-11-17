import { NextResponse } from "next/server";
import { getUserAiConversations } from "@/lib/services/ai.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const conversations = await getUserAiConversations(user.id);
    return NextResponse.json({ success: true, conversations });
  } catch (err) {
    console.error("AI conversations error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat percakapan AI." }, { status: 500 });
  }
}
