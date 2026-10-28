import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_PROJECTS } from "@/data/projects";

const DB_PATH = path.join(process.cwd(), "data", "projects-db.json");

export async function POST(req: NextRequest) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_PROJECTS, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Database reset to defaults" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset database" }, { status: 500 });
  }
}
