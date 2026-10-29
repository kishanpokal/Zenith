import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Project, DEFAULT_PROJECTS } from "@/data/projects";
import { getProjectsFromDb, saveProjectToDb } from "@/lib/firebase";
import { extractAuthToken, verifyAdminToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

function readLocalDb(): Project[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data) as Project[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function writeLocalDb(projects: Project[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Local DB sync error:", err);
  }
}

export async function GET(req: NextRequest) {
  const token = extractAuthToken(req);
  const isAdmin = verifyAdminToken(token);

  try {
    // Attempt Firestore first
    const projects = await getProjectsFromDb();
    if (Array.isArray(projects)) {
      writeLocalDb(projects);
      if (!isAdmin) {
        return NextResponse.json(projects.filter((p) => p.published !== false));
      }
      return NextResponse.json(projects);
    }
  } catch (err) {
    console.warn("Firestore read failed, serving from local cache:", err);
  }

  const localProjects = readLocalDb();
  localProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!isAdmin) {
    return NextResponse.json(localProjects.filter((p) => p.published !== false));
  }
  return NextResponse.json(localProjects);
}

export async function POST(req: NextRequest) {
  // Validate Admin Authentication Token
  const token = extractAuthToken(req);
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized access: invalid admin token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const existing = readLocalDb();

    const videoId = body.youtubeId || body.videoId || "";
    const isShorts = body.aspectRatio === "9:16" || body.category === "Short-Form / Reel" || body.category === "Shorts & Reels";

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
      editBreakdown: Array.isArray(body.editBreakdown) && body.editBreakdown.length > 0
        ? body.editBreakdown.filter(Boolean)
        : [
            "Surgical velocity cuts & pacing",
            "Multi-track Foley sound architecture",
            "Color graded with Kodak 2383 look-up profile",
          ],
      soundDesignNotes: body.soundDesignNotes || "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
      pacingStyle: body.pacingStyle || (isShorts ? "0.8s avg cut rhythm / High Velocity" : "1.2s avg cut rhythm"),
      featured: typeof body.featured === "boolean" ? body.featured : false,
      published: typeof body.published === "boolean" ? body.published : true,
      timecode: body.timecode || `00:00:${body.duration || "30"}:00`,
      order: existing.length + 1,
    };

    // 1. Save to Firestore
    try {
      await saveProjectToDb(newProject);
    } catch (fsErr) {
      console.warn("Firestore write skipped/failed, keeping local DB active:", fsErr);
    }

    // 2. Persist to local JSON cache
    existing.push(newProject);
    writeLocalDb(existing);

    // 3. Instant Portfolio Cache Invalidation
    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch (revErr) {
      console.warn("revalidatePath error:", revErr);
    }

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err) {
    console.error("Failed to add project:", err);
    return NextResponse.json({ error: "Failed to publish project" }, { status: 500 });
  }
}
