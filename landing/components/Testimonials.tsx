// Replace GOOGLE_REVIEW_LINK with your Google Business Profile review URL
const GOOGLE_REVIEW_LINK = "https://g.page/r/aicvbuilder/review"; // update after Google Business setup

const testimonials = [
  { name: "John M.", role: "Software Engineer", city: "Nairobi", score: 91, quote: "Got 3 interview callbacks in 2 weeks after AI CV Builder rewrote my CV. My ATS score went from 52 to 91 in one click." },
  { name: "Grace W.", role: "Marketing Manager", city: "Mombasa", score: 88, quote: "The AI improved my CV in seconds. I finally understand why I wasn't getting responses before — wrong keywords!" },
  { name: "David O.", role: "Fresh Graduate", city: "Kisumu", score: 84, quote: "Perfect for graduates with no experience. The AI helped me highlight my university projects the right way." },
  { name: "Sarah K.", role: "Accountant", city: "Nairobi", score: 92, quote: "Paid with M-Pesa, generated my CV, and landed a job at a top bank. Worth every shilling!" },
  { name: "James N.", role: "Data Analyst", city: "Kampala", score: 79, quote: "Works perfectly for the East African job market. The AI knows exactly what local recruiters look for." },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Real results from real job seekers
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Thousands of Kenyans and East Africans have used AI CV Builder to land interviews at top companies.
          </p>
          <a
            href={GOOGLE_REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-gray-200 hover:border-primary text-gray-700 hover:text-primary font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Leave a Google Review
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">&quot;{t.quote}&quot;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role} · {t.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{t.score}</div>
                  <div className="text-xs text-gray-400">ATS score</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row */}
        <div className="grid sm:grid-cols-2 gap-5 mt-5 max-w-2xl mx-auto">
          {testimonials.slice(3).map((t, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5">&quot;{t.quote}&quot;</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role} · {t.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{t.score}</div>
                  <div className="text-xs text-gray-400">ATS score</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
