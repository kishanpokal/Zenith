import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Reset to defaults has been disabled to preserve real project data." },
    { status: 403 }
  );
}
