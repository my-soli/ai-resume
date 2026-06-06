const freeTier = [
  "5 AI operations per month",
  "Full resume builder (5-step form)",
  "PDF download & share",
  "Version history",
  "Secure account & storage",
];

const proTier = [
  "Unlimited AI operations",
  "Everything in Free",
  "Priority AI processing",
  "All future features included",
  "Cancel anytime",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Start free — no credit card, no catch. Upgrade when you need more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border-2 border-gray-100 p-8">
            <div className="mb-6">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-500 mb-2">/month</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Perfect for a single job search</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freeTier.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/app/register"
              className="block w-full text-center border-2 border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:border-primary hover:text-primary transition-colors"
            >
              Start Free
            </a>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-primary p-8 relative bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-100">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-white text-xs font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="mb-6">
              <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Pro</div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-bold text-gray-900">$4.99</span>
                <span className="text-gray-500 mb-2">/month</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">For active job seekers</p>
            </div>
            <ul className="space-y-3 mb-8">
              {proTier.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-primary mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="/app/register"
              className="block w-full text-center bg-primary text-white font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Get Pro — $4.99/mo
            </a>
            <p className="text-xs text-gray-500 text-center mt-3">
              Billed monthly via Paystack. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
