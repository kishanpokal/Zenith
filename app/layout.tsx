import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./yash-theme.css";
import { siteConfig } from "@/data/site-config";
import { CustomCursor } from "@/components/custom-cursor";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const displayFont = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serifFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — Editorial Video Architecture & High-Retention Post-Production`,
  description: siteConfig.brand.subheadline,
  metadataBase: new URL("https://zenithedits.com"),
  keywords: [
    "video editing",
    "editorial post-production",
    "commercial video editor",
    "high retention video",
    "youtube longform editor",
    "reels & shorts editor",
    "motion graphics",
    "color grading",
    "sound design",
  ],
  authors: [{ name: "Zenith Studio" }],
  openGraph: {
    title: `${siteConfig.brand.name} — Editorial Video Architecture`,
    description: siteConfig.brand.subheadline,
    type: "website",
    locale: "en_US",
    siteName: siteConfig.brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} — Editorial Video Architecture`,
    description: siteConfig.brand.subheadline,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${displayFont.variable} ${monoFont.variable} ${serifFont.variable} dark scroll-smooth`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-[#09090B] text-[#F4F4F6] min-h-screen selection:bg-[#D4AF37] selection:text-black antialiased font-sans relative">
        {/* Subtle fixed SVG film grain noise overlay */}
        <div className="bg-film-grain" aria-hidden="true" />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
