import { NextResponse } from "next/server";
import { createPortfolioItem } from "@/lib/services/portfolio.service";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, role, projectUrl, toolsUsed, competencyId, evidenceTitle, evidenceUrl } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ success: false, error: "Judul, deskripsi, dan kategori wajib diisi." }, { status: 400 });
    }

    const result = await createPortfolioItem(user.id, {
      title,
      description,
      category,
      role,
      projectUrl,
      toolsUsed,
      competencyId,
      evidenceTitle,
      evidenceUrl,
    });

    return NextResponse.json({ success: true, itemId: result.itemId }, { status: 201 });
  } catch (err) {
    console.error("Create portfolio item error:", err);
    return NextResponse.json({ success: false, error: "Gagal menyimpan item portofolio." }, { status: 500 });
  }
}
