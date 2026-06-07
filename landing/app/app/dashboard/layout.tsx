"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { users, type User } from "@/lib/api";
import Logo from "@/components/Logo";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Paddle?: any;
  }
}

const PADDLE_TOKEN = "live_f4a6df1ec37709695edb6863591";

// Price IDs — set up in your Paddle dashboard then add to env vars
const PADDLE_PRICES = {
  pro:     process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO     ?? "pri_01kteyj83nxmtebqv9f48316d0",
  weekly:  process.env.NEXT_PUBLIC_PADDLE_PRICE_WEEKLY  ?? "",
  payperCV: process.env.NEXT_PUBLIC_PADDLE_PRICE_PAYPERCV ?? "",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);

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

  useEffect(() => {
    if (document.getElementById("paddle-js")) return;
    const script = document.createElement("script");
    script.id = "paddle-js";
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => {
      window.Paddle?.Initialize({ token: PADDLE_TOKEN });
    };
    document.head.appendChild(script);
  }, []);

  function openCheckout(priceId: string) {
    if (!user || !window.Paddle || !priceId) return;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      customer: { email: user.email },
    });
  }

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
          <Link href="/app/dashboard">
            <Logo size={28} />
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
            My CVs
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
            New CV
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
              <div className="text-sm font-medium text-gray-900 truncate">{user.full_name}</div>
              <div className="text-xs text-gray-500 truncate">
                {user.is_pro ? (
                  <span className="text-primary font-medium">✦ Pro</span>
                ) : (
                  "Free plan"
                )}
              </div>
            </div>
          </div>

          {!user.is_pro && (
            <>
              {/* Toggle upgrade options */}
              <button
                onClick={() => setShowUpgrade((v) => !v)}
                className="w-full text-center bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity mb-1"
              >
                Upgrade ↑
              </button>

              {showUpgrade && (
                <div className="space-y-1.5 mb-2 mt-1">
                  {PADDLE_PRICES.payperCV && (
                    <button
                      onClick={() => openCheckout(PADDLE_PRICES.payperCV)}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-lg border border-gray-100 hover:border-primary hover:bg-indigo-50 transition-colors"
                    >
                      <div className="font-semibold text-gray-900">Pay-per-CV</div>
                      <div className="text-gray-400">KES 150 · one-time</div>
                    </button>
                  )}
                  {PADDLE_PRICES.weekly && (
                    <button
                      onClick={() => openCheckout(PADDLE_PRICES.weekly)}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-lg border border-primary bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      <div className="font-semibold text-primary">Weekly Pass ⭐</div>
                      <div className="text-indigo-400">KES 299 · 7 days unlimited</div>
                    </button>
                  )}
                  <button
                    onClick={() => openCheckout(PADDLE_PRICES.pro)}
                    className="w-full text-left text-xs px-2.5 py-2 rounded-lg border border-gray-100 hover:border-primary hover:bg-indigo-50 transition-colors"
                  >
                    <div className="font-semibold text-gray-900">Pro Monthly</div>
                    <div className="text-gray-400">KES 499/mo · unlimited</div>
                  </button>
                </div>
              )}
            </>
          )}

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
