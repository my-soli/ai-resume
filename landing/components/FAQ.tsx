"use client";
import { useState } from "react";

const faqs = [
  {
    q: "What is an ATS score?",
    a: "ATS stands for Applicant Tracking System — software that most large employers use to automatically filter resumes before a human sees them. Your ATS score (0–100) tells you how likely your resume is to pass these filters. A score above 75 is generally considered strong.",
  },
  {
    q: "How does the AI actually work?",
    a: "Your resume content is sent to OpenAI's GPT-4o model with a detailed prompt that instructs it to act as an expert resume writer. It rewrites your content using strong action verbs, quantified achievements, and ATS-relevant keywords — then returns the result in a structured format we display in the app.",
  },
  {
    q: "Is my resume data safe?",
    a: "Yes. All data is encrypted in transit (HTTPS) and at rest. Your authentication tokens are stored in your phone's encrypted secure storage. We never sell your personal data to third parties.",
  },
  {
    q: "What's included in the free tier?",
    a: "The free tier includes 3 AI operations per month (any combination of Generate, Improve, or Score), the full 5-step resume builder, PDF export and sharing, and version history. That's enough for most job seekers.",
  },
  {
    q: "Can I cancel Pro anytime?",
    a: "Yes — subscriptions are managed entirely through Google Play. Go to Google Play → Subscriptions → Resume AI → Cancel. You'll keep Pro access until the end of the billing period.",
  },
  {
    q: "Does it work for any industry or job type?",
    a: "Yes. The AI adapts its suggestions to whatever career details and job description you provide. It works for tech, finance, healthcare, marketing, education, and any other field.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
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
