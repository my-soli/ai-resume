const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.resumeai.resume_ai";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20 pb-24">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-primary text-sm font-medium">Powered by GPT-4o</span>
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
          and tailors it to job descriptions — all in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-gray-700 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.18 23.76c.37.21.8.22 1.2.04l12.75-7.37-2.82-2.82-11.13 10.15zM20.47 10.41l-2.75-1.59L14.6 12l3.12 3.12 2.75-1.59c.78-.45.78-1.67 0-2.12zM1.56 1.24C1.21 1.61 1 2.16 1 2.86v18.28c0 .7.21 1.25.56 1.62l.09.08 10.24-10.24v-.24L1.65 1.16l-.09.08z"/>
            </svg>
            <div className="text-left">
              <div className="text-xs opacity-75">Download on</div>
              <div className="text-base font-semibold leading-none">Google Play</div>
            </div>
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

        {/* App mockup placeholder */}
        <div className="max-w-xs mx-auto">
          <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden aspect-[9/19]">
              <div className="bg-gradient-to-br from-primary to-accent h-28 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-3xl font-bold">87</div>
                  <div className="text-xs opacity-75">ATS Score</div>
                </div>
              </div>
              <div className="p-3 space-y-2">
                {["AI Generate", "AI Improve", "AI Score"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary rounded-sm" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{item}</span>
                    <div className="ml-auto w-4 h-4 text-gray-300">›</div>
                  </div>
                ))}
                <div className="bg-indigo-50 rounded-xl p-2.5 mt-3">
                  <div className="flex gap-1 flex-wrap">
                    {["React", "Python", "Leadership", "AWS"].map((k) => (
                      <span key={k} className="text-xs bg-indigo-100 text-primary px-2 py-0.5 rounded-full">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
