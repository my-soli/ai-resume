export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-24">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary text-sm font-medium">Powered by Llama AI — Free to start</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Land More Interviews
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            With AI-Optimized Resumes
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Resume AI scores your resume for ATS compatibility, rewrites your content with stronger language,
          and tailors it to any job description — right in your browser, in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="/app/register"
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            Build My Resume — Free
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-400 mx-4 text-left">
                resumeai.app/app/dashboard
              </div>
            </div>
            {/* Mock dashboard */}
            <div className="flex">
              <div className="w-40 bg-gray-50 border-r border-gray-100 p-3 space-y-2">
                <div className="text-xs text-gray-500 px-2 py-1">My Resumes</div>
                <div className="text-xs text-primary bg-indigo-50 px-2 py-1.5 rounded-lg font-medium">+ New Resume</div>
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
      </div>
    </section>
  );
}
