export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category?: string;
}

export const faqItems: FAQItem[] = [
  {
    id: "faq-01",
    number: "01",
    question: "What type of videos do you edit?",
    answer:
      "We specialize primarily in high-retention short-form video for Instagram Reels, YouTube Shorts, and TikTok. This includes talking-head videos, educational breakdowns, podcast highlights, founder commentary, and promotional product teasers. We also edit selected 16:9 long-form YouTube content and commercial trailers upon request.",
    category: "Scope",
  },
  {
    id: "faq-02",
    number: "02",
    question: "What footage should I provide?",
    answer:
      "You can send raw recordings straight from your camera, phone, or podcast studio via Google Drive, Dropbox, or Frame.io. High-resolution footage (1080p or 4K) with clear, unclipped audio yields the best result. Providing brand assets (fonts, color palette, logos) helps us tailor the aesthetic immediately.",
    category: "Assets",
  },
  {
    id: "faq-03",
    number: "03",
    question: "Can you follow my existing editing style?",
    answer:
      "Yes. If you already have established brand guidelines, motion templates, or a signature visual tone, we will strictly adhere to them. If you are seeking a fresh, elevated visual direction, we can help define an editorial identity tailored to your audience.",
    category: "Style",
  },
  {
    id: "faq-04",
    number: "04",
    question: "Can you create custom motion graphics?",
    answer:
      "Yes. We design custom kinetic typography, vector diagram builds, UI screen tracking, animated callouts, and lower thirds directly inside After Effects. We do not rely on generic, repetitive plug-and-play preset packs.",
    category: "Production",
  },
  {
    id: "faq-05",
    number: "05",
    question: "How do revisions work?",
    answer:
      "Every project includes structured revision rounds using timecode-accurate review tools like Frame.io. You can click on the exact second where a tweak is needed and leave notes. Minor timing tweaks, typo fixes, or caption adjustments are addressed promptly to ensure the final edit meets your standards.",
    category: "Process",
  },
  {
    id: "faq-06",
    number: "06",
    question: "How do I receive the final video?",
    answer:
      "Final edits are delivered via cloud download links in full resolution (ProRes or high-bitrate H.264), color-graded and audio-leveled for mobile platforms. We also supply native thumbnail cover frames and SRT caption files whenever requested.",
    category: "Delivery",
  },
  {
    id: "faq-07",
    number: "07",
    question: "How can I request a quote?",
    answer:
      "Use the 'Start a Project' form below to share details about your footage volume, publishing frequency, and preferred style. We will review your requirements and respond with a clear, transparent project proposal or monthly retainer scope within 24 hours.",
    category: "Inquiries",
  },
];
