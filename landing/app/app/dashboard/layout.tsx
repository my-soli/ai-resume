"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { users, type User } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/app/login");
      return;
    }
    users
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.clear();
        router.replace("/app/login");
      });
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/app/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="font-bold text-gray-900">Resume AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            href="/app/dashboard"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              isActive("/app/dashboard")
                ? "bg-indigo-50 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Resumes
          </Link>
          <Link
            href="/app/dashboard/new"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              isActive("/app/dashboard/new")
                ? "bg-indigo-50 text-primary font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Resume
          </Link>
        </nav>

        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-primary text-xs font-semibold">
                {user.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.full_name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user.is_pro ? (
                  <span className="text-primary font-medium">Pro</span>
                ) : (
                  "Free plan"
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/");
            }}
            className="w-full text-left text-xs text-gray-400 hover:text-gray-600 px-1 py-1 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
