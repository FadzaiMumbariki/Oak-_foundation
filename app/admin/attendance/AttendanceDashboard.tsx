"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { fetchAttendanceSummary, AttendanceSummary } from "@/app/actions/attendance";
import { EVENT_DAY_LABELS } from "@/lib/types";

const ROLE_BADGE: Record<string, string> = {
  Partner:           "bg-blue-100 text-blue-700",
  "OAK Staff":       "bg-emerald-100 text-emerald-700",
  "Coordination Team": "bg-orange-100 text-orange-700",
  Presenter:         "bg-purple-100 text-purple-700",
  Observer:          "bg-gray-100 text-gray-600",
};

function roleBadge(role?: string) {
  return ROLE_BADGE[role ?? ""] ?? "bg-gray-100 text-gray-600";
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return '"' + v.replace(/"/g, '""') + '"';
  return v;
}

export default function AttendanceDashboard({
  data,
}: {
  data: AttendanceSummary;
}) {
  const [live, setLive] = useState(data);
  const [isPending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      const fresh = await fetchAttendanceSummary();
      setLive(fresh);
    });
  }

  function exportCSV() {
    const rows = [
      ["Name", "Organisation", "Role", "Check-in Date", "Checked In At"],
      ...live.recentCheckIns.map((r) => [
        r.full_name,
        r.organization,
        r.role_title,
        r.check_in_date,
        new Date(r.checked_in_at).toLocaleString("en-GB"),
      ]),
    ];
    const csv = rows
      .map((row) => row.map((c) => csvEscape(String(c))).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OAK-2026-attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const { totalRegistered, totalCheckedIn, perDay, recentCheckIns } = live;
  const remaining = Math.max(0, totalRegistered - totalCheckedIn);
  const pct = totalRegistered > 0 ? (totalCheckedIn / totalRegistered) * 100 : 0;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="oak-h1">Attendance</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Check-in tracking · 9–11 November 2026
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isPending}
          className="shrink-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700
                     hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isPending ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* ── Event Summary Stats ─────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Event Summary
          </p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          {[
            { label: "Registered", value: totalRegistered },
            { label: "Checked In", value: totalCheckedIn, highlight: true },
            { label: "Remaining",  value: remaining },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center py-5 px-3">
              <p className={`text-3xl font-black ${s.highlight ? "text-[#2D6A4F]" : "text-[#1B2B4B]"}`}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        {/* Overall progress */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
            <span>Overall check-in rate</span>
            <span className="font-bold text-[#1B2B4B]">{pct.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2D6A4F] transition-all duration-500"
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Day Breakdown ───────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Day Breakdown
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {perDay.map((day, i) => {
            const label = EVENT_DAY_LABELS[i] ?? day.label;
            const dp =
              totalRegistered > 0 ? (day.count / totalRegistered) * 100 : 0;
            return (
              <div key={day.date} className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {day.count} checked in
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-28 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1B2B4B] transition-all"
                      style={{ width: `${Math.min(100, dp)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-14 text-right tabular-nums">
                    {day.count} / {totalRegistered || "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Recent Check-ins / Attendee Table ──────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            {recentCheckIns.length > 0 ? "Recent Check-ins" : "Attendee List"}
          </p>
          <button
            onClick={exportCSV}
            disabled={recentCheckIns.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold
                       text-gray-700 hover:bg-gray-50 transition-colors
                       disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {recentCheckIns.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              No check-ins yet
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              Attendees will appear here once they have been scanned at the event entrance.
            </p>
            <Link
              href="/admin/checkin"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1B2B4B] px-6 py-3 text-sm font-bold text-white
                         hover:bg-[#243a63] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3m2 0V6m-2 2h2V6m-2 0v2" />
              </svg>
              Go to Check-In Scanner
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCheckIns.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1B2B4B]">
                  <span className="text-[11px] font-black text-white">
                    {initials(r.full_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {r.full_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {r.organization}
                  </p>
                </div>
                <span
                  className={`oak-chip hidden sm:inline-flex shrink-0 ${roleBadge(r.role_title)}`}
                >
                  • {r.role_title || "Attendee"}
                </span>
                <span className="text-[11px] text-gray-400 tabular-nums shrink-0 w-16 text-right">
                  {timeAgo(r.checked_in_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
