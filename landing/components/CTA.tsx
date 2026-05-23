const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.resumeai.resume_ai";

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary to-accent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Your next job starts with a better resume
        </h2>
        <p className="text-indigo-100 text-lg max-w-xl mx-auto mb-10">
          Download Resume AI free today. Build, optimize, and export in minutes
          — from your phone.
        </p>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-xl"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.18 23.76c.37.21.8.22 1.2.04l12.75-7.37-2.82-2.82-11.13 10.15zM20.47 10.41l-2.75-1.59L14.6 12l3.12 3.12 2.75-1.59c.78-.45.78-1.67 0-2.12zM1.56 1.24C1.21 1.61 1 2.16 1 2.86v18.28c0 .7.21 1.25.56 1.62l.09.08 10.24-10.24v-.24L1.65 1.16l-.09.08z" />
          </svg>
          Download on Google Play — Free
        </a>
      </div>
    </section>
  );
}
