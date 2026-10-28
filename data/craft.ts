export interface CraftModule {
  id: "pacing" | "storytelling" | "sound" | "clarity";
  number: string;
  title: string;
  headline: string;
  quote: string;
  description: string;
  technicalMetric: string;
  keyPoints: string[];
}

export const craftModules: CraftModule[] = [
  {
    id: "pacing",
    number: "01",
    title: "PACING",
    headline: "THE CUT MUST MATCH THE MIND",
    quote: "Every cut has a reason. Remove dead space and keep the story moving.",
    description:
      "A split-second delay between thoughts allows the viewer to scroll. We inspect the audio waveform frame-by-frame, trimming pauses and micro-breaths while preserving human warmth.",
    technicalMetric: "Average cut duration: 1.2s - 2.4s tuned to topic cognitive weight",
    keyPoints: [
      "Zero-frame audio gap elimination",
      "Rhythmic velocity curves: fast setups, steady insights",
      "Punch-ins on critical emphasis nouns",
      "Pacing modulation to prevent sensory fatigue",
    ],
  },
  {
    id: "storytelling",
    number: "02",
    title: "STORYTELLING",
    headline: "NARRATIVE BEFORE NOISE",
    quote: "Structure the message so every moment leads naturally to the next.",
    description:
      "Flashy effects cannot rescue a muddled idea. We restructure your raw recording around a 3-act micro-arc: the magnetic hook, the logical tension/insight, and the clean payoff.",
    technicalMetric: "Hook latency: < 0.6s to first visual/audio change",
    keyPoints: [
      "Front-loaded value hook in the first 1.5 seconds",
      "Open loop questions resolved at the midpoint",
      "Logical visual progression supporting each premise",
      "Seamless call-to-action transition without drop-off",
    ],
  },
  {
    id: "sound",
    number: "03",
    title: "SOUND",
    headline: "AUDIO IS 50% OF THE SCREEN",
    quote: "Music, ambience, and sound effects add depth without overwhelming the message.",
    description:
      "Poor audio destroys credibility faster than low resolution. We treat spoken dialogue with multi-band compression, denoise room acoustics, and sculpt tactile foley effects.",
    technicalMetric: "Integrated Dialogue LUFS: -14 LUFS with True Peak -1.0 dBFS",
    keyPoints: [
      "Studio vocal mastering & de-essing",
      "Sidechain ducking so music never drowns the voice",
      "Tactile SFX: paper clicks, tape stops, subtle sub-drops",
      "Sound placement aligned precisely on cut markers",
    ],
  },
  {
    id: "clarity",
    number: "04",
    title: "VISUAL CLARITY",
    headline: "ILLUSTRATE, DON'T DISTRACT",
    quote: "Captions, B-roll, and motion graphics make information easier to follow.",
    description:
      "Every graphic element must reinforce understanding. We eliminate clutter in favor of crisp typography, clean vector diagrams, and contextual B-roll that anchors abstract concepts.",
    technicalMetric: "Safe-zone aligned: zero overlap with platform UI controls",
    keyPoints: [
      "Bespoke kinetic typography styled to creator identity",
      "Vector UI mockups and highlighted document scans",
      "Color-coded conceptual cues throughout the timeline",
      "High-contrast readability on mobile screens in sunlight",
    ],
  },
];
