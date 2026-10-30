import React from "react";
import { siteConfig } from "@/data/site-config";

export function StructuredData() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://zenithdigitalstudio.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "ZENITH Studio — High-Retention Video Editing",
    alternateName: [
      "ZENITH",
      "Zenith Studio",
      "Zenith Video Editing",
      "Zenith Digital Studio",
      "Zenith Edits",
    ],
    description: siteConfig.brand.description,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-US",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: "Zenith Video Editing Studio",
    legalName: "Zenith Video Editing Studio",
    alternateName: ["ZENITH", "Zenith Studio", "Zenith Edits", "Zenith Digital"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/zenith-badge.png`,
      caption: "Zenith Video Editing Studio Logo",
      width: 512,
      height: 512,
    },
    image: [
      `${siteUrl}/og-image.jpg`,
      `${siteUrl}/brand/zenith-badge.png`,
      `${siteUrl}/brand/Zenith-logo.jpeg`,
    ],
    description:
      "Zenith is a premium video editing studio crafting high-retention short-form reels, talking-head videos, motion graphics, and brand stories for creators and brands.",
    slogan: siteConfig.brand.tagline,
    telephone: siteConfig.contact.phoneNumber || "+91 63535 84747",
    email: siteConfig.contact.email,
    priceRange: "$$",
    currenciesAccepted: "USD, EUR, GBP, INR",
    paymentAccepted: "Credit Card, Bank Transfer, PayPal, UPI",
    sameAs: [
      "https://instagram.com/zenith.edits",
      siteConfig.contact.whatsappUrl,
    ],
    knowsAbout: [
      "Video Editing",
      "Short-form Reels & TikTok Post-Production",
      "YouTube Longform Video Editing",
      "Color Grading in DaVinci Resolve",
      "Sound Design & Dialogue Mastering",
      "Motion Graphics & Visual Architecture",
      "Podcast Video Production",
    ],
    serviceArea: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Editorial Post-Production Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "High-Retention Reels & Shorts Editing",
            description:
              "Vertical 9:16 cuts with dynamic captions, sound design, pacing, and motion graphics engineered for maximum viewer retention.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "YouTube Longform Post-Production",
            description:
              "Engaging A-roll storytelling, B-roll animation, chapter grading, and retention-focused editorial architecture.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Commercial & Brand Video Editing",
            description:
              "Broadcast-ready promotional videos, product launches, and brand stories with cinema-grade color and audio master.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "DaVinci Color Grading & Dialogue Mastering",
            description:
              "Rec.709 & DaVinci Wide Gamut grading, studio noise removal, and 48kHz 24-bit True Peak leveled audio.",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of videos do you edit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We edit short-form Reels, TikToks, YouTube Shorts, podcasts, talking-head videos, and long-form YouTube videos. All videos are edited to keep viewers watching longer.",
        },
      },
      {
        "@type": "Question",
        name: "How do I send my raw video files?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can upload your video files to Google Drive, Dropbox, or OneDrive and share the link with us. It takes less than 2 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Can you match my brand or channel style?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Share 2–3 links or past videos you like, and we will match your exact font, colors, subtitle style, and cut pacing.",
        },
      },
      {
        "@type": "Question",
        name: "How do revisions work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We send you a private preview link where you can watch the video and leave notes. We make quick edits until you are 100% happy with the final video.",
        },
      },
      {
        "@type": "Question",
        name: "Do you include sound effects and music?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every video includes sound effects (whooshes, pops, impacts) and clean background music that fits your content without copyright strikes.",
        },
      },
      {
        "@type": "Question",
        name: "How fast is delivery?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "First cuts are delivered within 24 to 48 hours so you can post consistently without delays.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
