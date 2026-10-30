import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { reorderProjects } from "@/lib/projects-service";
import { verifyAdminRequest, enforceRateLimit } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  // Rate limit: max 30 req / minute
  const rateLimitError = enforceRateLimit(req, "admin-projects-reorder", 30, 60000);
  if (rateLimitError) return rateLimitError;

  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized access: invalid admin token" },
      { status: 401 }
    );
  }

  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Invalid orderedIds array" }, { status: 400 });
    }

    const reordered = await reorderProjects(orderedIds);

    try {
      revalidateTag("projects");
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, projects: reordered });
  } catch (err) {
    console.error("[api/projects/reorder] error:", err);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
