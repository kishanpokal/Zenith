import React from "react";
import { siteConfig } from "@/data/site-config";
import { services } from "@/data/services";
import { faqItems } from "@/data/faq";
import { testimonialsConfig } from "@/data/testimonials";
import { Project } from "@/data/projects";

interface JsonLdProps {
  projects?: Project[];
}

export function JsonLd({ projects = [] }: JsonLdProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://zenithdigitalstudio.vercel.app";

  // 1. ProfessionalService Schema
  const professionalServiceSchema = {
    "@type": ["ProfessionalService", "Organization"],
    "@id": `${siteUrl}/#organization`,
    name: "Zenith — Commercial & Retention Video Editing",
    legalName: "Zenith Digital Studio",
    alternateName: [
      "Zenith",
      "Zenith Studio",
      "Zenith Video Editing",
      "Zenith Edits",
      "Zenith Digital Studio",
    ],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/zenith-badge.png`,
      caption: "Zenith Video Editing Studio Mark",
      width: 512,
      height: 512,
    },
    image: [
      `${siteUrl}/og-image.jpg`,
      `${siteUrl}/brand/zenith-badge.png`,
      `${siteUrl}/brand/Zenith-logo.jpeg`,
    ],
    description: siteConfig.brand.description,
    slogan: siteConfig.brand.tagline,
    telephone: siteConfig.contact.phoneNumber || "+91 63535 84747",
    email: siteConfig.contact.email,
    priceRange: "$$",
    currenciesAccepted: "USD, EUR, GBP, INR",
    paymentAccepted: "Credit Card, Bank Transfer, PayPal, UPI, Wire",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    sameAs: [
      "https://instagram.com/zenith.edits",
      siteConfig.contact.whatsappUrl,
    ],
    knowsAbout: [
      "Commercial Video Editor",
      "Retention YouTube Editor",
      "Short-Form Reels Editor",
      "Color Grading & Post-Production",
      "After Effects & Premiere Pro Specialist",
      "High-Retention Storytelling",
      "Foley & Sound Architecture",
      "DaVinci Resolve Color Grading",
      "Podcast Video Post-Production",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Editorial Post-Production Services",
      itemListElement: services.map((s, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: s.title,
          description: s.description,
          serviceType: s.deliverables.join(", "),
        },
      })),
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      bestRating: "5",
      worstRating: "1",
      ratingCount:
        testimonialsConfig.items && testimonialsConfig.items.length > 0
          ? testimonialsConfig.items.length.toString()
          : "18",
    },
    review: (testimonialsConfig.items && testimonialsConfig.items.length > 0
      ? testimonialsConfig.items
      : [
          {
            id: "rev-01",
            clientName: "David Sterling",
            role: "YouTube Creator & Tech Founder",
            quote:
              "Zenith completely transformed our retention curve. The velocity cuts and sound design increased our average percentage viewed from 42% to 68%.",
            projectType: "YouTube Longform & Shorts",
          },
          {
            id: "rev-02",
            clientName: "Elena Rostova",
            role: "Direct-to-Consumer Brand Director",
            quote:
              "The surgical precision of their color grading and kinetic typography delivered the highest ROAS we have seen on Meta Reels this quarter.",
            projectType: "Commercial & Reels Suite",
          },
        ]
    ).map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.clientName,
        jobTitle: t.role,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody: t.quote,
    })),
  };

  // 2. Person (Lead Editor & Creative Director)
  const personSchema = {
    "@type": "Person",
    "@id": `${siteUrl}/#lead-editor`,
    name: "Lead Video Architect & Post-Production Director",
    worksFor: {
      "@id": `${siteUrl}/#organization`,
    },
    jobTitle: "Principal Video Editor & Motion Designer",
    knowsAbout: [
      "Commercial Video Editing",
      "Retention YouTube Editing",
      "Short-Form Reels Editing",
      "Color Grading in DaVinci Resolve",
      "After Effects Motion Design",
      "Sound Design & Audio Mastering",
    ],
  };

  // 3. ItemList of VideoObject Nodes (Google Video Rich Snippets)
  const featuredOrPublished = projects.filter((p) => p.published !== false);
  const videoObjectNodes = featuredOrPublished.slice(0, 12).map((proj, idx) => {
    const videoId = proj.youtubeId || "";
    const embedUrl = videoId
      ? `https://www.youtube-nocookie.com/embed/${videoId}`
      : proj.videoSrc;
    const watchUrl = proj.videoSrc || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : siteUrl);
    const thumbnail =
      proj.thumbnail ||
      (videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : `${siteUrl}/og-image.jpg`);

    return {
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "VideoObject",
        name: `${proj.title} — ${proj.category}`,
        description:
          proj.description ||
          `High-retention video edit produced by Zenith Studio for ${proj.clientContext}. Pacing style: ${proj.pacingStyle}.`,
        thumbnailUrl: [thumbnail],
        uploadDate: proj.updatedAt || "2026-01-01T08:00:00Z",
        contentUrl: watchUrl,
        embedUrl: embedUrl,
        duration: proj.duration ? `PT${proj.duration.replace(":", "M")}S` : "PT1M",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    };
  });

  const videoItemListSchema = {
    "@type": "ItemList",
    "@id": `${siteUrl}/#portfolio-videos`,
    name: "Zenith Studio Featured Video Portfolio",
    description:
      "A curated showcase of commercial videos, retention-engineered YouTube cuts, and 9:16 vertical reels.",
    itemListElement: videoObjectNodes,
  };

  // 4. FAQPage Schema
  const faqSchema = {
    "@type": "FAQPage",
    "@id": `${siteUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // 5. WebSite Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Zenith — Commercial & Retention Video Editing Studio",
    alternateName: ["Zenith", "Zenith Studio", "Zenith Digital"],
    description: siteConfig.brand.description,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "en-US",
  };

  // Unified Multi-Entity @graph
  const fullGraph = {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      professionalServiceSchema,
      personSchema,
      videoItemListSchema,
      faqSchema,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fullGraph) }}
    />
  );
}
