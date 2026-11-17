import { NextResponse } from "next/server";
import { getUserTasks, createMentoringTask, updateMentoringTaskStatus } from "@/lib/services/mentoring.service";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const tasks = await getUserTasks(user.id);
    return NextResponse.json({ success: true, tasks });
  } catch (err) {
    console.error("Get tasks error:", err);
    return NextResponse.json({ success: false, error: "Gagal memuat tugas mentoring." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "MENTOR") {
      return NextResponse.json({ success: false, error: "Hanya mentor yang dapat menugaskan aktivitas." }, { status: 403 });
    }

    const body = await request.json();
    const { menteeId, title, description, dueDate } = body;

    if (!menteeId || !title || !description || !dueDate) {
      return NextResponse.json({ success: false, error: "Data tugas tidak lengkap." }, { status: 400 });
    }

    const result = await createMentoringTask(user.id, { menteeId, title, description, dueDate });
    return NextResponse.json({ success: true, taskId: result.taskId }, { status: 201 });
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json({ success: false, error: "Gagal menugaskan aktivitas." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, status } = body;

    if (!taskId || !status) {
      return NextResponse.json({ success: false, error: "Task ID dan status diperlukan." }, { status: 400 });
    }

    const result = await updateMentoringTaskStatus(user.id, taskId, status);
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Gagal memperbarui status tugas." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update task status error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui tugas." }, { status: 500 });
  }
}
