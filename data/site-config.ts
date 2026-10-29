export interface SiteConfig {
  brand: {
    name: string;
    logoUrl?: string; // Optional path to custom SVG/PNG logo file in /public/brand/
    tagline: string;
    eyebrow: string;
    description: string;
    headline: string;
    subheadline: string;
    heroReelVideoUrl?: string; // Direct MP4 or YouTube Shorts link for Hero 9:16 monitor
    status: {
      availableForProjects: boolean;
      currentSlot: string;
    };
  };
  contact: {
    email: string;
    whatsappNumber: string; // international format without spaces e.g. "1234567890" or empty
    whatsappUrl: string;
    whatsappDisplay: string;
    instagramHandle: string;
    instagramUrl: string;
    turnaroundNotice: string;
  };
  editorSpecs: {
    projectCodec: string;
    resolution: string;
    frameRate: string;
    colorSpace: string;
    audioSampleRate: string;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "ZENITH",
    logoUrl: "/brand/Zenith-logo.jpeg",
    tagline: "CUT. CREATE. CONNECT.",
    eyebrow: "ZENITH — VIDEO EDITING STUDIO",
    headline: "EVERY FRAME HAS A PURPOSE.",
    subheadline:
      "Short-form video editing for creators, coaches, and brands. Thoughtful storytelling, precise pacing, and visuals built to keep people watching.",
    description:
      "Zenith is a premium video editing studio crafting high-retention short-form reels, talking-head videos, motion graphics, and brand stories.",
    heroReelVideoUrl: "https://youtube.com/shorts/ASX9EFdHez0", // YouTube Short playing directly in the hero monitor
    status: {
      availableForProjects: true,
      currentSlot: "Taking on 2 new creators for this month",
    },
  },
  contact: {
    // Replace with your real contact details or set via environment variables
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@zenithedits.com",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "", // e.g. "12125550199"
    whatsappUrl: "https://wa.me/919204569048?text=Hi%20Zenith%20Edits!%20I%20want%20to%20start%20a%20project.",
    whatsappDisplay: "+1 (Direct WhatsApp)",
    instagramHandle: "@zenith.edits",
    instagramUrl: "https://instagram.com",
    turnaroundNotice: "Direct communication with your lead editor on every cut.",
  },
  editorSpecs: {
    projectCodec: "ProRes 422 / H.264 High-Profile",
    resolution: "1080x1920 (9:16 Vertical Native)",
    frameRate: "60 FPS Master",
    colorSpace: "Rec.709 / DaVinci Wide Gamut",
    audioSampleRate: "48kHz 24-bit True Peak Leveled",
  },
};
