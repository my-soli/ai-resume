export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">RA</span>
            </div>
            <span className="font-semibold text-white">Resume AI</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            {/* When app is live, link to in-app privacy policy or host a web version */}
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="mailto:support@resumeai.app" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Resume AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
