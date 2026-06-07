import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/dashboard", "/app/dashboard/"],
      },
    ],
    sitemap: "https://aicvbuilder.co.ke/sitemap.xml",
  };
}
