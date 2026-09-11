"use client";

import { useState, useMemo, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { NametagAttendee } from "@/app/actions/nametags";

const ROLE_FILTERS = ["All Roles", "Partner", "OAK Staff", "Coordination Team", "Presenter", "Observer"];

const ROLE_BADGE: Record<string, string> = {
  Partner:           "bg-blue-100 text-blue-700",
  "OAK Staff":       "bg-emerald-100 text-emerald-700",
  "Coordination Team": "bg-orange-100 text-orange-700",
  Presenter:         "bg-purple-100 text-purple-700",
  Observer:          "bg-gray-100 text-gray-600",
};

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatToken(token: string): string {
  const raw = token.replace(/-/g, "").toUpperCase().slice(0, 8);
  return `OAK-2026-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
}

/* ────────────────────────────────────────────────────────
   INDIVIDUAL NAMETAG — standard conference badge 3"×4"
   (≈ 76mm × 102mm) — print-ready with print styles.
──────────────────────────────────────────────────────── */
function NametagCard({ attendee }: { attendee: NametagAttendee }) {
  const qrValue =
    typeof window !== "undefined"
      ? `${window.location.origin}/attendee/${attendee.qr_token}`
      : `/attendee/${attendee.qr_token}`;

  return (
    <div
      className="nametag-card relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
      style={{ width: "300px", height: "400px" }}
    >
      {/* ── Navy header strip ─────────────────────── */}
      <div className="relative bg-[#1B2B4B] px-5 py-4">
        <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/[0.08] blur-2xl" />
        <div className="relative flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
              <circle cx="12" cy="12" r="11" fill="white" fillOpacity="0.18" />
              <circle cx="12" cy="12" r="7"  fill="none" stroke="white" strokeWidth="2.2" />
              <circle cx="12" cy="12" r="3"  fill="white" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-black leading-none text-white tracking-tight">OAK Foundation</span>
            <span className="text-[8px] font-bold tracking-[0.22em] text-white/55 uppercase mt-0.5">
              Partner Convening · 2026
            </span>
          </div>
        </div>
      </div>

      {/* ── Attendee identity block ──────────────── */}
      <div className="px-5 pt-5 pb-4 text-center">
        {/* Initials avatar */}
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1B2B4B]">
          <span className="text-lg font-black text-white">{initials(attendee.full_name)}</span>
        </div>
        {/* Name */}
        <h3
          className="font-black text-[#1B2B4B] leading-tight break-words"
          style={{
            fontSize: attendee.full_name.length > 22 ? "17px" : attendee.full_name.length > 16 ? "19px" : "22px",
            lineHeight: 1.15,
          }}
        >
          {attendee.full_name}
        </h3>
        {/* Role badge */}
        <div className="mt-2">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[attendee.role_title] ?? "bg-gray-100 text-gray-600"}`}>
            {attendee.role_title}
          </span>
        </div>
        {/* Organisation */}
        <div className="mt-3 px-1">
          <p
            className="font-semibold text-gray-800 leading-snug break-words"
            style={{
              fontSize: attendee.organization.length > 28 ? "11px" : attendee.organization.length > 20 ? "12px" : "13px",
            }}
          >
            {attendee.organization}
          </p>
          {attendee.sub_partner && (
            <p className="mt-0.5 text-[10px] text-gray-500">{attendee.sub_partner}</p>
          )}
        </div>
      </div>

      {/* ── Divider ──────────────────────────────── */}
      <div className="mx-5 h-px bg-gray-200" />

      {/* ── QR block ─────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-3">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-2">
          <QRCodeSVG
            value={qrValue}
            size={60}
            level="M"
            includeMargin={false}
            fgColor="#1B2B4B"
            bgColor="#FFFFFF"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
            Check-In Token
          </p>
          <p className="font-mono text-[11px] font-semibold text-gray-700 tracking-wider">
            {formatToken(attendee.qr_token)}
          </p>
          <p className="mt-1 text-[9px] text-gray-400">
            Cresta Lodge Msasa · Harare
          </p>
        </div>
      </div>

      {/* ── Event date footer ────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-[#F7F8FA] px-5 py-1.5 text-center">
        <p className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">
          9 – 11 November 2026
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────────── */
export default function NametagsGenerator({
  attendees = [],
}: {
  attendees?: NametagAttendee[];
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const printAreaRef = useRef<HTMLDivElement>(null);

  const allRoles = useMemo(() => {
    const set = new Set(attendees.map((a) => a.role_title));
    return Array.from(set);
  }, [attendees]);

  const filtered = useMemo(() => {
    return attendees.filter((a) => {
      const matchRole = roleFilter === "All Roles" || a.role_title === roleFilter;
      const matchSearch =
        !search ||
        a.full_name.toLowerCase().includes(search.toLowerCase()) ||
        a.organization.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [attendees, roleFilter, search]);

  const toPrint =
    selectedIds.size > 0
      ? filtered.filter((a) => selectedIds.has(a.id))
      : filtered;

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(filtered.map((a) => a.id)));
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function handlePrint() {
    if (!printAreaRef.current) return;
    window.print();
  }

  return (
    <div className="max-w-5xl space-y-5">
      {/* ── Header ───────────────────────────────── */}
      <div className="print-controls flex items-start justify-between gap-3">
        <div>
          <h1 className="oak-h1">Nametags &amp; Badges</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Print conference badges for {attendees.length} registered attendees
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearSelection}
            disabled={selectedIds.size === 0}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700
                       hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-[#1B2B4B] px-5 py-2 text-xs font-bold text-white
                       hover:bg-[#243a63] transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print {selectedIds.size > 0 ? `(${selectedIds.size})` : `(${toPrint.length})`}
          </button>
        </div>
      </div>

      {/* ── Filter controls ──────────────────────── */}
      <div className="print-controls rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or organisation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2 text-sm text-gray-800
                       placeholder:text-gray-400 focus:outline-none focus:border-[#1B2B4B] focus:ring-2 focus:ring-[#1B2B4B]/10"
          />
        </div>
        {/* Role chips */}
        <div className="flex flex-wrap items-center gap-2">
          {ROLE_FILTERS.filter((r) => r === "All Roles" || allRoles.includes(r)).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                roleFilter === r
                  ? "bg-[#1B2B4B] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {r}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
            <button
              onClick={selectAll}
              className="font-semibold text-[#1B2B4B] hover:underline"
            >
              Select all {filtered.length}
            </button>
            {selectedIds.size > 0 && (
              <span className="tabular-nums">· {selectedIds.size} selected</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Attendee selectable list ─────────────── */}
      <div className="print-controls rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Attendees · Click to select for printing
          </p>
          <p className="text-[11px] text-gray-500">{filtered.length} of {attendees.length}</p>
        </div>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">No attendees match your filters.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
            {filtered.map((a) => {
              const sel = selectedIds.has(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => toggleSelect(a.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                    sel ? "bg-[#F0F4FF]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    sel ? "bg-[#1B2B4B] border-[#1B2B4B]" : "border-gray-300"
                  }`}>
                    {sel && (
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1B2B4B]">
                    <span className="text-[10px] font-black text-white">{initials(a.full_name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{a.full_name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{a.organization}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                    ROLE_BADGE[a.role_title] ?? "bg-gray-100 text-gray-600"
                  }`}>
                    {a.role_title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Print preview area ────────────────────── */}
      <div className="print-area" ref={printAreaRef}>
        <div className="print-controls mb-3">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Print Preview · 3" × 4" conference badges
          </p>
        </div>
        {toPrint.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-16 text-center">
            <p className="text-sm text-gray-500">
              Select attendees above to preview their nametags here, or print all.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center">
            {toPrint.map((a) => (
              <NametagCard key={a.id} attendee={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
