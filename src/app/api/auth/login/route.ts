import { NextResponse } from "next/server";
import { loginUser } from "@/lib/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const result = await loginUser(email, password);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}
