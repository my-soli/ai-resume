const testimonials = [
  { name: "John M.", role: "Software Engineer", city: "Nairobi", quote: "Got 3 interview callbacks in 2 weeks after AI CV Builder rewrote my CV. The ATS score went from 52 to 91." },
  { name: "Grace W.", role: "Marketing Manager", city: "Mombasa", quote: "The AI improved my CV in seconds. I finally understand why I wasn't getting responses before." },
  { name: "David O.", role: "Fresh Graduate", city: "Kisumu", quote: "Perfect for graduates with no experience. The AI helped me highlight my skills the right way." },
  { name: "Sarah K.", role: "Accountant", city: "Nairobi", quote: "Paid via M-Pesa, generated my CV, and landed a job at a top bank. Worth every shilling!" },
  { name: "James N.", role: "Data Analyst", city: "Kampala", quote: "Works perfectly for the East African job market. Knows exactly what local recruiters look for." },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-24">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary text-sm font-medium">AI-Powered · Free to Start · M-Pesa Accepted</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Build a CV That Gets
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            Noticed in Kenya
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-6 leading-relaxed">
          AI CV Builder scores your CV for ATS compatibility, rewrites it with stronger language,
          and tailors it to any job — in seconds. Used by thousands of job seekers across Kenya and East Africa.
        </p>

        {/* Social proof stats */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-10">
          <span className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-gray-900">2,000+</span> CVs built
          </span>
          <span className="w-px h-5 bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-gray-900">47%</span> more interviews
          </span>
          <span className="w-px h-5 bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <span className="text-2xl font-bold text-gray-900">4.9</span>
            <span className="text-yellow-400">★</span> rating
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/app/register"
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Build My CV — Free
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-gray-700 font-medium px-6 py-3.5 rounded-xl border border-gray-200 hover:border-primary hover:text-primary transition-colors"
          >
            See how it works
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Web app mockup */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-400 mx-4 text-left">
                aicvbuilder.co.ke/app/dashboard
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="flex">
              <div className="w-40 bg-gray-50 border-r border-gray-100 p-3 space-y-2">
                <div className="text-xs text-gray-500 px-2 py-1">My CVs</div>
                <div className="text-xs text-primary bg-indigo-50 px-2 py-1.5 rounded-lg font-medium">+ New CV</div>
              </div>
              <div className="flex-1 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-2 bg-gray-200 rounded w-32" />
                  <div className="h-6 bg-primary rounded-lg w-20 opacity-80" />
                </div>
                {[92, 78, 85].map((score, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100" />
                    <div className="flex-1 space-y-1">
                      <div className="h-2 bg-gray-200 rounded w-28" />
                      <div className="h-1.5 bg-gray-100 rounded w-20" />
                    </div>
                    <span className={`text-xs font-bold ${score >= 80 ? "text-green-500" : "text-amber-500"}`}>{score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <p className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">What job seekers say</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
