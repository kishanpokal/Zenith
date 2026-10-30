"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { VerticalReelsSection } from "@/components/vertical-reels-section";
import { ServicesSection } from "@/components/services-section";
import { BeforeAfter } from "@/components/before-after";
import { ProcessSection } from "@/components/process-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { VideoLightbox } from "@/components/video-lightbox";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgressBar } from "@/components/scroll-progress";
import { CinematicPreloader } from "@/components/preloader";
import { Project } from "@/data/projects";

interface HomeClientViewProps {
  initialProjects: Project[];
  initialSettings: any;
}

export function HomeClientView({
  initialProjects,
  initialSettings,
}: HomeClientViewProps) {
  const [selectedShowreel, setSelectedShowreel] = useState<Project | null>(null);
  const [inquiryPackage, setInquiryPackage] = useState<string>("Talking-Head Reels");

  const heroProject: Project =
    initialProjects.find((p) => p.featured) ||
    initialProjects[0];

  const openHeroShowreel = () => {
    if (initialSettings?.hero?.youtubeId) {
      const isShort =
        initialSettings?.hero?.youtubeUrl?.includes("shorts") ||
        heroProject?.aspectRatio === "9:16";
      setSelectedShowreel({
        id: "hero-showreel",
        title:
          initialSettings.hero.title ||
          (isShort ? "Featured Reel" : "2026 Master Editorial Showreel"),
        youtubeId: initialSettings.hero.youtubeId,
        videoSrc: initialSettings.hero.youtubeUrl,
        aspectRatio: isShort ? "9:16" : "16:9",
        category: isShort ? "Short-Form / Reel" : "Showreel",
        clientContext: "Flagship Showreel",
        description: initialSettings.hero.subheadline || "",
        thumbnail: initialSettings.hero.thumbnail,
      } as Project);
    } else {
      setSelectedShowreel(heroProject);
    }
  };

  const handleSelectPackage = (packageName: string) => {
    setInquiryPackage(packageName);
  };

  const heroAspectRatio: "9:16" | "16:9" =
    initialSettings?.hero?.aspectRatio === "16:9" &&
    !initialSettings?.hero?.youtubeUrl?.includes("shorts")
      ? "16:9"
      : "9:16";

  return (
    <SmoothScroll>
      {/* Studio Ident Preloader */}
      <CinematicPreloader />

      {/* Razor-thin Top Scroll Progress Bar */}
      <ScrollProgressBar />

      <main className="min-h-screen bg-[#09090B] text-[#F4F4F6] selection:bg-[#D4AF37] selection:text-[#09090B]">
        {/* Navigation & Floating Mobile Bar */}
        <Navigation isLightboxOpen={!!selectedShowreel} />

        {/* SECTION 1: Above-the-fold Hero + Instant Showreel Stage */}
        <HeroSection
          onOpenShowreelModal={openHeroShowreel}
          featuredThumbnail={initialSettings?.hero?.thumbnail || heroProject?.thumbnail}
          featuredTitle={initialSettings?.hero?.title || heroProject?.title}
          videoUrl={
            initialSettings?.hero?.youtubeUrl ||
            (heroProject?.youtubeId
              ? `https://www.youtube.com/watch?v=${heroProject.youtubeId}`
              : undefined)
          }
          headline={initialSettings?.hero?.headline}
          headlineHighlight={initialSettings?.hero?.headlineHighlight}
          subheadline={initialSettings?.hero?.subheadline}
          aspectRatio={heroAspectRatio}
        />

        {/* SECTION 2: Curated Work Showcase (16:9 Long-Form & Commercials) */}
        <SelectedWork
          initialProjects={initialProjects}
          onSelectProject={(p) => setSelectedShowreel(p)}
        />

        {/* SECTION 3: Dedicated 9:16 Vertical Reels & Shorts Strip */}
        <VerticalReelsSection
          projects={initialProjects}
          onSelectProject={(p) => setSelectedShowreel(p)}
          retentionReelIds={initialSettings?.retentionReels?.reelIds}
        />

        {/* SECTION 4: Inside the Timeline: The Editing Craft & Interactive Before/After */}
        <BeforeAfter
          headline={initialSettings?.beforeAfter?.headline}
          headlineHighlight={initialSettings?.beforeAfter?.headlineHighlight}
          subheadline={initialSettings?.beforeAfter?.subheadline}
          beforeImage={initialSettings?.beforeAfter?.beforeImage}
          afterImage={initialSettings?.beforeAfter?.afterImage}
          beforeLabel={initialSettings?.beforeAfter?.beforeLabel}
          afterLabel={initialSettings?.beforeAfter?.afterLabel}
          beforeNotice={initialSettings?.beforeAfter?.beforeNotice}
          footerNote={initialSettings?.beforeAfter?.footerNote}
        />

        {/* SECTION 5: Streamlined Services, 4-Step Process & Transparent Packages */}
        <ServicesSection />
        <ProcessSection />
        <PricingSection
          onSelectPackage={handleSelectPackage}
          pricingSettings={initialSettings?.pricing}
        />

        {/* SECTION 6: Client Proof, FAQ & Direct Booking CTA */}
        <TestimonialsSection />
        <FAQSection />
        <ContactSection
          initialPackage={inquiryPackage}
          plans={initialSettings?.pricing?.plans}
          currencySymbol={initialSettings?.pricing?.currencySymbol}
        />

        {/* Footer */}
        <Footer />

        {/* Fullscreen Cinema Video Lightbox */}
        {selectedShowreel && (
          <VideoLightbox
            project={selectedShowreel}
            onClose={() => setSelectedShowreel(null)}
          />
        )}
      </main>
    </SmoothScroll>
  );
}
