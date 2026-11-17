import { NextResponse } from "next/server";
import { getDiscussions, addDiscussionComment } from "@/lib/services/mentoring.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const discussions = await getDiscussions(user.id);
    return NextResponse.json({ success: true, discussions });
  } catch (err) {
    console.error("Get discussions error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat diskusi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { discussionId, message } = body;

    if (!discussionId || !message || message.trim() === "") {
      return NextResponse.json({ success: false, error: "Pesan komentar tidak boleh kosong." }, { status: 400 });
    }

    const result = await addDiscussionComment(user.id, discussionId, message);
    return NextResponse.json({ success: true, commentId: result.commentId }, { status: 201 });
  } catch (err) {
    console.error("Add comment error:", err);
    return NextResponse.json({ success: false, error: "Gagal mengirim komentar." }, { status: 500 });
  }
}
