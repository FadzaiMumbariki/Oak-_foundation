import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Login — OAK Partner Convening 2026",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] px-4">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B2B4B]">
            <svg viewBox="0 0 28 28" fill="none" className="h-8 w-8">
              <circle cx="14" cy="14" r="13" fill="#1B2B4B" />
              <circle cx="14" cy="14" r="9" fill="none" stroke="white" strokeWidth="3" />
              <circle cx="14" cy="14" r="4" fill="white" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-[#1B2B4B]">Coordination Team</h1>
          <p className="mt-1 text-sm text-gray-500">Admin · OAK Partner Convening 2026</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 text-[#1B2B4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-bold text-[#1B2B4B]">Admin Sign-In</span>
          </div>
          <p className="text-sm text-gray-600">
            Supabase magic-link authentication is coming on <strong>Day 3</strong>.
          </p>
          <Link
            href="/admin/checkin"
            className="block w-full rounded-xl bg-[#1B2B4B] py-3 text-sm font-bold text-white hover:bg-[#243a63] transition-colors"
          >
            Go to Check-In (dev mode)
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          <Link href="/register" className="text-[#1B2B4B] hover:underline">← Back to registration</Link>
        </p>
      </div>
    </div>
  );
}
