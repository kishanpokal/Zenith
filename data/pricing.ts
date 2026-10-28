export interface PricingPackage {
  id: "starter" | "growth" | "custom";
  name: string;
  badge?: string;
  tagline: string;
  targetAudience: string;
  // If price is null or empty, display honest "Custom scope / Contact for quote"
  priceDisplay?: string | null;
  cadence?: string | null;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
}

export interface PricingConfig {
  showExplicitPrices: boolean; // Set to true once owner configures fixed rates
  currencySymbol: string;
  footnote: string;
  packages: PricingPackage[];
}

export const pricingConfig: PricingConfig = {
  showExplicitPrices: false, // Default honest mode: quotes tailored to project scope
  currencySymbol: "$",
  footnote:
    "Every partnership begins with a paid test edit so you can experience our quality, communication, and turnaround firsthand.",
  packages: [
    {
      id: "starter",
      name: "STARTER",
      tagline: "For clients who need occasional short-form edits.",
      targetAudience: "Creators testing new formats, ad-hoc keynote chops, or single campaign releases.",
      priceDisplay: null, // Editable: e.g. "$450 / batch"
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
      priceDisplay: null, // Editable: e.g. "$1,800 / month"
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
      priceDisplay: null,
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
