const features = [
  {
    icon: "✨",
    title: "AI Resume Generator",
    description:
      "Fill in your career details once. Our GPT-4o powered engine writes a complete, professional resume tailored to your target role — using strong action verbs and quantified achievements.",
    color: "bg-indigo-50",
    iconBg: "bg-indigo-100",
  },
  {
    icon: "📊",
    title: "ATS Compatibility Score",
    description:
      "Get an honest 0–100 score showing how well your resume passes applicant tracking systems, plus a specific list of improvements to push that number higher.",
    color: "bg-purple-50",
    iconBg: "bg-purple-100",
  },
  {
    icon: "⚡",
    title: "AI Resume Improver",
    description:
      "Already have a resume? Paste it in and the AI rewrites every bullet point with stronger verbs, better keywords, and tighter language — without changing the facts.",
    color: "bg-blue-50",
    iconBg: "bg-blue-100",
  },
  {
    icon: "📄",
    title: "One-Tap PDF Export",
    description:
      "Download a clean, ATS-friendly PDF in one tap and share it directly to email, WhatsApp, Drive, or anywhere else — straight from your phone.",
    color: "bg-green-50",
    iconBg: "bg-green-100",
  },
  {
    icon: "🎯",
    title: "Job Description Targeting",
    description:
      "Paste the job description when building your resume. The AI reads it and weaves the exact keywords and competencies employers are looking for into your content.",
    color: "bg-yellow-50",
    iconBg: "bg-yellow-100",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    description:
      "Your resume data is encrypted at rest and in transit. We never sell your information. Authentication tokens are stored in your device's encrypted secure storage.",
    color: "bg-rose-50",
    iconBg: "bg-rose-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to land the interview
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Six powerful tools in one mobile app. No subscriptions required to
            get started.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.color} rounded-2xl p-6 hover:shadow-md transition-shadow`}
            >
              <div
                className={`${f.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
