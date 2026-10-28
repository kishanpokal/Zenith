import { NextRequest, NextResponse } from "next/server";
import { Project, DEFAULT_PROJECTS } from "@/data/projects";
import { getProjectsFromDb, saveProjectToDb } from "@/lib/firebase";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

function readLocalDb(): Project[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return DEFAULT_PROJECTS;
    }
    const data = fs.readFileSync(DB_PATH, "utf-8");
    const parsed = JSON.parse(data) as Project[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROJECTS;
  } catch (err) {
    return DEFAULT_PROJECTS;
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
  try {
    // Attempt Firestore first
    const projects = await getProjectsFromDb();
    if (Array.isArray(projects) && projects.length > 0) {
      writeLocalDb(projects); // keep local cache in sync
      return NextResponse.json(projects);
    }
  } catch (err) {
    console.warn("Firestore read failed, serving from local cache:", err);
  }

  const localProjects = readLocalDb();
  localProjects.sort((a, b) => (a.order || 0) - (b.order || 0));
  return NextResponse.json(localProjects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const existing = readLocalDb();

    const newProject: Project = {
      id: body.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: body.title || "Untitled Project",
      category: body.category || "Shorts & Reels",
      clientContext: body.clientContext || "Creator",
      description: body.description || "",
      duration: body.duration || "0:30",
      aspectRatio: body.aspectRatio || "9:16",
      videoType: body.videoType || "youtube",
      youtubeId: body.youtubeId || "",
      thumbnail: body.thumbnail || (body.youtubeId ? `https://img.youtube.com/vi/${body.youtubeId}/maxresdefault.jpg` : ""),
      videoSrc: body.videoSrc || (body.youtubeId ? `https://www.youtube.com/watch?v=${body.youtubeId}` : ""),
      metrics: body.metrics || "",
      editBreakdown: Array.isArray(body.editBreakdown)
        ? body.editBreakdown.filter(Boolean)
        : ["Dynamic cuts & punch-ins", "Word-by-word active caption glow", "Custom SFX & sound design"],
      soundDesignNotes: body.soundDesignNotes || "Multi-track audio mix with layered whooshes and risers.",
      pacingStyle: body.pacingStyle || "1.1s average cut rhythm",
      featured: typeof body.featured === "boolean" ? body.featured : false,
      published: typeof body.published === "boolean" ? body.published : true,
      timecode: body.timecode || `00:00:${body.duration || "30"}:00`,
      order: existing.length + 1,
    };

    // Save to Firestore
    try {
      await saveProjectToDb(newProject);
    } catch (fsErr) {
      console.warn("Failed to persist to Firestore, saving to local cache:", fsErr);
    }

    // Also persist to local db
    existing.push(newProject);
    writeLocalDb(existing);

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err) {
    console.error("Failed to add project:", err);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}
