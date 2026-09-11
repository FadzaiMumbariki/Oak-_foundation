import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import AttendeeLookupForm from "./AttendeeLookupForm";

export const metadata: Metadata = {
  title: "Find My Pass — OAK Partner Convening 2026",
  description: "Already registered? Enter your email to retrieve your QR attendee pass.",
  robots: { index: false, follow: false },
};

export default function LookupPage() {
  return (
    <AppShell variant="public">
      <div className="max-w-md">
        {/* Icon + heading */}
        <div className="mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2B4B]/10">
            <svg className="h-6 w-6 text-[#1B2B4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-[#1B2B4B]">Find My Pass</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the email you registered with to retrieve your digital pass and QR code.
          </p>
        </div>

        <AttendeeLookupForm />

        <p className="mt-5 text-center text-xs text-gray-400">
          Not yet registered?{" "}
          <a href="/register" className="font-semibold text-[#1B2B4B] hover:underline">Register now →</a>
        </p>
      </div>
    </AppShell>
  );
}
