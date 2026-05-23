const stats = [
  { value: "3 AI Tools", label: "Generate, Improve & Score" },
  { value: "ATS-Ready", label: "Optimized for applicant tracking" },
  { value: "Seconds", label: "Not hours to optimize" },
  { value: "Free to start", label: "No credit card needed" },
];

export default function Stats() {
  return (
    <section className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-sm text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
