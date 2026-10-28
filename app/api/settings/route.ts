import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { extractAuthToken, verifyAdminToken } from "@/lib/auth";

const SETTINGS_PATH = path.join(process.cwd(), "data", "showcase-settings.json");

export interface ShowcaseSettings {
  hero: {
    youtubeUrl: string;
    youtubeId: string;
    title: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    thumbnail: string;
  };
  beforeAfter: {
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    beforeImage: string;
    afterImage: string;
    beforeLabel: string;
    afterLabel: string;
    beforeNotice: string;
    footerNote: string;
  };
}

const DEFAULT_SETTINGS: ShowcaseSettings = {
  hero: {
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    youtubeId: "aqz-KE-bpKQ",
    title: "2026 Master Editorial Showreel",
    headline: "WE EDIT FOR",
    headlineHighlight: "RETENTION.",
    subheadline: "High-impact commercial and creator post-production engineered for ruthless retention. Surgical cut pacing, 12-track Foley sound design, and razor-sharp kinetic typography.",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
  },
  beforeAfter: {
    headline: "SAME FOOTAGE.",
    headlineHighlight: "different impact.",
    subheadline: "Drag the scrubber. Left is raw flat camera log with dead air. Right is the mastered editorial cut.",
    beforeImage: "/images/projects/reel-5.jpg",
    afterImage: "/images/projects/reel-5.jpg",
    beforeLabel: "RAW LOG // CLIP_0042.MOV",
    afterLabel: "FINAL MASTER // KODAK 2383",
    beforeNotice: "DEAD AIR DETECTED: 00:00:02:14",
    footerNote: "Editing isn't adding clutter. It is removing friction from the viewer's attention.",
  },
};

function readSettings(): ShowcaseSettings {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      return DEFAULT_SETTINGS;
    }
    const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      hero: { ...DEFAULT_SETTINGS.hero, ...(parsed.hero || {}) },
      beforeAfter: { ...DEFAULT_SETTINGS.beforeAfter, ...(parsed.beforeAfter || {}) },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: ShowcaseSettings) {
  try {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function sanitizeImagePath(input: string): string {
  if (!input) return "";
  let clean = input.trim().replace(/^["']|["']$/g, "").replace(/\\/g, "/");
  const publicIndex = clean.indexOf("/public/");
  if (publicIndex !== -1) {
    clean = clean.substring(publicIndex + "/public".length);
  }
  if (clean.startsWith("images/")) {
    clean = "/" + clean;
  }
  return clean;
}

export async function GET() {
  const settings = readSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const token = extractAuthToken(req);
  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized access: invalid admin token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const current = readSettings();

    const updatedHero = {
      ...current.hero,
      ...(body.hero || {}),
    };

    if (body.hero?.youtubeUrl) {
      const extractedId = extractYouTubeId(body.hero.youtubeUrl);
      if (extractedId) {
        updatedHero.youtubeId = extractedId;
        if (!body.hero.thumbnail) {
          updatedHero.thumbnail = `https://i.ytimg.com/vi/${extractedId}/maxresdefault.jpg`;
        }
      }
    }

    const updatedBeforeAfter = {
      ...current.beforeAfter,
      ...(body.beforeAfter || {}),
    };

    if (updatedBeforeAfter.beforeImage) {
      updatedBeforeAfter.beforeImage = sanitizeImagePath(updatedBeforeAfter.beforeImage);
    }
    if (updatedBeforeAfter.afterImage) {
      updatedBeforeAfter.afterImage = sanitizeImagePath(updatedBeforeAfter.afterImage);
    }

    const newSettings: ShowcaseSettings = {
      hero: updatedHero,
      beforeAfter: updatedBeforeAfter,
    };

    writeSettings(newSettings);

    try {
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
