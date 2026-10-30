import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./yash-theme.css";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://zenithdigitalstudio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zenith — Commercial & Retention Video Editing",
    template: "%s | Zenith — Commercial & Retention Video Editing",
  },
  description:
    "Zenith is a premium video editing and post-production studio crafting commercial ads, high-retention YouTube longform, and 9:16 vertical reels for elite creators and brands.",
  applicationName: "Zenith Studio",
  category: "Video Editing & Post-Production Agency",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Commercial Video Editor",
    "Retention YouTube Editor",
    "Short-Form Reels Editor",
    "Color Grading & Post-Production",
    "After Effects & Premiere Pro Specialist",
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
    "sound design",
    "foley audio architecture",
    "podcast video editor",
  ],
  authors: [{ name: "Zenith Studio", url: siteUrl }],
  creator: "Zenith Studio",
  publisher: "Zenith Studio",
  openGraph: {
    title: "Zenith — Commercial & Retention Video Editing",
    description:
      "Premium commercial video editing, high-retention YouTube longform, and 9:16 vertical reels engineered for watch time and brand prestige.",
    url: siteUrl,
    type: "website",
    locale: "en_US",
    siteName: "Zenith Video Editing Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zenith Video Editing Studio — Every Frame Has A Purpose",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zenith — Commercial & Retention Video Editing",
    description:
      "Premium commercial video editing, high-retention YouTube longform, and 9:16 vertical reels engineered for watch time and brand prestige.",
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
