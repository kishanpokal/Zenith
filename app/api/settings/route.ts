import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { extractAuthToken, verifyAdminToken, enforceRateLimit } from "@/lib/auth";
import { PricingSettings, DEFAULT_PRICING_SETTINGS } from "@/data/pricing";

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
  retentionReels?: {
    reelIds: string[];
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
  pricing: PricingSettings;
}

const DEFAULT_SETTINGS: ShowcaseSettings = {
  hero: {
    youtubeUrl: "https://youtube.com/shorts/ASX9EFdHez0?feature=share",
    youtubeId: "ASX9EFdHez0",
    title: "Motion-1",
    headline: "WE EDIT FOR",
    headlineHighlight: "RETENTION.",
    subheadline: "High-impact video editing for creators and brands. Fast cuts, clean sound, and motion graphics that keep viewers watching.",
    thumbnail: "https://i.ytimg.com/vi/ASX9EFdHez0/maxresdefault.jpg",
  },
  retentionReels: {
    reelIds: [
      "proj-1793179416247-16uu5",
      "proj-1793243601981-angsz",
      "proj-1793243623115-h32uv",
    ],
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
  pricing: DEFAULT_PRICING_SETTINGS,
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
      retentionReels: {
        reelIds:
          parsed.retentionReels?.reelIds && Array.isArray(parsed.retentionReels.reelIds)
            ? parsed.retentionReels.reelIds.slice(0, 3)
            : (DEFAULT_SETTINGS.retentionReels?.reelIds || []),
      },
      beforeAfter: { ...DEFAULT_SETTINGS.beforeAfter, ...(parsed.beforeAfter || {}) },
      pricing: {
        ...DEFAULT_PRICING_SETTINGS,
        ...(parsed.pricing || {}),
        plans:
          parsed.pricing?.plans && Array.isArray(parsed.pricing.plans) && parsed.pricing.plans.length > 0
            ? parsed.pricing.plans
            : DEFAULT_PRICING_SETTINGS.plans,
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: ShowcaseSettings) {
  if (process.env.NODE_ENV === "development") {
    try {
      fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save settings to disk in development:", err);
    }
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
  const rateLimitError = enforceRateLimit(req, "admin-settings", 30, 60000);
  if (rateLimitError) return rateLimitError;

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

    const updatedPricing: PricingSettings = body.pricing
      ? {
          ...current.pricing,
          ...body.pricing,
          plans: Array.isArray(body.pricing.plans) ? body.pricing.plans : current.pricing.plans,
        }
      : current.pricing;

    const updatedRetentionReels = body.retentionReels && Array.isArray(body.retentionReels.reelIds)
      ? { reelIds: body.retentionReels.reelIds.slice(0, 3) }
      : current.retentionReels;

    const newSettings: ShowcaseSettings = {
      hero: updatedHero,
      retentionReels: updatedRetentionReels,
      beforeAfter: updatedBeforeAfter,
      pricing: updatedPricing,
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
