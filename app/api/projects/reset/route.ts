import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { DEFAULT_PROJECTS } from "@/data/projects";
import { extractAuthToken, verifyAdminToken } from "@/lib/auth";
import { seedDefaultProjects } from "@/lib/firebase";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

export async function POST(req: NextRequest) {
  const token = extractAuthToken(req);
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized access: invalid admin token" }, { status: 401 });
  }

  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_PROJECTS, null, 2), "utf-8");

    try {
      await seedDefaultProjects();
    } catch {}

    try {
      revalidatePath("/");
      revalidatePath("/work");
    } catch {}

    return NextResponse.json({ success: true, message: "Database reset to showcase defaults" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
}
