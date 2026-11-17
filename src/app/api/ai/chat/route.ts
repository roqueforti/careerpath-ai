import { NextResponse } from "next/server";
import { chatWithAiMentor } from "@/lib/services/ai.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return NextResponse.json({ success: false, error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    const result = await chatWithAiMentor(user.id, message.trim(), conversationId);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json({ success: false, error: "Gagal memproses pesan AI." }, { status: 500 });
  }
}
