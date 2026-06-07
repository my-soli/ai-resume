import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size={24} />
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/refund" className="hover:text-white transition-colors">Refunds</a>
            <a href="mailto:ronoshalin@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AICVBuilder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
