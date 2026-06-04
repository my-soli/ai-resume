export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Your next job starts with a better resume
        </h2>
        <p className="text-indigo-100 text-lg max-w-xl mx-auto mb-10">
          Create your free account today. Build, optimize, and download in minutes
          — right in your browser.
        </p>
        <a
          href="/app/register"
          className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
        >
          Build My Resume — Free
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
