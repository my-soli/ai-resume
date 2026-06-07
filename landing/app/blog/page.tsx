import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CV Tips & Career Advice Blog | AI CV Builder Kenya",
  description: "Free CV writing tips, ATS guides, and career advice for Kenyan job seekers. Learn how to write a winning CV for banking, tech, NGOs, and more.",
};

const articles = [
  {
    slug: "how-to-write-cv-banking-job-kenya",
    title: "How to Write a CV for a Banking Job in Kenya (2026 Guide)",
    excerpt: "Banks in Kenya receive hundreds of CVs for every vacancy. Learn the exact format, keywords, and structure that Kenyan bank recruiters look for — and how AI can do it in seconds.",
    date: "June 2026",
    readTime: "5 min read",
    category: "Industry Guides",
    featured: true,
  },
  {
    slug: "what-is-ats-why-cv-getting-rejected",
    title: "What is ATS and Why Your CV Keeps Getting Rejected",
    excerpt: "Most large employers in Kenya use Applicant Tracking Systems to filter CVs automatically. This guide explains exactly how ATS works and what you can do to pass the filter every time.",
    date: "June 2026",
    readTime: "4 min read",
    category: "ATS Guide",
    featured: true,
  },
  {
    slug: "best-cv-format-fresh-graduates-kenya-2026",
    title: "Best CV Format for Fresh Graduates in Kenya 2026",
    excerpt: "No experience? No problem. This guide shows fresh graduates the exact CV format that works in Kenya — and how to make your education, projects, and internships stand out.",
    date: "June 2026",
    readTime: "6 min read",
    category: "Graduate Guides",
    featured: true,
  },
  {
    slug: "how-to-use-ai-write-cv-minutes",
    title: "How to Use AI to Write Your CV in Minutes",
    excerpt: "Step-by-step guide to generating a professional, ATS-optimized CV using AI CV Builder. From entering your details to downloading a polished PDF — in under 10 minutes.",
    date: "June 2026",
    readTime: "3 min read",
    category: "How-To",
    featured: false,
  },
  {
    slug: "cv-vs-resume-kenya",
    title: "CV vs Resume: What Kenyan Employers Actually Want",
    excerpt: "Is it called a CV or a resume in Kenya? What format do local employers prefer? We break down the differences and give you the template that works across industries.",
    date: "June 2026",
    readTime: "4 min read",
    category: "Basics",
    featured: false,
  },
  {
    slug: "cover-letter-kenya-guide",
    title: "How to Write a Cover Letter That Gets Interviews in Kenya",
    excerpt: "A great cover letter can set you apart in Kenya's competitive job market. Learn the proven structure, what to include, and how AI can write yours in 30 seconds.",
    date: "June 2026",
    readTime: "5 min read",
    category: "Cover Letters",
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "Industry Guides": "bg-blue-50 text-blue-700",
  "ATS Guide": "bg-red-50 text-red-700",
  "Graduate Guides": "bg-green-50 text-green-700",
  "How-To": "bg-indigo-50 text-indigo-700",
  "Basics": "bg-gray-100 text-gray-700",
  "Cover Letters": "bg-violet-50 text-violet-700",
};

export default function BlogPage() {
  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-white border-b border-gray-100 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              CV Tips & Career Advice
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Free guides for Kenyan job seekers — from writing your first CV to passing ATS systems at top companies.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
          {/* Featured articles */}
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Featured</h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col"
              >
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-3 ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 flex-1">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{article.date}</span>
                  <span>{article.readTime}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* More articles */}
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">More Articles</h2>
          <div className="space-y-4">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[article.category]}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{article.title}</h3>
                </div>
                <svg className="w-5 h-5 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Ready to build your CV?</h3>
            <p className="text-indigo-100 mb-6">Let AI write it for you — free, in minutes, right in your browser.</p>
            <Link
              href="/app/register"
              className="inline-block bg-white text-indigo-700 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              Build My CV Free →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
