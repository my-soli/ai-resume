import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aicvbuilder.co.ke"),
  title: {
    default: "AI CV Builder Kenya — Free AI Resume Builder | AICVBuilder",
    template: "%s | AICVBuilder",
  },
  description:
    "Build a professional, ATS-optimized CV or resume in minutes with AI. Free AI resume builder — generate, improve, and score your CV. Used by job seekers across Kenya and Africa.",
  keywords: [
    "AI CV builder Kenya",
    "AI resume builder",
    "free CV builder Kenya",
    "ATS resume builder",
    "resume builder Africa",
    "CV maker online",
    "AI resume generator",
    "professional CV builder",
    "resume optimizer",
    "job application Kenya",
    "CV writer AI",
    "resume score checker",
  ],
  authors: [{ name: "AICVBuilder" }],
  creator: "AICVBuilder",
  publisher: "AICVBuilder",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  openGraph: {
    title: "AI CV Builder — Free AI-Powered Resume Builder",
    description:
      "Create a job-winning CV in minutes. AI generates, improves, and scores your resume for ATS systems. Free to start.",
    type: "website",
    url: "https://aicvbuilder.co.ke",
    siteName: "AICVBuilder",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI CV Builder — Free AI Resume Builder",
    description: "Generate, improve, and score your CV with AI. Free to start.",
    creator: "@aicvbuilder",
  },
  alternates: {
    canonical: "https://aicvbuilder.co.ke",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "AICVBuilder",
  "url": "https://aicvbuilder.co.ke",
  "description": "Free AI-powered CV and resume builder. Generate, improve, and score your resume for ATS systems.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free plan — 5 AI operations per month",
  },
  "featureList": [
    "AI Resume Generation",
    "ATS Score Checker",
    "Resume Improvement",
    "PDF Export",
    "Multiple Resume Templates",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
