import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Project } from "@/data/projects";
import { saveProjectToDb, deleteProjectFromDb } from "@/lib/firebase";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

function readDb(): Project[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Project[];
  } catch (err) {
    return [];
  }
}

function writeDb(projects: Project[]): boolean {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
    return true;
  } catch (err) {
    return false;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await req.json();
    const projects = readDb();

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updatedProject = {
      ...projects[index],
      ...updates,
      id, // ensure ID is preserved
    };

    projects[index] = updatedProject;
    writeDb(projects);

    // Sync to Firestore
    try {
      await saveProjectToDb(updatedProject);
    } catch (fsErr) {
      console.warn("Firestore PUT error:", fsErr);
    }

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    let projects = readDb();

    const exists = projects.some((p) => p.id === id);
    if (!exists) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    projects = projects.filter((p) => p.id !== id);
    // Re-index orders
    projects.forEach((p, idx) => {
      p.order = idx + 1;
    });

    writeDb(projects);

    // Sync to Firestore
    try {
      await deleteProjectFromDb(id);
    } catch (fsErr) {
      console.warn("Firestore DELETE error:", fsErr);
    }

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
