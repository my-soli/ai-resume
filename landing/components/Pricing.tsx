"use client";

const tiers = [
  {
    id: "free",
    name: "Free",
    price: "KES 0",
    period: "/month",
    tagline: "Try it out — no card needed",
    cta: "Start Free",
    ctaHref: "/app/register",
    ctaStyle: "border",
    badge: null,
    features: [
      "3 AI operations per month",
      "Full CV builder (5-step form)",
      "4 resume templates",
      "PDF download",
      "ATS score checker",
    ],
  },
  {
    id: "payperCV",
    name: "Pay-per-CV",
    price: "KES 150",
    period: " one-time",
    tagline: "One CV, fully polished",
    cta: "Generate 1 CV",
    ctaHref: "/app/register",
    ctaStyle: "outline-primary",
    badge: "Best for one-off",
    features: [
      "1 full AI CV generation",
      "PDF download included",
      "All 4 templates",
      "No subscription",
      "Pay once via M-Pesa",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Pass",
    price: "KES 299",
    period: "/week",
    tagline: "Applying this week? This is for you",
    cta: "Get Weekly Pass",
    ctaHref: "/app/register",
    ctaStyle: "primary",
    badge: "Most Popular",
    features: [
      "Unlimited AI operations for 7 days",
      "All 4 CV templates",
      "Cover letter generator",
      "ATS scoring + improvements",
      "PDF downloads",
      "Pay via M-Pesa or card",
    ],
  },
  {
    id: "pro",
    name: "Pro Monthly",
    price: "KES 499",
    period: "/month",
    tagline: "For serious job seekers",
    cta: "Get Pro",
    ctaHref: "/app/register",
    ctaStyle: "dark",
    badge: null,
    features: [
      "Unlimited AI operations",
      "All Weekly Pass features",
      "Priority AI processing",
      "All future features",
      "Cancel anytime",
    ],
  },
];

function Check() {
  return (
    <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            All prices in KES. Pay via M-Pesa, card, or mobile money — no hidden fees.
          </p>
        </div>

        {/* M-Pesa badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            M-Pesa accepted on all paid plans via Paddle
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map((tier) => {
            const isPopular = tier.id === "weekly";
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 flex flex-col relative ${
                  isPopular
                    ? "border-2 border-primary bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-100"
                    : "border-2 border-gray-100"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      isPopular ? "bg-primary text-white" : "bg-gray-800 text-white"
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${isPopular ? "text-primary" : "text-gray-400"}`}>
                    {tier.name}
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-400 text-sm mb-1">{tier.period}</span>
                  </div>
                  <p className="text-xs text-gray-500">{tier.tagline}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.ctaHref}
                  className={`block w-full text-center font-semibold py-2.5 rounded-xl text-sm transition-colors ${
                    tier.ctaStyle === "primary"
                      ? "bg-primary text-white hover:bg-indigo-700"
                      : tier.ctaStyle === "dark"
                      ? "bg-gray-900 text-white hover:bg-gray-700"
                      : tier.ctaStyle === "outline-primary"
                      ? "border-2 border-primary text-primary hover:bg-indigo-50"
                      : "border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Payments processed securely via Paddle · M-Pesa, Visa, Mastercard accepted · Cancel anytime
        </p>
      </div>
    </section>
  );
}
