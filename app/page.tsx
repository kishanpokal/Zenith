"use client";

import React, { useState, useEffect } from "react";
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
import { projects, Project } from "@/data/projects";

export default function Home() {
  const [selectedShowreel, setSelectedShowreel] = useState<Project | null>(null);
  const [inquiryPackage, setInquiryPackage] = useState<string>("Talking-Head Reels");
  const [heroProject, setHeroProject] = useState<Project>(projects[0]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function loadSettingsAndHero() {
      try {
        const [settingsRes, projectsRes] = await Promise.all([
          fetch("/api/settings"),
          fetch("/api/projects"),
        ]);

        if (settingsRes.ok) {
          const s = await settingsRes.json();
          setSettings(s);
        }

        if (projectsRes.ok) {
          const list = await projectsRes.json();
          if (Array.isArray(list) && list.length > 0) {
            const featured = list.find((p: Project) => p.featured) || list[0];
            setHeroProject(featured);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadSettingsAndHero();
  }, []);

  const openHeroShowreel = () => {
    if (settings?.hero?.youtubeId) {
      setSelectedShowreel({
        id: "hero-showreel",
        title: settings.hero.title || "2026 Master Editorial Showreel",
        youtubeId: settings.hero.youtubeId,
        videoSrc: settings.hero.youtubeUrl,
        aspectRatio: "16:9",
        category: "Showreel",
        clientContext: "Flagship Showreel",
        description: settings.hero.subheadline || "",
        thumbnail: settings.hero.thumbnail,
      } as Project);
    } else {
      setSelectedShowreel(heroProject);
    }
  };

  const handleSelectPackage = (packageName: string) => {
    setInquiryPackage(packageName);
  };

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
          featuredThumbnail={settings?.hero?.thumbnail || heroProject?.thumbnail}
          featuredTitle={settings?.hero?.title || heroProject?.title}
          videoUrl={settings?.hero?.youtubeUrl || (heroProject?.youtubeId ? `https://www.youtube.com/watch?v=${heroProject.youtubeId}` : undefined)}
          headline={settings?.hero?.headline}
          headlineHighlight={settings?.hero?.headlineHighlight}
          subheadline={settings?.hero?.subheadline}
        />

        {/* SECTION 2: Curated Work Showcase (16:9 Long-Form & Commercials) */}
        <SelectedWork onSelectProject={(p) => setSelectedShowreel(p)} />

        {/* SECTION 3: Dedicated 9:16 Vertical Reels & Shorts Strip */}
        <VerticalReelsSection onSelectProject={(p) => setSelectedShowreel(p)} />

        {/* SECTION 4: Inside the Timeline: The Editing Craft & Interactive Before/After + 3 Pillars */}
        <BeforeAfter
          headline={settings?.beforeAfter?.headline}
          headlineHighlight={settings?.beforeAfter?.headlineHighlight}
          subheadline={settings?.beforeAfter?.subheadline}
          beforeImage={settings?.beforeAfter?.beforeImage}
          afterImage={settings?.beforeAfter?.afterImage}
          beforeLabel={settings?.beforeAfter?.beforeLabel}
          afterLabel={settings?.beforeAfter?.afterLabel}
          beforeNotice={settings?.beforeAfter?.beforeNotice}
          footerNote={settings?.beforeAfter?.footerNote}
        />

        {/* SECTION 5: Streamlined Services, 4-Step Process & Transparent Packages */}
        <ServicesSection />
        <ProcessSection />
        <PricingSection onSelectPackage={handleSelectPackage} />

        {/* SECTION 6: Client Proof, FAQ & Direct Booking CTA */}
        <TestimonialsSection />
        <FAQSection />
        <ContactSection initialPackage={inquiryPackage} />

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