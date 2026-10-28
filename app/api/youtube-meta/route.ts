import { NextRequest, NextResponse } from "next/server";
import { extractYouTubeId } from "@/data/projects";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url") || searchParams.get("id") || "";

  if (!rawUrl) {
    return NextResponse.json({ error: "No URL or ID provided" }, { status: 400 });
  }

  const youtubeId = extractYouTubeId(rawUrl);
  if (!youtubeId) {
    return NextResponse.json({ error: "Invalid YouTube URL or ID" }, { status: 400 });
  }

  const isShorts = rawUrl.includes("/shorts/") || rawUrl.includes("shorts");
  const defaultThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  const hqThumbnail = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  let title = "Cinematic Edit";
  let authorName = "Creator";

  try {
    // Fetch YouTube public oEmbed endpoint (no API key required)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`;
    const res = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.title) title = data.title;
      if (data.author_name) authorName = data.author_name;
    }
  } catch (err) {
    console.warn("oEmbed fetch failed, using fallback:", err);
  }

  return NextResponse.json({
    youtubeId,
    title,
    authorName,
    aspectRatio: isShorts ? "9:16" : "16:9",
    thumbnail: defaultThumbnail,
    fallbackThumbnail: hqThumbnail,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
  });
}
