# ZENITH — Premium Video Editing Studio Portfolio

A high-performance, dark-mode, editorial video editing portfolio website engineered for **ZENITH**. Inspired by modern cinema workstations and high-retention short-form editors (e.g. Yash Edits), built with Next.js App Router, TypeScript, Tailwind CSS, and HTML5 video architecture.

---

## 📽️ Design & Aesthetic Direction

- **Dark Workstation Aesthetic:** Deep near-black background (`#080808` / `#101010`), subtle dark gray borders (`#1f1f1f`), crisp off-white typography (`#F5F5F2`), and restrained electric lime accents (`#D7FF64`) used strictly for active states, key timecodes, and conversion CTAs.
- **Editor-Inspired Motifs:** Program monitor bezels, running frame-accurate timecodes (`00:00:14:24`), sequence identifiers (`SEQ_01_ZENITH`), V1/V2 video track markers, audio bus meters, and timeline rulers.
- **Native 9:16 Vertical Video Cards:** Optimized for mobile viewing on Instagram Reels, YouTube Shorts, and TikTok.

---

## 🚀 Website Structure & Sections

1. **SECTION A: Navigation (`components/navigation.tsx`)**
   - Original ZENITH wordmark with cut razor badge.
   - Tagline: *"CUT. CREATE. CONNECT."*
   - Smooth-scrolling anchors to Work, Craft, Raw vs Final, Services, Process, Pricing, and FAQ.
   - Prominent electric lime *"Start a Project"* CTA button.
   - Responsive mobile navigation drawer with backdrop blur.

2. **SECTION B: Hero / First Impression (`components/hero-section.tsx`)**
   - Eyebrow: `ZENITH — VIDEO EDITING STUDIO`
   - Headline: *"EVERY FRAME HAS A PURPOSE."*
   - Supporting copy focused on pacing, retention, and storytelling for creators and coaches.
   - Live timecode counter, format specs (`REC 60FPS | 1080x1920 NATIVE | Rec.709`), and program monitor preview.
   - Dual CTAs: *"Explore Our Work ↓"* and *"Start a Project ↗"*.

3. **SECTION C: Selected Work (`components/selected-work.tsx` & `components/project-card.tsx`)**
   - Headline: *"THE WORK SPEAKS."*
   - Interactive category filter tabs:
     - `All Work`
     - `Talking Head`
     - `Business & Education`
     - `Promotional`
     - `Motion Graphics`
   - 9:16 vertical cards with responsive video preview on hover, high-resolution SVG posters, and timecode tags.
   - **Accessible Video Lightbox (`components/video-lightbox.tsx`):**
     - Custom HTML5 scrubber, volume control, time display, and fullscreen.
     - In-depth editorial craft breakdown (pacing style, vocal compression, cut cadence).
     - Esc key support, click-outside dismissal, and scroll-locking.

4. **SECTION D: Editing Craft (`components/editing-craft.tsx`)**
   - Headline: *"GOOD EDITING IS FELT."*
   - 4 interactive editorial modules with real live demos:
     - **Pacing:** Interactive toggle comparing 4.8s raw recording (with hesitations/breaths) vs 1.4s tight Zenith ripple edit.
     - **Storytelling:** 3-beat retention arc breakdown (Hook → Tension → Payoff).
     - **Sound:** Multi-track mixer (Dialogue, SFX/Foley, Underscore Music) with interactive solo/mute toggles.
     - **Visual Clarity:** Layer stack toggles (Base A-Roll, Kinetic Subtitles, Vector Graphics, Punch Zoom).

5. **SECTION E: Raw vs. Final Comparison (`components/before-after.tsx`)**
   - Headline: *"SAME FOOTAGE. DIFFERENT EXPERIENCE."*
   - Interactive draggable split-screen slider comparing flat S-Log3 raw footage (unleveled audio, raw pauses) against the finished Rec.709 master (dynamic zoom, kinetic typography, mastered audio).
   - Fully accessible with keyboard arrow key range navigation.

6. **SECTION F: Services (`components/services-section.tsx`)**
   - 8 specialized short-form editing services:
     1. Short-Form Video Editing
     2. Talking-Head Reels
     3. Captions & Typography
     4. Motion Graphics
     5. B-Roll Integration
     6. Sound Design
     7. Music & Pacing
     8. Promotional Videos
   - Includes editing track roles (e.g. `V1 / PRIMARY CUT`, `A2 / SFX DESIGN`) and concrete deliverables.

7. **SECTION G: Workflow / Process (`components/process-section.tsx`)**
   - 5-step transparent pipeline:
     - `01 — DISCOVERY` (Brand & style alignment)
     - `02 — FOOTAGE REVIEW` (Logging & strongest moment selection)
     - `03 — EDITING` (The retention craft: cuts, captions, sound, grade)
     - `04 — REVIEW` (Timecode-accurate frame review via Frame.io/Loom)
     - `05 — FINAL DELIVERY` (4K/1080p ProRes & H.264 master files)

