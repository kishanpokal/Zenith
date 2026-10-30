import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Featured Video Editing Portfolio & Client Work",
  description:
    "Explore Zenith Studio's client showcase: high-retention short-form reels, YouTube longform edits, talking-head videos, and commercial motion graphics.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: "Portfolio & Client Showcase | ZENITH Studio",
    description:
      "Explore high-retention reels, YouTube videos, and commercial motion graphics crafted by Zenith Studio.",
    url: "/work",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ZENITH Studio Video Editing Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio & Client Showcase | ZENITH Studio",
    description:
      "High-retention video editing showcase for creators and brands.",
    images: ["/og-image.jpg"],
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
