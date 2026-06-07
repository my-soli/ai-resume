"use client";
import { useState } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ScoreResult = {
  score: number;
  top_issues: string[];
  keywords_missing: string[];
  verdict: string;
};

export default function FreeATSCheck() {
  const [cvText, setCvText] = useState("");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck() {
    if (!cvText.trim() || cvText.trim().length < 100) {
      setError("Please paste at least a few lines of your CV.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${BASE}/api/v1/ai/score-public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_text: cvText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Scoring failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const score = result?.score ?? 0;
  const circumference = 2 * Math.PI * 44;
  const scoreColor = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-4 py-1.5 mb-4 text-sm text-primary font-medium shadow-sm">
            ✦ Free — No account required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Check Your CV&apos;s ATS Score
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Paste your CV below and instantly find out if it will pass the ATS filters
            used by Kenyan employers. 100% free, no sign-up needed.
          </p>
        </div>

        {!result ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              rows={10}
              placeholder="Paste your CV or resume text here...

Example:
John Mwangi | john@email.com | Nairobi | LinkedIn

PROFESSIONAL SUMMARY
Software Engineer with 3 years experience in Python and React..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400">
                {cvText.length} characters · Your data is not stored
              </p>
              <button
                onClick={handleCheck}
                disabled={loading}
                className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scoring…
                  </span>
                ) : "Check My ATS Score →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              {/* Score circle */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#F3F4F6" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="44" fill="none"
                    stroke={scoreColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * circumference} ${circumference}`}
                    className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{score}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {score >= 80 ? "Strong CV ✓" : score >= 60 ? "Needs Improvement" : "High Risk of Rejection"}
                </div>
                <p className="text-gray-600 text-sm">{result.verdict}</p>
              </div>
            </div>

            {result.top_issues.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Top Issues Found</h3>
                <ul className="space-y-2">
                  {result.top_issues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 bg-red-50 rounded-lg px-3 py-2">
                      <span className="text-red-500 shrink-0 mt-0.5">⚠</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.keywords_missing.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Missing Keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords_missing.map((kw, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-5 text-white text-center">
              <div className="text-base font-bold mb-1">
                {score >= 80 ? "Good score! Let AI make it even better" : "Fix these issues and double your interview chances"}
              </div>
              <p className="text-indigo-100 text-sm mb-4">
                Create a free account to generate, improve, and download a fully optimized CV in minutes.
              </p>
              <a
                href="/app/register"
                className="inline-block bg-white text-indigo-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
              >
                Improve My CV — Free →
              </a>
            </div>

            <button
              onClick={() => { setResult(null); setCvText(""); }}
              className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Check a different CV
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