8. **SECTION H: Why Zenith (`components/why-zenith.tsx`)**
   - Headline: *"CREATIVE THINKING. PRECISE EXECUTION."*
   - Direct comparison matrix contrasting Zenith's dedicated lead-editor model against generic agency/freelancer factories.

9. **SECTION I: Pricing (`components/pricing-section.tsx`)**
   - Headline: *"LET'S FIND THE RIGHT FIT."*
   - 3 configurable package tiers:
     - `STARTER` (Occasional edits or single campaign releases)
     - `GROWTH` (Recurring monthly retainer for active creators)
     - `CUSTOM` (Tailored scope for agencies & product launches)
   - Configuration-driven from `data/pricing.ts` with honest paid test edit footnote.

10. **SECTION J: Testimonials / Client Feedback (`components/testimonials-section.tsx`)**
    - Headline: *"TRUST IS BUILT THROUGH THE WORK."*
    - Honest, clean placeholder explaining that verified case studies are added with client consent. Structured schema ready for immediate addition of client quotes.

11. **SECTION K: FAQ (`components/faq-section.tsx`)**
    - Headline: *"BEFORE WE START."*
    - Accessible accordion answering 7 critical creator questions without overpromising turnaround times or false guarantees.

12. **SECTION L: Final CTA & Functional Contact (`components/contact-section.tsx`)**
    - Headline: *"YOUR FOOTAGE. OUR EDITING. LET'S CREATE SOMETHING GREAT."*
    - Full project inquiry form with:
      - Name, email validation, channel/profile URL, video format selector, budget tier, and footage details.
      - Dual submission routing: Encodes all parameters into a prefilled email (`mailto:`) and WhatsApp click-to-chat link.

13. **SECTION M: Footer (`components/footer.tsx`)**
    - Brand wordmark, quick navigation anchors, direct email, Instagram handle, and dynamic copyright year.

---

## 🛠️ How to Customize Media & Data

All portfolio data is centralized in the `/data` folder so you never have to edit component code to update content:

### 1. Adding or Modifying Projects
Open [`data/projects.ts`](file:///c:/Portfolio/Video-Editing/data/projects.ts):
```typescript
{
  id: "proj-07-your-reel",
  title: "Your Project Title",
  category: "Talking Head", // "Talking Head" | "Business & Education" | "Promotional" | "Motion Graphics"
  clientContext: "Founder / Niche",
  description: "Short editorial description of the cut.",
  duration: "0:45",
  aspectRatio: "9:16",
  thumbnail: "/images/projects/your-poster.jpg", // Place in /public/images/projects/
  videoSrc: "/videos/your-reel.mp4",             // Place in /public/videos/ or use a CDN URL
  editBreakdown: [
    "Dead-space audio ripple trimmed",
    "Dynamic punch-ins on core points",
  ],
  soundDesignNotes: "Vocal mastering + subtle riser accents.",
  pacingStyle: "1.4s average cut duration",
  featured: true,
  published: true,
  timecode: "00:00:45:00",
}
```

### 2. Updating Contact Information & Socials
Open [`data/site-config.ts`](file:///c:/Portfolio/Video-Editing/data/site-config.ts):
```typescript
contact: {
  email: "your-email@zenithedits.com",
  whatsappNumber: "1234567890", // International digits without + or spaces
  whatsappDisplay: "+1 (555) 019-2834",
  instagramHandle: "@zenith.edits",
  instagramUrl: "https://instagram.com/zenith.edits",
  turnaroundNotice: "Direct communication with your lead editor on every cut.",
}
```
You can also supply environment variables in `.env.local`:
```env
NEXT_PUBLIC_CONTACT_EMAIL=your-email@zenithedits.com
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
```

### 3. Updating Pricing Rates
Open [`data/pricing.ts`](file:///c:/Portfolio/Video-Editing/data/pricing.ts):
- Set `showExplicitPrices: true` when you want fixed rates displayed.
- Fill in `priceDisplay` (e.g. `"$1,800 / month"`).

---

## 💻 Local Development Commands

To run the application locally:

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run in development mode (hot reloading)
npm run dev

# 3. Create an optimized production build
npm run build

# 4. Start the production server
npm run start -- -p 3000
```

---

## ☁️ Deployment to Vercel

This project is built using standard Next.js 14 App Router and is 100% compatible with Vercel zero-configuration deployment:

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project**.
3. Import your repository.
4. Set the Framework Preset to **Next.js** (detected automatically).
5. (Optional) Add your environment variables:
   - `NEXT_PUBLIC_CONTACT_EMAIL`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
6. Click **Deploy**. Vercel will run `npm run build` and deploy your site to their edge network.
