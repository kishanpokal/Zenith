import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, enforceRateLimit } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  const rateLimitError = enforceRateLimit(req, "admin-projects-reset", 10, 60000);
  if (rateLimitError) return rateLimitError;

  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized access: invalid admin token" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { message: "Reset to defaults has been disabled to preserve real project data." },
    { status: 403 }
  );
}
