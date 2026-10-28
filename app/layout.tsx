import type { Metadata, Viewport } from "next";
import { Montserrat, JetBrains_Mono, Instrument_Serif, Barlow_Condensed, Outfit } from "next/font/google";
import "./globals.css";
import "./yash-theme.css";
import { siteConfig } from "@/data/site-config";
import { CustomCursor } from "@/components/custom-cursor";

const outfitFont = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const displayFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

const serifFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const condensedFont = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-condensed",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const sansFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.brand.name} — Premium Video Editing Studio`,
  description: siteConfig.brand.subheadline,
  metadataBase: new URL("https://zenithedits.com"),
  keywords: [
    "video editing",
    "short-form video editor",
    "instagram reels editor",
    "youtube shorts editor",
    "talking head video editing",
    "motion graphics",
    "creator video editing",
    "zenith studio",
  ],
  authors: [{ name: "Zenith Studio" }],
  openGraph: {
    title: `${siteConfig.brand.name} — Premium Video Editing Studio`,
    description: siteConfig.brand.subheadline,
    type: "website",
    locale: "en_US",
    siteName: siteConfig.brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} — Premium Video Editing Studio`,
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
  themeColor: "#080808",
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
    <html lang="en" className={`${outfitFont.variable} ${displayFont.variable} ${serifFont.variable} ${condensedFont.variable} ${sansFont.variable} ${monoFont.variable} dark scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-primary min-h-screen selection:bg-accent selection:text-black antialiased font-sans">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
