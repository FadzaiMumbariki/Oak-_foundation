"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import OakLogo from "./OakLogo";

/* ── Icons ────────────────────────────────────────────── */
function RegisterIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function CalIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function PartnersIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
    </svg>
  );
}
function ScanIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3m2 0V6m-2 2h2V6m-2 0v2" />
    </svg>
  );
}
function PassIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
    </svg>
  );
}
function AttendanceIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
    </svg>
  );
}
function NametagIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM15 5h.01M19 21v-2a4 4 0 00-3-3.87M5 21v-2a4 4 0 013-3.87" />
    </svg>
  );
}

/* ── Nav config ───────────────────────────────────────── */
const PUBLIC_TABS = [
  { href: "/register",  label: "Register",   icon: (a: boolean) => <RegisterIcon active={a} /> },
  { href: "/attendee/lookup", label: "My Pass",    icon: (a: boolean) => <PassIcon active={a} /> },
  { href: "/programme", label: "Programme",  icon: (a: boolean) => <CalIcon active={a} /> },
  { href: "/partners",  label: "Partners",   icon: (a: boolean) => <PartnersIcon active={a} /> },
];

const ADMIN_TABS = [
  { href: "/register",         label: "Register",   icon: (a: boolean) => <RegisterIcon active={a} /> },
  { href: "/attendee/lookup", label: "My Pass",    icon: (a: boolean) => <PassIcon active={a} /> },
  { href: "/admin/checkin",    label: "Check In",   icon: (a: boolean) => <ScanIcon active={a} /> },
  { href: "/programme",        label: "Programme",  icon: (a: boolean) => <CalIcon active={a} /> },
  { href: "/partners",         label: "Partners",   icon: (a: boolean) => <PartnersIcon active={a} /> },
  { href: "/admin/attendance", label: "Attendance", icon: (a: boolean) => <AttendanceIcon active={a} /> },
  { href: "/admin/nametags",   label: "Nametags",   icon: (a: boolean) => <NametagIcon active={a} /> },
];

/* ── AppShell ─────────────────────────────────────────── */
interface AppShellProps {
  children: React.ReactNode;
  variant?: "public" | "admin";
}

export default function AppShell({ children, variant = "public" }: AppShellProps) {
  const pathname  = usePathname();
  const tabs      = variant === "admin" ? ADMIN_TABS : PUBLIC_TABS;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">

      {/* ════════════════════════════════════════
          DESKTOP sidebar (md and up)
      ════════════════════════════════════════ */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <Link href="/" className="inline-flex">
            <OakLogo className="h-[52px] w-auto" />
          </Link>
          <p className="mt-3 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Partner Convening 2026
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#1B2B4B] text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span className={active ? "text-white" : "text-gray-400"}>
                  {tab.icon(active)}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {/* Location footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-500">Partner Convening</p>
              <p>9–11 Nov 2026</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════════════
          MAIN content wrapper
      ════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* ── Mobile top navbar ──────────────────── */}
        <header className="md:hidden flex items-center gap-3 bg-[#1B2B4B] px-4 py-3 shrink-0">
          <span className="flex h-9 w-14 items-center justify-center rounded bg-white px-1.5 py-1">
            <OakLogo className="h-full w-auto" />
          </span>
          <div className="h-4 w-px bg-white/20" />
          <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
            Partner Convening 2026
          </span>
        </header>

        {/* ── Page content ───────────────────────── */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {/* Desktop: constrained width with padding */}
          <div className="md:p-8 p-4 md:max-w-3xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* ── Mobile bottom tab bar ──────────────── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-gray-200 bg-white">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                  active ? "text-[#1B2B4B]" : "text-gray-400"
                }`}
              >
                {tab.icon(active)}
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
