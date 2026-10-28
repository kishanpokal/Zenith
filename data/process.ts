export interface ProcessStep {
  step: string;
  phase: string;
  title: string;
  summary: string;
  description: string;
  editorTooling: string;
  timelineEstimate: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    phase: "DISCOVERY",
    title: "Brand & Style Alignment",
    summary: "Understand the brand, audience, goals, and preferred editing style.",
    description:
      "We begin by reviewing your existing content, ideal viewer persona, visual references, and brand guidelines. We establish typography rules, color accents, and sound personality before touching a single timeline.",
    editorTooling: "Style Guide & Asset Ingest",
    timelineEstimate: "Day 1",
  },
  {
    step: "02",
    phase: "FOOTAGE REVIEW",
    title: "Logging & Moment Selection",
    summary: "Review recordings, references, and brand assets to identify the strongest moments.",
    description:
      "You upload your raw recordings via Google Drive, Dropbox, or Frame.io. We comb through takes, discard false starts, select the most energetic deliveries, and identify the highest-converting hook sentences.",
    editorTooling: "Assembly Selects & Transcript Tagging",
    timelineEstimate: "Day 1 - 2",
  },
  {
    step: "03",
    phase: "EDITING",
    title: "The Retention Craft",
    summary: "Build the story using precise cuts, pacing, captions, B-roll, and sound design.",
    description:
      "Our core craftsmanship phase. We sculpt the A-roll cuts, implement dynamic kinetic typography, track motion graphics, weave contextual B-roll, and master multi-track audio with custom SFX and ducked music.",
    editorTooling: "Premiere Pro / After Effects / DaVinci Resolve",
    timelineEstimate: "Day 2 - 3",
  },
  {
    step: "04",
    phase: "REVIEW",
    title: "Collaborative Fine-Tuning",
    summary: "Share the draft and collect the client's feedback.",
    description:
      "We share a private, timecode-accurate review link (Frame.io or Loom). You can click directly on any frame to leave notes or request adjustments, ensuring crystal-clear turnaround without confusion.",
    editorTooling: "Timecode-Accurate Frame Review",
    timelineEstimate: "Day 3 - 4",
  },
  {
    step: "05",
    phase: "FINAL DELIVERY",
    title: "Ready-To-Publish Master",
    summary: "Deliver the approved video in the agreed format, ready for publication.",
    description:
      "Upon final approval, we export pristine master files tailored to Instagram Reels, TikTok, and YouTube Shorts (ProRes or crisp high-bitrate H.264), along with thumbnail cover frames and caption files if required.",
    editorTooling: "4K/1080p Master Export + Cover Stills",
    timelineEstimate: "Day 4 - 5",
  },
];
