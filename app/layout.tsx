import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./yash-theme.css";
import { siteConfig } from "@/data/site-config";
import { CustomCursor } from "@/components/custom-cursor";
import { StructuredData } from "@/components/seo/structured-data";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://zenithdeigitalstudio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZENITH — High-Retention Video Editing Studio & Post-Production",
    template: "%s | ZENITH Studio",
  },
  description:
    "Zenith is a premium video editing studio crafting high-retention short-form reels, YouTube longform, and commercial brand stories for creators and brands.",
  applicationName: "ZENITH Studio",
  category: "Video Editing & Post-Production Agency",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Zenith",
    "Zenith Studio",
    "Zenith Video Editing",
    "Zenith Digital Studio",
    "Zenith Edits",
    "video editing agency",
    "high retention video editor",
    "reels video editing",
    "youtube video editing service",
    "short-form video agency",
    "talking head video editing",
    "commercial post-production",
    "motion graphics",
    "color grading",
    "sound design",
    "podcast video editor",
  ],
  authors: [{ name: "Zenith Studio", url: siteUrl }],
  creator: "Zenith Studio",
  publisher: "Zenith Studio",
  openGraph: {
    title: "ZENITH — High-Retention Video Editing Studio",
    description:
      "Premium short-form reels, YouTube longform, and commercial video editing engineered for high retention and brand impact.",
    url: siteUrl,
    type: "website",
    locale: "en_US",
    siteName: "ZENITH Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZENITH Video Editing Studio — Every Frame Has A Purpose",
        type: "image/jpeg",
      },
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ZENITH Video Editing Studio — Every Frame Has A Purpose",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZENITH — High-Retention Video Editing Studio",
    description:
      "Premium short-form reels, YouTube longform, and commercial video editing engineered for high retention and brand impact.",
    images: ["/og-image.jpg"],
    creator: "@zenith.edits",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "MufU9KtA9LooaSDymDxcVOepNiLXAPkYbGZJrbM-vyc",
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
        <meta
          name="google-site-verification"
          content={
            process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
            "MufU9KtA9LooaSDymDxcVOepNiLXAPkYbGZJrbM-vyc"
          }
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="thumbnail" content={`${siteUrl}/og-image.jpg`} />
        <StructuredData />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('zenith_preloader_shown')) {
                  document.documentElement.classList.add('zenith-skip-preloader');
                }
              } catch (e) {}

              // Failsafe: Automatically dismiss preloader after 1.8s so page is never frozen
              (function() {
                function dismissPreloader() {
                  try {
                    sessionStorage.setItem('zenith_preloader_shown', 'true');
                  } catch (e) {}
                  var pre = document.getElementById('zenith-preloader');
                  if (pre) {
                    pre.style.transition = 'opacity 0.4s ease, visibility 0.4s ease';
                    pre.style.opacity = '0';
                    pre.style.pointerEvents = 'none';
                    setTimeout(function() {
                      if (pre && pre.parentNode) {
                        pre.parentNode.removeChild(pre);
                      }
                    }, 450);
                  }
                }

                // Global failsafe timer
                setTimeout(dismissPreloader, 1800);

                // Click-to-skip failsafe
                document.addEventListener('click', function(e) {
                  if (e.target && (e.target.closest && e.target.closest('#zenith-preloader'))) {
                    dismissPreloader();
                  }
                });

                // Keypress failsafe (Escape or Space to skip)
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
                    dismissPreloader();
                  }
                });
              })();
            `,
          }}
        />
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
