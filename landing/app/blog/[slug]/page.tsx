import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const articles: Record<string, {
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  "how-to-write-cv-banking-job-kenya": {
    title: "How to Write a CV for a Banking Job in Kenya (2026 Guide)",
    description: "Banks in Kenya receive hundreds of CVs for every vacancy. Learn the exact format, keywords, and structure that Kenyan bank recruiters look for.",
    date: "June 2026",
    readTime: "5 min read",
    category: "Industry Guides",
    content: `
Banking is one of the most competitive job markets in Kenya. Tier 1 banks like KCB, Equity, and Cooperative Bank receive thousands of applications for every vacancy. Most of these CVs never reach a human recruiter — they are filtered out by ATS software first.

## What Kenyan Bank Recruiters Look For

Kenyan banks typically look for candidates who can demonstrate:

- **Numerical accuracy and analytical thinking** — Quantify everything. "Managed KES 2.3M portfolio" beats "Managed client portfolios."
- **Compliance awareness** — Mention familiarity with CBK regulations, KYC procedures, AML policies
- **Customer service orientation** — Kenyan banks are very customer-centric
- **Professional qualifications** — ACCA, CPA-K, CFA, or banking-specific certifications carry significant weight

## The Right CV Format for Banking in Kenya

**Length:** 1-2 pages maximum. Kenyan banks discard 3-page CVs immediately.

**Structure:**
1. Name and contact details (top center)
2. Professional summary (3 sentences max)
3. Work experience (achievements, not duties)
4. Education and professional qualifications
5. Skills (technical and soft skills)
6. References (available on request)

## ATS Keywords for Banking CVs in Kenya

Include these naturally in your CV:
- Financial analysis, risk management, credit assessment
- KYC, AML, compliance, regulatory
- Customer relationship management, portfolio management
- Excel, SQL, core banking systems (Temenos, Finacle, Flexcube)
- CBK regulations, Basel III

## How AI CV Builder Can Help

AI CV Builder automatically identifies the right banking keywords for your CV, rewrites your bullet points with quantified achievements, and scores your CV against ATS systems — all in under 2 minutes.

Start free at aicvbuilder.co.ke — no account required to try the ATS scorer.
    `.trim(),
  },
  "what-is-ats-why-cv-getting-rejected": {
    title: "What is ATS and Why Your CV Keeps Getting Rejected",
    description: "Most large employers in Kenya use Applicant Tracking Systems to filter CVs automatically. Here's how to beat ATS every time.",
    date: "June 2026",
    readTime: "4 min read",
    category: "ATS Guide",
    content: `
You've applied for 50 jobs and heard back from 2. Your CV looks great — professionally designed, well-written, clearly formatted. So why is no one calling?

The answer is almost certainly **ATS — Applicant Tracking System**.

## What is ATS?

An Applicant Tracking System is software that most medium and large employers use to automatically filter job applications before a human recruiter ever sees them. In Kenya, organizations like Safaricom, KCB, Equity Bank, KPMG, and most NGOs use ATS tools.

The system scans your CV for specific keywords, qualifications, and formatting patterns. If your CV doesn't match, it gets rejected automatically — even if you're perfectly qualified.

## Why Your CV is Getting Rejected

**1. Missing keywords**
ATS systems match your CV against the job description word for word. If the job says "Python programming" and your CV says "coding in Python," the system might not match them.

**2. Wrong file format**
Always submit a .docx or simple PDF. Designed PDFs with tables, columns, and graphics often fail to parse correctly in ATS systems.

**3. No measurable achievements**
ATS scores CVs partly on how specific and achievement-oriented your bullet points are. "Responsible for sales" scores lower than "Grew sales revenue by 34% in Q1 2025."

**4. Missing standard section headers**
ATS systems look for standard headers: Work Experience, Education, Skills. Creative headers like "My Journey" or "What I've Done" often cause parsing failures.

## How to Fix Your CV for ATS

1. Use the exact language from the job description
2. Stick to a single-column, plain text format
3. Use standard section headers
4. Quantify every achievement
5. Include both acronyms and full forms (e.g., "AML (Anti-Money Laundering)")

## Check Your ATS Score Now

AI CV Builder scores your CV against ATS systems and shows you exactly what to fix. Free to try — no account required.
    `.trim(),
  },
  "best-cv-format-fresh-graduates-kenya-2026": {
    title: "Best CV Format for Fresh Graduates in Kenya 2026",
    description: "No experience? No problem. Here's the exact CV format that works for Kenyan graduates — and how to make your education and projects shine.",
    date: "June 2026",
    readTime: "6 min read",
    category: "Graduate Guides",
    content: `
Landing your first job in Kenya is genuinely hard. Competition is fierce, and most job descriptions ask for "2-3 years experience" even for entry-level roles. But thousands of Kenyan graduates get hired every year — here's how they do it.

## The Graduate CV Structure That Works in Kenya

As a fresh graduate, your CV should lead with your strengths, not your lack of experience. Here's the proven structure:

### 1. Professional Summary (Top)
3 sentences: who you are → your degree and strongest skills → what value you bring.

Example: *"BSc Computer Science graduate from University of Nairobi with strong skills in Python, React, and data analysis. Built 3 full-stack applications during my degree, including an AI-powered agricultural advisory tool. Eager to contribute to innovative tech teams across Nairobi's growing tech sector."*

### 2. Education (Before Experience)
Unlike experienced professionals, graduates should put education first. Include:
- Degree, university, graduation year
- GPA if above 3.0 / Second Class Upper
- Relevant coursework
- Final year project (describe it like a job achievement)

### 3. Projects and Internships
This is your work experience — treat it like a job:
- Describe what you built/did
- Mention technologies or tools used
- Quantify results where possible ("Reduced data processing time by 40%")

### 4. Skills
Be specific. "Microsoft Office" adds no value. Instead:
- Programming: Python, JavaScript, SQL
- Tools: Figma, Tableau, SPSS
- Soft skills: Leadership (mention evidence), Analytical thinking

### 5. Volunteering and Activities
Any volunteer work, student clubs, competitions, or side projects count. They show initiative and character.

## Common Mistakes Kenyan Graduates Make

- Listing "Microsoft Office" as a key skill in 2026
- Generic objective statements ("I want to grow in a reputable organization")
- No quantified achievements — even academic projects have outcomes
- Unprofessional email addresses on the CV

## Use AI to Write Your Graduate CV

AI CV Builder is specifically helpful for graduates because it knows how to present limited experience compellingly. It rewrites your academic projects and internships as achievement-oriented bullet points, generates a powerful professional summary, and optimizes everything for ATS.

Start for free at aicvbuilder.co.ke
    `.trim(),
  },
  "how-to-use-ai-write-cv-minutes": {
    title: "How to Use AI to Write Your CV in Minutes",
    description: "Step-by-step guide to generating a professional, ATS-optimized CV using AI CV Builder — from entering your details to downloading a polished PDF.",
    date: "June 2026",
    readTime: "3 min read",
    category: "How-To",
    content: `
Writing a strong CV used to take hours. With AI CV Builder, it takes under 10 minutes.

## Step 1: Create Your Free Account
Go to aicvbuilder.co.ke and click "Build My CV Free." No credit card required. You get 3 free AI operations per month.

## Step 2: Enter Your Details (5-Step Form)
The form guides you through:
1. Personal information (name, email, location, LinkedIn)
2. Work experience (even internships count)
3. Education
4. Skills
5. Paste the job description (optional, but recommended)

## Step 3: Click "Generate Resume"
Hit the ✨ Generate Resume button. The AI reads your inputs and:
- Writes a powerful 3-sentence professional summary
- Transforms your job duties into achievement bullets with metrics
- Embeds ATS keywords from the job description
- Returns your ATS score

## Step 4: Review and Apply AI Changes
Click "Apply AI Changes" to sync the improvements back into your form. Review and edit anything that doesn't sound like you.

## Step 5: Choose a Template and Download
Pick from 4 professional templates (Modern, Classic, Executive, Minimal) and download your PDF.

Total time: 5-10 minutes. Cost: Free.
    `.trim(),
  },
  "cv-vs-resume-kenya": {
    title: "CV vs Resume: What Kenyan Employers Actually Want",
    description: "Is it called a CV or a resume in Kenya? What format do local employers prefer? The answer might surprise you.",
    date: "June 2026",
    readTime: "4 min read",
    category: "Basics",
    content: `
One of the most common questions from Kenyan job seekers: should I submit a CV or a resume?

## The Technical Difference

**CV (Curriculum Vitae)** — Latin for "course of life." A comprehensive document covering your entire academic and professional history. Common in academia, research, medicine, and international development roles.

**Resume** — A concise 1-2 page summary of your relevant experience for a specific job. Used in corporate, tech, and commercial sectors globally.

## What Kenyan Employers Want

In Kenya, the word "CV" is used interchangeably for both formats in most job postings — but what they actually want is closer to a **resume**: a concise, targeted, 1-2 page document.

Unless you are applying for:
- An academic or research position
- A UN/NGO role requiring detailed publication history
- A medical or clinical position

...you should be submitting a 1-2 page targeted document, not a 5-page life story.

## The Format That Works in Kenya

- **Length:** 1 page for under 3 years experience, 2 pages for senior roles
- **File format:** PDF (preserves formatting) or DOCX (for ATS parsing)
- **Font:** Arial, Calibri, or Helvetica — 10-11pt body text
- **Sections:** Personal info → Summary → Experience → Education → Skills
- **No photos** — Kenyan employment law does not require them, and they can introduce bias

## Use AI CV Builder to Get It Right

AI CV Builder produces the exact format — length, structure, and language — that works for Kenyan employers across industries. Generate yours free at aicvbuilder.co.ke.
    `.trim(),
  },
  "cover-letter-kenya-guide": {
    title: "How to Write a Cover Letter That Gets Interviews in Kenya",
    description: "A great cover letter sets you apart in Kenya's competitive job market. Learn the proven structure and how AI can write yours in 30 seconds.",
    date: "June 2026",
    readTime: "5 min read",
    category: "Cover Letters",
    content: `
Most Kenyan job seekers submit a generic cover letter copied from the internet — or worse, no cover letter at all. This is a missed opportunity.

A tailored, well-written cover letter can move you from "maybe" to "interview shortlist."

## The 4-Paragraph Structure That Works

### Paragraph 1: The Hook
Don't start with "I am writing to apply for..." Open with something that immediately shows why you're the right person.

*Example: "With 3 years of credit analysis experience at Equity Bank and a track record of reducing NPL ratios by 18%, I was excited to see the Senior Credit Analyst opening at KCB."*

### Paragraph 2: Why You Fit This Role
Connect your specific experience to the job requirements. Reference the job description explicitly.

### Paragraph 3: Why This Company
Show you've done your research. Mention something specific about the company — a recent initiative, their market position, their values.

### Paragraph 4: The Ask
Close confidently. "I would welcome the opportunity to discuss how I can contribute to [Company]'s goals. I am available for an interview at your convenience."

## Common Kenyan Cover Letter Mistakes

- Restating your CV word for word
- Generic openers ("I hereby submit my application...")
- Mentioning salary expectations unless asked
- Not tailoring to the specific role
- Sending as a separate unformatted document instead of in the email body

## Generate a Cover Letter in 30 Seconds

AI CV Builder's cover letter generator reads your CV and the job description, then writes a tailored, professional cover letter automatically. Log in to your dashboard, click the ✉️ Cover Letter button, and enter the company name and job title.

Try it free at aicvbuilder.co.ke.
    `.trim(),
  },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    openGraph: { title: article.title, description: article.description, type: "article" },
  };
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  const paragraphs = article.content.split("\n\n");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gray-50 border-b border-gray-100 py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Link href="/blog" className="text-sm text-primary hover:underline mb-4 inline-block">
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                {article.category}
              </span>
              <span className="text-xs text-gray-400">{article.date} · {article.readTime}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{article.title}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="prose prose-gray max-w-none">
            {paragraphs.map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{para.replace("## ", "")}</h2>;
              }
              if (para.startsWith("### ")) {
                return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{para.replace("### ", "")}</h3>;
              }
              if (para.startsWith("- ")) {
                const items = para.split("\n").filter((l) => l.startsWith("- "));
                return (
                  <ul key={i} className="list-disc list-inside space-y-1 mb-4 text-gray-700">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-gray-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>") }}
                />
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Build your CV with AI — Free</h3>
            <p className="text-indigo-100 text-sm mb-5">Generate, improve, and score your CV in minutes. M-Pesa accepted.</p>
            <Link
              href="/app/register"
              className="inline-block bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
            >
              Start Free at aicvbuilder.co.ke →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
