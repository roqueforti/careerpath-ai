import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, error: "Demo switcher has been decommissioned. Please log in with a registered user account." },
    { status: 410 }
  );
}
