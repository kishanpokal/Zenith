import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { Project } from "@/data/projects";
import { getProjects, saveProject } from "@/lib/projects-service";
import { verifyAdminRequest, enforceRateLimit } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  const { authorized } = verifyAdminRequest(req);

  try {
    const projects = await getProjects({ publishedOnly: !authorized });
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[api/projects] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // 1. In-memory Rate Limiting (max 30 req / minute for admin mutations)
  const rateLimitError = enforceRateLimit(req, "admin-projects-post", 30, 60000);
  if (rateLimitError) return rateLimitError;

  // 2. Timing-Safe Admin Authentication
  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json(
      { error: "Unauthorized access: invalid admin token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const existing = await getProjects();

    const videoId = body.youtubeId || body.videoId || "";
    const isShorts =
      body.aspectRatio === "9:16" ||
      body.category === "Short-Form / Reel" ||
      body.category === "Shorts & Reels";

    const newProject: Project = {
      id: body.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: body.title || "Untitled Project",
      category: body.category || (isShorts ? "Shorts & Reels" : "YouTube Longform"),
      clientContext: body.clientContext || "Creator / Brand",
      description: body.description || "",
      duration: body.duration || (isShorts ? "0:30" : "1:00"),
      aspectRatio: body.aspectRatio || (isShorts ? "9:16" : "16:9"),
      videoType: "youtube",
      youtubeId: videoId,
      thumbnail:
        body.thumbnail ||
        (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : ""),
      videoSrc:
        body.videoSrc ||
        (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ""),
      metrics: body.metrics || "4K 60FPS · Kodak 2383 LUT",
      editBreakdown:
        Array.isArray(body.editBreakdown) && body.editBreakdown.length > 0
          ? body.editBreakdown.filter(Boolean)
          : [
              "Surgical velocity cuts & pacing",
              "Multi-track Foley sound architecture",
              "Color graded with Kodak 2383 look-up profile",
            ],
      soundDesignNotes:
        body.soundDesignNotes ||
        "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
      pacingStyle:
        body.pacingStyle ||
        (isShorts ? "0.8s avg cut rhythm / High Velocity" : "1.2s avg cut rhythm"),
      featured: typeof body.featured === "boolean" ? body.featured : false,
      published: typeof body.published === "boolean" ? body.published : true,
      timecode: body.timecode || `00:00:${body.duration || "30"}:00`,
      order: existing.length + 1,
      updatedAt: new Date().toISOString(),
    };

    // Save project using unified server data layer (handles Firestore & dev disk)
    await saveProject(newProject);

    // Explicit cache revalidation
    try {
      revalidateTag("projects");
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err) {
    console.error("[api/projects] Failed to add project:", err);
    return NextResponse.json({ error: "Failed to publish project" }, { status: 500 });
  }
}
