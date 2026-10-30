import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://zenithdigitalstudio.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/work"],
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/work"],
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/work"],
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
