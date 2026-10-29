export type ProjectCategory =
  | "All Work"
  | "Shorts & Reels"
  | "YouTube Longform"
  | "Talking Head"
  | "Business & Education"
  | "Promotional"
  | "Motion Graphics";

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory | string;
  clientContext: string;
  description: string;
  duration: string;
  aspectRatio: "9:16" | "16:9";
  videoType: "youtube" | "mp4" | "vimeo";
  youtubeId?: string;
  thumbnail: string;
  videoSrc: string;
  metrics?: string;
  editBreakdown: string[];
  soundDesignNotes: string;
  pacingStyle: string;
  featured: boolean;
  published: boolean;
  timecode: string;
  order: number;
  updatedAt?: string;
}

export const CATEGORIES: ProjectCategory[] = [
  "All Work",
  "Shorts & Reels",
  "YouTube Longform",
  "Talking Head",
  "Business & Education",
  "Promotional",
  "Motion Graphics",
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    "id": "proj-1793179416247-16uu5",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "aspectRatio": "9:16",
    "order": 1,
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "updatedAt": "2026-10-28T09:23:36.247Z",
    "title": "Reel-1",
    "clientContext": "Zenith Digital Studio",
    "published": true,
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "timecode": "00:00:0:06:00",
    "featured": true,
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "youtubeId": "ASX9EFdHez0",
    "thumbnail": "https://i.ytimg.com/vi/ASX9EFdHez0/maxresdefault.jpg",
    "duration": "0:06",
    "videoType": "youtube",
    "category": "Short-Form / Reel",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "videoSrc": "https://www.youtube.com/watch?v=ASX9EFdHez0"
  },
  {
    "id": "proj-1793243538503-f39bw",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "youtubeId": "BjR1i5th9go",
    "order": 2,
    "thumbnail": "https://i.ytimg.com/vi/BjR1i5th9go/maxresdefault.jpg",
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "title": "Before-After-2",
    "videoType": "youtube",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "clientContext": "Zenith Digital Studio",
    "videoSrc": "https://www.youtube.com/watch?v=BjR1i5th9go",
    "aspectRatio": "9:16",
    "category": "Short-Form / Reel",
    "published": true,
    "duration": "0:30",
    "timecode": "00:00:0:30:00",
    "updatedAt": "2026-10-29T03:13:02.805Z",
    "featured": false
  },
  {
    "id": "proj-1793243564374-lg7v5",
    "published": true,
    "clientContext": "Zenith Digital Studio",
    "updatedAt": "2026-10-29T03:12:44.374Z",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "aspectRatio": "9:16",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "category": "Short-Form / Reel",
    "videoType": "youtube",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "videoSrc": "https://www.youtube.com/watch?v=F_kpnnvj55o",
    "order": 3,
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "featured": false,
    "youtubeId": "F_kpnnvj55o",
    "thumbnail": "https://i.ytimg.com/vi/F_kpnnvj55o/maxresdefault.jpg",
    "timecode": "00:00:0:30:00",
    "duration": "0:30",
    "title": "Before-After-1",
    "pacingStyle": "0.8s avg cut rhythm / High Velocity"
  },
  {
    "id": "proj-1793243601981-angsz",
    "featured": true,
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "timecode": "00:00:0:30:00",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "thumbnail": "https://i.ytimg.com/vi/oYGOuRiL9x8/maxresdefault.jpg",
    "youtubeId": "oYGOuRiL9x8",
    "duration": "0:30",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "clientContext": "Zenith Digital Studio",
    "category": "Short-Form / Reel",
    "videoSrc": "https://www.youtube.com/watch?v=oYGOuRiL9x8",
    "videoType": "youtube",
    "order": 4,
    "published": true,
    "updatedAt": "2026-10-29T03:13:21.981Z",
    "title": "Minimal Edit 1",
    "aspectRatio": "9:16"
  },
  {
    "id": "proj-1793243623115-h32uv",
    "aspectRatio": "9:16",
    "videoSrc": "https://www.youtube.com/watch?v=gmoeUQiiSKU",
    "category": "Short-Form / Reel",
    "videoType": "youtube",
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "duration": "0:30",
    "thumbnail": "https://i.ytimg.com/vi/gmoeUQiiSKU/maxresdefault.jpg",
    "youtubeId": "gmoeUQiiSKU",
    "featured": true,
    "timecode": "00:00:0:30:00",
    "published": true,
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "updatedAt": "2026-10-29T03:14:41.411Z",
    "order": 5,
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "clientContext": "Zenith Digital Studio",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "title": "Podcast-1"
  },
  {
    "id": "proj-1793243639645-vf5u1",
    "duration": "0:30",
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "youtubeId": "wwWgevYw7zo",
    "thumbnail": "https://i.ytimg.com/vi/wwWgevYw7zo/maxresdefault.jpg",
    "featured": false,
    "timecode": "00:00:0:30:00",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "videoType": "youtube",
    "videoSrc": "https://www.youtube.com/watch?v=wwWgevYw7zo",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "category": "Short-Form / Reel",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "title": "Talking Head 1",
    "aspectRatio": "9:16",
    "updatedAt": "2026-10-29T03:14:44.598Z",
    "published": true,
    "clientContext": "Zenith Digital Studio",
    "order": 6
  },
  {
    "id": "proj-1793243658165-xdpff",
    "duration": "0:30",
    "thumbnail": "https://i.ytimg.com/vi/lqQoMc-qs-E/maxresdefault.jpg",
    "youtubeId": "lqQoMc-qs-E",
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "featured": true,
    "timecode": "00:00:0:30:00",
    "videoSrc": "https://www.youtube.com/watch?v=lqQoMc-qs-E",
    "aspectRatio": "9:16",
    "category": "Short-Form / Reel",
    "videoType": "youtube",
    "clientContext": "Zenith Digital Studio",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "title": "Simple Talking Head 2",
    "published": true,
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "pacingStyle": "0.8s avg cut rhythm / High Velocity",
    "order": 7,
    "updatedAt": "2026-10-29T03:14:18.166Z",
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ]
  },
  {
    "id": "proj-1793243688039-9b88p",
    "published": true,
    "editBreakdown": [
      "Surgical velocity cuts & pacing",
      "Multi-track Foley sound architecture",
      "Color graded with Kodak 2383 look-up profile"
    ],
    "updatedAt": "2026-10-29T03:14:48.039Z",
    "title": "Brand-Work-2",
    "aspectRatio": "9:16",
    "clientContext": "Zenith Digital Studio",
    "soundDesignNotes": "Multi-track audio mix with layered whooshes and 40Hz sub risers.",
    "order": 8,
    "category": "Short-Form / Reel",
    "metrics": "4K 60FPS · Kodak 2383 LUT",
    "videoType": "youtube",
    "description": "High-retention editorial cut engineered for Zenith Digital Studio.",
    "videoSrc": "https://www.youtube.com/watch?v=qbaUTRvammM",
    "youtubeId": "qbaUTRvammM",
    "thumbnail": "https://i.ytimg.com/vi/qbaUTRvammM/maxresdefault.jpg",
    "timecode": "00:00:0:30:00",
    "featured": false,
    "duration": "0:30",
    "pacingStyle": "0.8s avg cut rhythm / High Velocity"
  }
];

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already just the 11 character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }

  // Handle youtu.be/VIDEO_ID
  const shortLinkMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortLinkMatch && shortLinkMatch[1]) {
    return shortLinkMatch[1];
  }

  // Handle youtube.com/watch?v=VIDEO_ID (or &v=)
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  return null;
}

// Helper to generate clean, high-res YouTube thumbnail URL
export function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

// Helper to generate distraction-free YouTube embed URL
export function getYouTubeEmbedUrl(
  youtubeId: string,
  options: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
  } = {}
): string {
  const { autoplay = true, mute = false, loop = true, controls = true } = options;
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    loop: loop ? "1" : "0",
    playlist: youtubeId, // Needed for loop to work reliably
    controls: controls ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    playsinline: "1",
    enablejsapi: "1",
    origin: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  });

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}

export const projects: Project[] = DEFAULT_PROJECTS;
