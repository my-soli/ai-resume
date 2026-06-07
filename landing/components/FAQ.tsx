"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is an ATS score?",
    a: "ATS stands for Applicant Tracking System — software that most large employers (especially banks, telecoms, and NGOs in Kenya) use to automatically filter CVs before a human sees them. Your ATS score (0–100) tells you how likely your CV is to pass these filters. A score above 75 is generally considered strong.",
  },
  {
    q: "How does the AI work?",
    a: "Your CV content is sent to our AI engine with a detailed prompt that instructs it to act as an expert resume writer. It rewrites your content using strong action verbs, quantified achievements, and ATS-relevant keywords — then returns the result in a structured format we display in the app. No human reads your data.",
  },
  {
    q: "Can I pay via M-Pesa?",
    a: "Yes! All paid plans (Pay-per-CV at KES 150, Weekly Pass at KES 299, and Pro Monthly at KES 499) can be paid via M-Pesa, Visa, or Mastercard through Paystack. No Kenyan card or dollar account required.",
  },
  {
    q: "What's included in the free tier?",
    a: "The free tier includes 3 AI operations per month (any combination of Generate, Improve, or Score), the full 5-step CV builder, 4 resume templates, PDF export, and ATS scoring. That's enough for most job seekers starting out.",
  },
  {
    q: "What is the Weekly Pass for?",
    a: "The Weekly Pass (KES 299) gives you unlimited AI operations for 7 days — perfect if you're actively applying for jobs this week. Generate multiple versions of your CV, improve it as many times as you want, and download PDFs in all 4 templates. No monthly commitment.",
  },
  {
    q: "Does it work for any industry or job type?",
    a: "Yes. The AI adapts its suggestions to whatever career details and job description you provide. It works for tech, finance, banking, healthcare, marketing, teaching, government, and any other field — including entry-level and graduate roles.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All data is encrypted in transit (HTTPS) and at rest. We never sell your personal data to third parties. You can delete your account and all associated data at any time from your profile settings.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes — subscriptions are managed through Paystack and can be cancelled anytime from your account settings. You'll keep Pro access until the end of the current billing period.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-gray-600">Everything you need to know about AI CV Builder</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
