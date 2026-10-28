import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { Project } from "@/data/projects";
import { extractAuthToken, verifyAdminToken } from "@/lib/auth";
import { saveProjectToDb } from "@/lib/firebase";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

function readDb(): Project[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")) as Project[];
  } catch {
    return [];
  }
}

function writeDb(projects: Project[]): boolean {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const token = extractAuthToken(req);
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized access: invalid admin token" }, { status: 401 });
  }

  try {
    const { orderedIds } = await req.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: "Invalid orderedIds array" }, { status: 400 });
    }

    const projects = readDb();
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    const reordered: Project[] = [];
    orderedIds.forEach((id, index) => {
      const p = projectMap.get(id);
      if (p) {
        p.order = index + 1;
        reordered.push(p);
        projectMap.delete(id);
      }
    });

    projectMap.forEach((p) => {
      p.order = reordered.length + 1;
      reordered.push(p);
    });

    writeDb(reordered);

    // Sync updated orders to Firestore in background
    for (const proj of reordered) {
      saveProjectToDb(proj).catch(() => {});
    }

    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, projects: reordered });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
