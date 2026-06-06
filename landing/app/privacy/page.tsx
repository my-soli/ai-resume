export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: June 2026</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly: name, email address, resume content (work experience, education, skills, projects), and uploaded CV files.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and improve the Service</li>
            <li>To process AI resume analysis and generation</li>
            <li>To manage your account and subscription</li>
            <li>To send service-related communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. AI Processing</h2>
          <p>Your resume content is sent to Groq AI for processing. This is necessary to provide AI-powered resume improvements and ATS scoring. We do not use your data to train AI models.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Storage</h2>
          <p>Your data is stored securely on Railway's cloud infrastructure with encrypted connections. We retain your data for as long as your account is active.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing</h2>
          <p>We do not sell your personal data. We share data only with service providers necessary to operate the platform (hosting, AI processing, payment processing).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
          <p>You may request deletion of your account and data at any time by contacting us. You may also export your resume data from within the app.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
          <p>We use minimal cookies necessary for authentication and session management. We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact</h2>
          <p>For privacy concerns, contact us at <a href="mailto:ronoshalin@gmail.com" className="text-indigo-600 hover:underline">ronoshalin@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}
