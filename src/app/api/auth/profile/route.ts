import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserProfile, updateUserProfile } from "@/lib/services/auth.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const profile = await getUserProfile(user.id);
  if (!profile) {
    return NextResponse.json({ success: false, error: "Profil tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ success: true, profile });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = await updateUserProfile(user.id, {
      fullName: body.fullName,
      phone: body.phone,
      bio: body.bio,
      interests: body.interests,
      educationLevel: body.educationLevel,
      targetCareerId: body.targetCareerId,
      isPublic: body.isPublic,
      institutionCode: body.institutionCode,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const updatedProfile = await getUserProfile(user.id);
    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui profil pengguna." }, { status: 500 });
  }
}
