import { NextResponse } from "next/server";
import { registerUser } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, educationLevel, institutionCode, phone } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, error: "Nama lengkap, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { success: false, error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Kata sandi minimal harus terdiri dari 6 karakter." },
        { status: 400 }
      );
    }

    const result = await registerUser({
      email,
      passwordPlain: password,
      fullName,
      role: role || "STUDENT",
      educationLevel: educationLevel || "SMA",
      institutionCode: institutionCode?.trim() || undefined,
      phone: phone?.trim() || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user }, { status: 201 });
  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json({ success: false, error: "Terjadi gangguan saat memproses pendaftaran akun." }, { status: 500 });
  }
}
