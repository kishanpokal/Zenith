"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { SelectedWork } from "@/components/selected-work";
import { PaceBreak } from "@/components/pace-break";
import { ServicesSection } from "@/components/services-section";
import { BeforeAfter } from "@/components/before-after";
import { PhilosophyBreak } from "@/components/philosophy-break";
import { ProcessSection } from "@/components/process-section";
import { WhyZenith } from "@/components/why-zenith";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FAQSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { VideoLightbox } from "@/components/video-lightbox";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgressBar } from "@/components/scroll-progress";
import { CinematicPreloader } from "@/components/preloader";
import { CuttingSeam } from "@/components/animations/cutting-seam";
import { projects, Project } from "@/data/projects";

export default function Home() {
  const [selectedShowreel, setSelectedShowreel] = useState<Project | null>(null);
  const [inquiryPackage, setInquiryPackage] = useState<string>("Talking-Head Reels");
  const [heroProject, setHeroProject] = useState<Project>(projects[0]);

  useEffect(() => {
    async function loadHeroProject() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            const featured = list.find((p: Project) => p.featured) || list[0];
            setHeroProject(featured);
          }
        }
      } catch (err) {
        // Fallback to default
      }
    }
    loadHeroProject();
  }, []);

  const openHeroShowreel = () => {
    setSelectedShowreel(heroProject);
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

      <main className="min-h-screen bg-[#050505] text-white selection:bg-[#D7FF64] selection:text-[#050505]">
        {/* SECTION A: Navigation */}
        <Navigation />

        {/* SECTION B: Hero Section */}
        <HeroSection
          onOpenShowreelModal={openHeroShowreel}
          featuredThumbnail={heroProject?.thumbnail}
          featuredTitle={heroProject?.title}
        />

        {/* SECTION C: SC 01 — Selected Work */}
        <SelectedWork />

        {/* SECTION D: SC 02 — Editing Principles & Four Pillars */}
        <PaceBreak />

        {/* Elegant Chapter Marker */}
        <CuttingSeam label="SC 03 — CAPABILITIES & CRAFT" timecode="00:01:15:00" />

        {/* SECTION E: SC 03 — Services (Twelve Disciplines) */}
        <ServicesSection />

        {/* SECTION F: Raw vs. Final (Draggable Playhead Split Viewer) */}
        <BeforeAfter />

        {/* SECTION G: Philosophy Statement Break */}
        <PhilosophyBreak />

        {/* Elegant Chapter Marker */}
        <CuttingSeam label="SC 04 — SEVEN-STAGE PIPELINE" timecode="00:02:10:00" />

        {/* SECTION H: SC 04 — Process */}
        <ProcessSection />

        {/* SECTION I: SC 05 — The Difference (Why Us) */}
        <WhyZenith />

        {/* SECTION J: SC 06 — Packages & Investment */}
        <PricingSection onSelectPackage={handleSelectPackage} />

        {/* SECTION K: Client Feedback */}
        <TestimonialsSection />

        {/* SECTION L: FAQ */}
        <FAQSection />

        {/* SECTION M: Final CTA & Contact */}
        <ContactSection initialPackage={inquiryPackage} />

        {/* SECTION N: Footer */}
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