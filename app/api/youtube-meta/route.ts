import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, enforceRateLimit } from "@/lib/auth-guard";

/**
 * Robust YouTube video ID parser supporting watch, share shortlinks, shorts, embed, and direct IDs.
 */
function parseYouTubeVideoId(input: string): { videoId: string; urlIsShorts: boolean } | null {
  if (!input) return null;
  const raw = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return { videoId: raw, urlIsShorts: false };
  }

  const urlIsShorts = raw.includes("/shorts/");

  // Match shorts: /shorts/([a-zA-Z0-9_-]{11})
  const shortsMatch = raw.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return { videoId: shortsMatch[1], urlIsShorts: true };
  }

  // Match youtu.be/([a-zA-Z0-9_-]{11})
  const youtuBeMatch = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch) {
    return { videoId: youtuBeMatch[1], urlIsShorts };
  }

  // Match /embed/([a-zA-Z0-9_-]{11})
  const embedMatch = raw.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return { videoId: embedMatch[1], urlIsShorts };
  }

  // Match watch?v=([a-zA-Z0-9_-]{11})
  const watchMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return { videoId: watchMatch[1], urlIsShorts };
  }

  // Fallback match for any 11-character sequence following / or =
  const generalMatch = raw.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|\/|$)/);
  if (generalMatch) {
    return { videoId: generalMatch[1], urlIsShorts };
  }

  return null;
}

/**
 * Probes YouTube CDN with fast HEAD requests to determine the highest resolution thumbnail available.
 * Unlisted videos often lack maxresdefault.jpg (404), so we test:
 * 1. maxresdefault.jpg (1280x720)
 * 2. sddefault.jpg (640x480)
 * 3. hqdefault.jpg (480x360)
 */
async function resolveBestThumbnail(videoId: string): Promise<{ bestUrl: string; maxresUrl: string; hqUrl: string }> {
  const maxresUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const sdUrl = `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
  const hqUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const candidates = [maxresUrl, sdUrl, hqUrl];

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: "HEAD",
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        return { bestUrl: url, maxresUrl, hqUrl };
      }
    } catch {
      // Continue to next resolution candidate
    }
  }

  return { bestUrl: hqUrl, maxresUrl, hqUrl };
}

export async function GET(req: NextRequest) {
  // 1. Rate Limiting: max 30 requests / minute
  const rateLimitError = enforceRateLimit(req, "youtube-meta", 30, 60000);
  if (rateLimitError) return rateLimitError;

  // 2. Timing-Safe Admin Verification
  const { authorized } = verifyAdminRequest(req);
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url") || searchParams.get("id") || "";

  if (!rawUrl) {
    return NextResponse.json({ error: "No URL or ID provided" }, { status: 400 });
  }

  const parsed = parseYouTubeVideoId(rawUrl);
  if (!parsed) {
    return NextResponse.json(
      { error: "Could not extract a valid 11-character YouTube video ID" },
      { status: 400 }
    );
  }

  const { videoId, urlIsShorts } = parsed;

  let title = urlIsShorts ? "Short-Form Reel Cut" : "Cinematic Master Edit";
  let authorName = "Creator / Brand";
  let isShorts = urlIsShorts;

  // Fetch oEmbed data (supports both Public and Unlisted videos without API keys)
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.title) title = data.title;
      if (data.author_name) authorName = data.author_name;

      // Auto-Detect 9:16 vs 16:9 from dimensions or shorts URL
      if (
        urlIsShorts ||
        (typeof data.height === "number" &&
          typeof data.width === "number" &&
          data.height > data.width)
      ) {
        isShorts = true;
      }
    }
  } catch (err) {
    console.warn("[youtube-meta] oEmbed fetch failed, continuing with extracted ID:", err);
  }

  // Fast HEAD probe to find highest resolution thumbnail that returns HTTP 200
  const thumbnails = await resolveBestThumbnail(videoId);

  const aspectRatio = isShorts ? "9:16" : "16:9";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const watchUrl = isShorts
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;

  return NextResponse.json({
    videoId,
    title,
    authorName,
    thumbnailUrl: thumbnails.bestUrl,
    maxresThumbnailUrl: thumbnails.maxresUrl,
    fallbackThumbnailUrl: thumbnails.hqUrl,
    embedUrl,
    watchUrl,
    isShorts,
    aspectRatio,
  });
}
