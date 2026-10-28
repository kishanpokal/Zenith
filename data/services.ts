export interface ServiceItem {
  number: string;
  code: string;
  title: string;
  description: string;
  deliverables: string[];
  trackRole: string; // e.g. "V1 / CUT", "V2 / GFX", "A1 / DIALOGUE", "A2 / SFX"
}

export const services: ServiceItem[] = [
  {
    number: "01",
    code: "SRV_REELS",
    title: "Short-Form Video Editing",
    description:
      "Precision editing built specifically for Instagram Reels, TikTok, and YouTube Shorts. Engineered for immediate hook retention and natural narrative flow.",
    deliverables: [
      "9:16 vertical formatting & composition",
      "Dead-space audio ripple trimming",
      "Dynamic jump cuts and reframing",
      "Color grading optimized for OLED mobile screens",
    ],
    trackRole: "V1 / PRIMARY CUT",
  },
  {
    number: "02",
    code: "SRV_TALK",
    title: "Talking-Head Reels",
    description:
      "Turn solo camera recordings into captivating, authoritative content. We balance micro-zooms, facial tracking, and emphasis accents to keep viewers engaged.",
    deliverables: [
      "Eye-level stabilization and framing correction",
      "Strategic punch-ins on core points",
      "Breath and hesitation elimination",
      "Multi-cam switching when footage permits",
    ],
    trackRole: "V1 / FRAMING & CADENCE",
  },
  {
    number: "03",
    code: "SRV_TYPO",
    title: "Captions and Typography",
    description:
      "Modern, brand-tailored kinetic subtitles that guide the eye without overwhelming the face. Never generic auto-generated templates.",
    deliverables: [
      "Custom brand fonts, weights, and colorways",
      "Word-by-word synchronized highlighting",
      "Emoji/vector icon micro-accents",
      "Safe-zone layout for Instagram & TikTok UI",
    ],
    trackRole: "V2 / KINETIC TEXT",
  },
  {
    number: "04",
    code: "SRV_MOTN",
    title: "Motion Graphics",
    description:
      "Clean 2D overlays, diagram callouts, lower thirds, and UI mockups that explain complex concepts simply and professionally.",
    deliverables: [
      "Vector shape animations and chart builds",
      "Mockup screen tracking for apps & web platforms",
      "Minimalist chapter title cards",
      "Smooth easing and organic motion blur",
    ],
    trackRole: "V3 / 2D MOTION GFX",
  },
  {
    number: "05",
    code: "SRV_BROLL",
    title: "B-Roll Integration",
    description:
      "Contextual visual cutaways that illustrate your message, maintain momentum, and break up continuous talking-head fatigue.",
    deliverables: [
      "Curated high-resolution stock or client b-roll",
      "Speed-ramped cinematic insertions",
      "Texture overlays (film grain, subtle halation)",
      "Motion match-cuts on action gestures",
    ],
    trackRole: "V2 / B-ROLL OVERLAY",
  },
  {
    number: "06",
    code: "SRV_SND",
    title: "Sound Design",
    description:
      "Audio is half the video. We layer subtle risers, whooshes, UI clicks, paper crinkles, and sub-bass impacts to make visuals feel tactile.",
    deliverables: [
      "Precision SFX mapped to cuts and graphics",
      "Spatial panning and atmospheric presence",
      "Subtle risers building anticipation before key points",
      "Impact hits on major visual transitions",
    ],
    trackRole: "A2 / SFX DESIGN",
  },
  {
    number: "07",
    code: "SRV_MUSC",
    title: "Music and Pacing",
    description:
      "Selecting the right track and scoring it to your voice. Beat-syncing cuts, ducking music under dialogue, and creating dynamic energy arcs.",
    deliverables: [
      "Licensing-cleared commercial track curation",
      "Dynamic sidechain ducking (-14dB to -20dB)",
      "Tempo alignment with speech rhythm",
      "Dramatic music drops at punchlines",
    ],
    trackRole: "A3 / MUSIC SCORE",
  },
  {
    number: "08",
    code: "SRV_PROMO",
    title: "Promotional Videos",
    description:
      "High-energy video trailers for course launches, podcast highlights, digital products, and brand announcements.",
    deliverables: [
      "Fast-paced teaser structure with cliffhanger hook",
      "Brand asset integration and 3D product turns",
      "Compelling call-to-action lockups",
      "Multiple format exports (9:16, 1:1, 16:9)",
    ],
    trackRole: "MASTER / PROMO SUITE",
  },
];
