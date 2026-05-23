const steps = [
  {
    number: "01",
    title: "Fill in your career details",
    description:
      "Work through a simple 5-step form: personal info, work experience, education, skills, and projects. Paste in the job description for best results.",
  },
  {
    number: "02",
    title: "Let AI optimize it",
    description:
      "Tap Generate, Improve, or Score. GPT-4o analyzes your profile, rewrites bullet points with action verbs and metrics, and gives you a full ATS compatibility report.",
  },
  {
    number: "03",
    title: "Download and apply",
    description:
      "Export your resume as a clean PDF with one tap. Share it directly to Gmail, WhatsApp, Google Drive, or any app on your phone — and start applying with confidence.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            From details to interview-ready in 3 steps
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            No templates to fight with. No formatting headaches. Just fill,
            optimize, and go.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
              )}
              <div className="relative z-10 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="text-5xl font-bold text-primary/10 mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="font-semibold text-gray-900 text-xl mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
