import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { changeUserPassword } from "@/lib/services/auth.service";

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { oldPassword, newPassword } = body;

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Kata sandi lama dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    const result = await changeUserPassword(user.id, oldPassword, newPassword);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Kata sandi berhasil diperbarui." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui kata sandi." }, { status: 500 });
  }
}
