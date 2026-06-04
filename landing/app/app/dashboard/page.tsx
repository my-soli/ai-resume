"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { resumes, type Resume } from "@/lib/api";

export default function DashboardPage() {
  const [items, setItems] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    resumes
      .list()
      .then(setItems)
      .catch(() => setError("Failed to load resumes"))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await resumes.delete(id);
      setItems((prev) => prev.filter((r) => r.id !== id));
    } catch {
      alert("Failed to delete resume");
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {items.length} resume{items.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link
          href="/app/dashboard/new"
          className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          + New Resume
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            Build your first AI-powered resume in minutes
          </p>
          <Link
            href="/app/dashboard/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Build My First Resume
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <button
                  onClick={() => handleDelete(resume.id, resume.title)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1 rounded"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1 truncate">
                {resume.title}
              </h3>
              <p className="text-xs text-gray-400 mb-4 flex-1">
                Updated {new Date(resume.updated_at).toLocaleDateString()}
              </p>

              <Link
                href={`/app/dashboard/${resume.id}`}
                className="block w-full text-center bg-indigo-50 text-primary text-sm font-medium py-2.5 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Edit & AI Tools →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
