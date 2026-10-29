export interface PricingPlan {
  id: string;
  name: string;
  volume: string;
  price: string; // e.g. "299", "499", "CUSTOM"
  cadence?: string; // e.g. "/ month", "/ project", or ""
  popular?: boolean;
  tagline: string;
  features: string[];
  ctaText: string;
  whatsappMessage: string;
}

export interface PricingSettings {
  currencySymbol: string; // default: "$"
  currencyCode?: string; // default: "USD"
  headline?: string;
  headlineHighlight?: string;
  subheadline?: string;
  plans: PricingPlan[];
}

export const DEFAULT_PRICING_SETTINGS: PricingSettings = {
  currencySymbol: "$",
  currencyCode: "USD",
  headline: "SIMPLE PRICING.",
  headlineHighlight: "zero guesswork.",
  subheadline: "Choose a package that fits your publishing schedule. No surprise fees.",
  plans: [
    {
      id: "starter",
      name: "STARTER",
      volume: "30 REELS / MO",
      price: "299",
      cadence: "/ month",
      popular: false,
      tagline: "For creators looking for consistent weekly posts.",
      features: [
        "30 High-retention vertical reels",
        "Fast pacing with zero dead pauses",
        "Animated subtitles & clean B-roll",
        "Sound effects & background music",
        "48-hour delivery & fast revisions",
      ],
      ctaText: "Start with 30",
      whatsappMessage: "Hi Zenith! I want to start a project with the Starter package (30 reels / $299).",
    },
    {
      id: "growth",
      name: "GROWTH",
      volume: "60 REELS / MO",
      price: "499",
      cadence: "/ month",
      popular: true,
      tagline: "For active creators wanting maximum reach and speed.",
      features: [
        "60 High-retention vertical reels",
        "Custom motion graphics & animations",
        "Full sound design & audio mixing",
        "Cinematic color grading",
        "Fast 24-48h turnaround & priority edits",
      ],
      ctaText: "Scale with 60",
      whatsappMessage: "Hi Zenith! I want to start a project with the Growth package (60 reels / $499).",
    },
    {
      id: "vip",
      name: "VIP RETAINER",
      volume: "CUSTOM VOLUME",
      price: "CUSTOM",
      cadence: "",
      popular: false,
      tagline: "For brands and channels needing a dedicated editing team.",
      features: [
        "Short-form reels & YouTube long videos",
        "Dedicated lead video editor",
        "Custom brand style & graphics",
        "Fastest same-day turnaround",
        "Direct chat on WhatsApp & Slack",
      ],
      ctaText: "Inquire VIP Retainer",
      whatsappMessage: "Hi Zenith! I want to discuss a custom VIP Retainer for my channel/brand.",
    },
  ],
};

/**
 * Formats a plan price with the given currency symbol (defaults to "$").
 * If the price is "CUSTOM", returns "CUSTOM".
 * If the price is numeric (e.g. "299"), prepends the currency symbol: "$299".
 * If it already starts with a currency symbol ($299, €299, etc.), adapts to active symbol.
 */
export function formatPlanPrice(
  price: string | number | undefined | null,
  currencySymbol: string = "$"
): string {
  if (price === undefined || price === null) return "CUSTOM";
  const str = String(price).trim();
  if (!str || /^custom$/i.test(str)) return "CUSTOM";

  // If purely numeric e.g. "299" or "299.00"
  if (/^\d+(\.\d+)?$/.test(str)) {
    return `${currencySymbol}${str}`;
  }

  // If starts with an existing currency symbol followed by numbers
  const match = str.match(/^([$€£₹¥]|C\$|A\$|AED\s*)?\s*(\d+(\.\d+)?)(.*)$/i);
  if (match && match[2]) {
    return `${currencySymbol}${match[2]}${match[4] || ""}`;
  }

  return str;
}

// Backward compatibility types and config
export interface PricingPackage {
  id: "starter" | "growth" | "custom";
  name: string;
  badge?: string;
  tagline: string;
  targetAudience: string;
  priceDisplay?: string | null;
  cadence?: string | null;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
}

export interface PricingConfig {
  showExplicitPrices: boolean;
  currencySymbol: string;
  footnote: string;
  packages: PricingPackage[];
}

export const pricingConfig: PricingConfig = {
  showExplicitPrices: true,
  currencySymbol: "$",
  footnote:
    "Every partnership begins with a paid test edit so you can experience our quality, communication, and turnaround firsthand.",
  packages: [
    {
      id: "starter",
      name: "STARTER",
      tagline: "For clients who need occasional short-form edits.",
      targetAudience: "Creators testing new formats, ad-hoc keynote chops, or single campaign releases.",
      priceDisplay: "$299 / month",
      cadence: "Per project scope",
      features: [
        "Single or batch short-form edits",
        "Full A-roll ripple edit & dead-air cleanup",
        "Brand-aligned typography & captions",
        "Color grade & studio audio leveling",
        "Frame-accurate revision cycle included",
        "Delivered in 9:16 high-bitrate MP4",
      ],
      ctaLabel: "Discuss your project",
      popular: false,
    },
    {
      id: "growth",
      name: "GROWTH",
      badge: "MOST POPULAR",
      tagline: "For creators and businesses that need recurring video content.",
      targetAudience: "Active creators, personal brands, and coaches publishing 2-4 reels weekly.",
      priceDisplay: "$499 / month",
      cadence: "Monthly retainer",
      features: [
        "8 to 16 short-form edits per month",
        "Dedicated editor & direct Slack/WhatsApp channel",
        "Advanced kinetic graphics & B-roll research",
        "Custom audio scoring with SFX layering",
        "Hook analysis & script retention consulting",
        "Fast 48-hour draft turnarounds",
        "Priority revision queue",
      ],
      ctaLabel: "Discuss your project",
      popular: true,
    },
    {
      id: "custom",
      name: "CUSTOM",
      tagline: "For bespoke projects, promotional videos, or ongoing editing partnerships.",
      targetAudience: "Agencies, SaaS launches, multi-platform media brands, and high-volume operations.",
      priceDisplay: "CUSTOM",
      cadence: "Tailored scope",
      features: [
        "Multi-format delivery (9:16, 16:9, 1:1, 4:5)",
        "Commercial trailers, ads & course modules",
        "Custom 2D/3D motion graphics & UI animations",
        "Raw footage organization & archiving",
        "White-glove project management & SLA guarantee",
        "Flexible volume scaling on demand",
      ],
      ctaLabel: "Discuss your project",
      popular: false,
    },
  ],
};
