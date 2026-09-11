import type { Metadata } from "next";
import { CalendarDays, Handshake, type LucideIcon, Users } from "lucide-react";
import AppShell from "@/components/AppShell";
import RegistrationForm from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Register — OAK Partner Convening 2026",
  description: "Registration and attendance platform for the OAK Foundation Partner Convening 2026.",
};

const stats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "110+", label: "Attendees", icon: Users },
  { value: "24", label: "Sessions", icon: CalendarDays },
  { value: "38", label: "Partners", icon: Handshake },
];

export default function RegisterPage() {
  return (
    <AppShell variant="public">
      {/* ── Hero card ───────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1B2B4B] px-6 py-6 mb-4 shadow-sm">
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-28 w-28 rounded-full bg-blue-400/10 blur-xl" />
        <div className="relative">
          <h1 className="text-2xl font-black text-white leading-tight">
            Partner<br />Convening 2026
          </h1>
          <p className="mt-1.5 text-sm text-white/60">9–11 November 2026 · Cresta Lodge Msasa, Harare</p>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white px-3 py-3 shadow-sm">
              <Icon aria-hidden="true" className="mb-1 h-4 w-4 text-[#5577A2]" strokeWidth={2} />
            <p className="text-xl font-black text-[#1B2B4B]">{s.value}</p>
            <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Form card ───────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#1B2B4B] mb-5">Registration Form</h2>
        <RegistrationForm />
      </div>
    </AppShell>
  );
}
