import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume AI — Build Resumes That Get Interviews",
  description:
    "AI-powered resume builder that scores, rewrites, and optimizes your resume for ATS systems. Get more callbacks with GPT-4o powered suggestions.",
  keywords: "AI resume builder, ATS resume, resume optimizer, job application, resume score",
  openGraph: {
    title: "Resume AI — Build Resumes That Get Interviews",
    description: "AI-powered resume builder that scores and optimizes your resume for ATS systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
