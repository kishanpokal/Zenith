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
    id: "proj-hero-showreel",
    title: "2026 Master Editorial Showreel",
    category: "Motion Graphics",
    clientContext: "High-Impact Commercials & Creators",
    description: "High-octane montage of surgical cuts, speed-ramped transitions, bespoke sound design, and kinetic typography engineered for maximum viewer retention.",
    duration: "0:45",
    aspectRatio: "16:9",
    videoType: "youtube",
    youtubeId: "aqz-KE-bpKQ",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    metrics: "4K 60FPS · Kodak 2383 LUT",
    editBreakdown: [
      "Custom audio-reactive speed ramps synced to 135 BPM",
      "Dynamic 3D camera tracking & match cuts",
      "Sound design master with 12 layered Foley and whoosh elements",
      "Color grading matched to cinematic Kodak 2383 LUT profile"
    ],
    soundDesignNotes: "6-track sub-bass risers, mechanical switch clacks, vinyl stop texture.",
    pacingStyle: "0.7s average cut rhythm / High-Velocity Momentum",
    featured: true,
    published: true,
    timecode: "00:00:45:00",
    order: 1
  },
  {
    id: "proj-talking-head-clarity",
    title: "Founder Framework: Zero to Scale",
    category: "Talking Head",
    clientContext: "Tech CEO & Venture Creator",
    description: "A punchy, zero-filler breakdown of high-conviction product bets. Dead space trimmed to zero frames, punctuated with custom UI callouts and subtle paper-snap SFX.",
    duration: "0:32",
    aspectRatio: "9:16",
    videoType: "youtube",
    youtubeId: "1FLYZdxsteo",
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/shorts/1FLYZdxsteo",
    metrics: "Split-Second Cuts · Vector Motion UI",
    editBreakdown: [
      "Dead-space audio ripple trimmed by 34%",
      "Split-second zoom reframing (100% to 118%) on punchlines",
      "Custom vector UI animations synchronized to speech cadence",
      "2-frame glitch sound accents at topical shifts"
    ],
    soundDesignNotes: "4-track mix: clean voice EQ, muffled sub-bass kick, subtle tape stop transitions.",
    pacingStyle: "1.2s average cut duration / Staccato cadence",
    featured: true,
    published: true,
    timecode: "00:00:32:00",
    order: 2
  },
  {
    id: "proj-luxury-real-estate",
    title: "Bel-Air Architectural Masterpiece",
    category: "Promotional",
    clientContext: "Luxury Architectural Brand",
    description: "Transforming walkthrough footage into a cinematic luxury experience with synchronized speed ramps, ambient reverb, and kinetic typography accents.",
    duration: "0:58",
    aspectRatio: "9:16",
    videoType: "youtube",
    youtubeId: "ysz5S6PUM-U",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/shorts/ysz5S6PUM-U",
    metrics: "Velocity Ramping · Ambient Soundscape",
    editBreakdown: [
      "Dynamic 110% to 125% punch-ins on architectural details",
      "Dual-color kinetic typography with subtle neon glow accents",
      "Ambient cinematic underscore ducked at -18dB behind narration",
      "Seamless visual wipes bridging conceptual spaces"
    ],
    soundDesignNotes: "Multi-band ambient reverb suppression with cinematic riser builds.",
    pacingStyle: "2.1s average cut duration / Luxury flow",
    featured: true,
    published: true,
    timecode: "00:00:58:00",
    order: 3
  },
  {
    id: "proj-creator-breakdown",
    title: "The Psychology of Viral Retention",
    category: "Business & Education",
    clientContext: "Top 1% Creator Educator",
    description: "Demonstrating the raw psychological power of surgical cuts, word-by-word kinetic subtitles, and pattern interrupt sound design.",
    duration: "0:29",
    aspectRatio: "9:16",
    videoType: "youtube",
    youtubeId: "kJQP7kiw5Fk",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/shorts/kJQP7kiw5Fk",
    metrics: "Kinetic Typography · Multi-Layer Foley",
    editBreakdown: [
      "Speed ramped visual comparison with active split wipe",
      "Word-by-word active caption glow with custom kerning",
      "Custom whoosh and paper snap accents",
      "High-impact bass drops aligned with thesis reveals"
    ],
    soundDesignNotes: "Heavy riser transitions, whoosh impacts, and custom UI audio feedback.",
    pacingStyle: "0.9s average cut duration / Rapid-fire momentum",
    featured: true,
    published: true,
    timecode: "00:00:29:00",
    order: 4
  },
  {
    id: "proj-documentary-essay",
    title: "The Anatomy of a Cyber Heist",
    category: "YouTube Longform",
    clientContext: "Documentary Channel (850K Subs)",
    description: "Long-form visual essay featuring 3D map projections, archival film grading, tension pacing, and bespoke motion graphics.",
    duration: "14:20",
    aspectRatio: "16:9",
    videoType: "youtube",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    metrics: "2.5D Parallax · Archival Film Grade",
    editBreakdown: [
      "3D satellite camera zooms into crime scenes using Google Earth Studio",
      "Custom newspaper clipping 2.5D parallax animations",
      "Soundscape created with realistic police radio scanner recordings",
      "Multi-track tension score ducked beneath investigative narration"
    ],
    soundDesignNotes: "Deep sub-drone tension beds with rhythmic analog typewriter clatter.",
    pacingStyle: "Documentary suspense / Variable pacing (0.8s to 4.2s)",
    featured: true,
    published: true,
    timecode: "00:14:20:00",
    order: 5
  },
  {
    id: "proj-motivational-raw-grade",
    title: "Discipline Over Motivation",
    category: "Talking Head",
    clientContext: "High-Performance Coach",
    description: "Taking flat, low-contrast footage and transforming it into a dark, punchy, high-retention reel with layered cinematic B-roll and punch-in emphasis.",
    duration: "0:24",
    aspectRatio: "9:16",
    videoType: "youtube",
    youtubeId: "mDYqT0_99Cw",
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/shorts/mDYqT0_99Cw",
    metrics: "Log-to-Rec.709 · Dynamic Match Cuts",
    editBreakdown: [
      "Layered A-roll and B-roll cutaways with 15-frame audio leads",
      "Color grading from flat log to rich moody obsidian shadow tone",
      "Punch zoom on keyword triggers",
      "Precision audio risers and impacts"
    ],
    soundDesignNotes: "Digital typewriter SFX, low humming electronic drone, clean pop transitions.",
    pacingStyle: "1.1s average cut duration / Staccato rhythm",
    featured: true,
    published: true,
    timecode: "00:00:24:00",
    order: 6
  },
  {
    id: "proj-fintech-product-launch",
    title: "Next-Gen Banking Interface Launch",
    category: "Motion Graphics",
    clientContext: "Global Fintech Platform",
    description: "2D kinetic motion graphics, infographic typography, and custom 3D device mockup animations explaining complex financial data in seconds.",
    duration: "0:38",
    aspectRatio: "9:16",
    videoType: "youtube",
    youtubeId: "aqz-KE-bpKQ",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
    metrics: "After Effects Rig · 3D Device Tracking",
    editBreakdown: [
      "Custom vector UI animations rendered in After Effects",
      "Interactive graph growth synced to audio cues",
      "Step-by-step numbered chapter badges",
      "Glass texture overlays with subtle chromatic aberration"
    ],
    soundDesignNotes: "Futuristic digital clicks, UI sweeps, and deep cinematic bass pads.",
    pacingStyle: "1.2s average cut duration",
    featured: true,
    published: true,
    timecode: "00:00:38:00",
    order: 7
  },
  {
    id: "proj-commercial-brand-film",
    title: "Aura: The Future of Sound",
    category: "Promotional",
    clientContext: "Audiophile Hardware Brand",
    description: "High-end product commercial blending macro-lens product footage with dynamic sound design, dark studio lighting, and dramatic bass drops.",
    duration: "1:15",
    aspectRatio: "16:9",
    videoType: "youtube",
    youtubeId: "1FLYZdxsteo",
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
    videoSrc: "https://www.youtube.com/watch?v=1FLYZdxsteo",
    metrics: "Macro Cuts · Spatial 3D Audio Mix",
    editBreakdown: [
      "Macro lens match-cutting between hardware materials",
      "Spatial 3D audio mix master",
      "Anamorphic lens flare grading",
      "Subtle time-dilation on bass drop reveal"
    ],
    soundDesignNotes: "Sub-harmonic bass pulses, acoustic room impulse response, hyper-real mechanical clicks.",
    pacingStyle: "Commercial rhythm / Slow burn build to explosive finish",
    featured: true,
    published: true,
    timecode: "00:01:15:00",
    order: 8
  }
];

// Helper to extract YouTube Video ID from any standard link, shortlink, shorts link, or embed link
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
