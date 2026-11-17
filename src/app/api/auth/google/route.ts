import { NextResponse } from "next/server";
import { loginOrRegisterWithGoogle } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, avatarUrl, role, educationLevel } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email Google yang valid wajib disertakan." },
        { status: 400 }
      );
    }

    const result = await loginOrRegisterWithGoogle({
      email,
      fullName: fullName || email.split("@")[0],
      avatarUrl: avatarUrl || null,
      role: role || "STUDENT",
      educationLevel: educationLevel || "MAHASISWA",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Gagal memproses autentikasi Google." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      isNewUser: result.isNewUser,
      message: result.isNewUser
        ? "Akun baru berhasil dibuat melalui Google Sign-In."
        : "Berhasil masuk dengan akun Google.",
    });
  } catch (err) {
    console.error("Google Auth API error:", err);
    return NextResponse.json(
      { success: false, error: "Terjadi gangguan server saat memproses autentikasi Google." },
      { status: 500 }
    );
  }
}
