import { NextRequest, NextResponse } from "next/server";
import { extractAuthToken, verifyAdminToken } from "@/lib/auth";

/**
 * Robust YouTube video ID parser supporting watch, share shortlinks, shorts, embed, and direct IDs.
 */
function parseYouTubeVideoId(input: string): { videoId: string; isShorts: boolean } | null {
  if (!input) return null;
  const raw = input.trim();

  // If already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return { videoId: raw, isShorts: false };
  }

  const isShorts = raw.includes("/shorts/");

  // Match shorts: /shorts/([a-zA-Z0-9_-]{11})
  const shortsMatch = raw.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch) {
    return { videoId: shortsMatch[1], isShorts: true };
  }

  // Match youtu.be/([a-zA-Z0-9_-]{11})
  const youtuBeMatch = raw.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (youtuBeMatch) {
    return { videoId: youtuBeMatch[1], isShorts };
  }

  // Match /embed/([a-zA-Z0-9_-]{11})
  const embedMatch = raw.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return { videoId: embedMatch[1], isShorts };
  }

  // Match watch?v=([a-zA-Z0-9_-]{11})
  const watchMatch = raw.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) {
    return { videoId: watchMatch[1], isShorts };
  }

  // Fallback match for any 11-character sequence following / or =
  const generalMatch = raw.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|\/|$)/);
  if (generalMatch) {
    return { videoId: generalMatch[1], isShorts };
  }

  return null;
}

export async function GET(req: NextRequest) {
  // Verify admin authorization
  const token = extractAuthToken(req);
  if (!verifyAdminToken(token)) {
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

  const { videoId, isShorts } = parsed;
  const maxresThumbnail = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const hqThumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
  const watchUrl = isShorts
    ? `https://www.youtube.com/shorts/${videoId}`
    : `https://www.youtube.com/watch?v=${videoId}`;

  let title = isShorts ? "Short-Form Reel Cut" : "Cinematic Master Edit";
  let authorName = "Creator / Brand";

  try {
    // Public YouTube oEmbed API supports both Public and Unlisted videos without API keys
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
    }
  } catch (err) {
    console.warn("oEmbed fetch failed, continuing with extracted ID:", err);
  }

  return NextResponse.json({
    videoId,
    title,
    authorName,
    thumbnailUrl: maxresThumbnail,
    fallbackThumbnailUrl: hqThumbnail,
    embedUrl,
    watchUrl,
    isShorts,
    aspectRatio: isShorts ? "9:16" : "16:9",
  });
}
