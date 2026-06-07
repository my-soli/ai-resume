"use client";
import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function ReviewsPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (review.trim().length < 20) {
      setError("Please write at least 20 characters in your review.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/v1/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, city, rating, review }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? "Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Nav */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
              <p className="text-gray-500 mb-6">
                Your review has been submitted. We may feature it on our website.
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-white font-medium px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
              >
                Back to AI CV Builder
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
                <p className="text-gray-500 text-sm">
                  Did AI CV Builder help you land a job or get more interviews?
                  We&apos;d love to hear your story.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star rating */}
                <div className="text-center">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Your Rating</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="text-3xl transition-transform hover:scale-110"
                      >
                        <span className={star <= (hoveredStar || rating) ? "text-yellow-400" : "text-gray-200"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {rating === 5 ? "Excellent!" : rating === 4 ? "Good" : rating === 3 ? "Average" : rating === 2 ? "Poor" : "Very Poor"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Your Name *</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John M."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">City *</label>
                    <input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Nairobi"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Job Title / Role *</label>
                  <input
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Software Engineer, Fresh Graduate, Accountant"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Your Review * <span className="text-gray-400">(min. 20 characters)</span>
                  </label>
                  <textarea
                    required
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    placeholder="Tell us your experience — did you get more interviews? How did the AI help? What did you like most?"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">{review.length}/1000</p>
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting…
                    </span>
                  ) : "Submit My Review"}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-4">
                Reviews may be featured on our website. We never share your contact details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
