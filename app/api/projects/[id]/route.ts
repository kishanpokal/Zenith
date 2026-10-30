import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { getProjectById, saveProject, deleteProject } from "@/lib/projects-service";
import { verifyAdminRequest, enforceRateLimit } from "@/lib/auth-guard";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limit admin mutations: max 30 req / minute
  const rateLimitError = enforceRateLimit(req, "admin-project-put", 30, 60000);
  if (rateLimitError) return rateLimitError;

  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized access: invalid admin token" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updates = await req.json();
    const updatedProject = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };

    await saveProject(updatedProject);

    try {
      revalidateTag("projects");
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (err) {
    console.error("[api/projects/[id]] PUT error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limit admin mutations: max 30 req / minute
  const rateLimitError = enforceRateLimit(req, "admin-project-delete", 30, 60000);
  if (rateLimitError) return rateLimitError;

  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized access: invalid admin token" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const existing = await getProjectById(id);
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await deleteProject(id);

    try {
      revalidateTag("projects");
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error("[api/projects/[id]] DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
