import { MetadataRoute } from "next";

const blogSlugs = [
  "how-to-write-cv-banking-job-kenya",
  "what-is-ats-why-cv-getting-rejected",
  "best-cv-format-fresh-graduates-kenya-2026",
  "how-to-use-ai-write-cv-minutes",
  "cv-vs-resume-kenya",
  "cover-letter-kenya-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aicvbuilder.co.ke";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/app/register`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/app/login`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...blogSlugs.map((slug) => ({
      url: `${base}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
