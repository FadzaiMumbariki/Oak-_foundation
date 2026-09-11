"use client";

import { useState } from "react";
import type { ProgrammeSession } from "@/lib/types";

type SessionType = "plenary" | "breakout" | "workshop" | "social" | "break";

interface Session {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  speaker?: string;
  speakerInitial?: string;
  location?: string;
  type: SessionType;
  featured?: boolean;
  isBreak?: boolean;
}

/* ── Data ─────────────────────────────────────────────── */
const DAYS = [
  { label: "Day 1", day: "MON", date: "9 Nov",  key: 0, isoDate: "2026-11-09" },
  { label: "Day 2", day: "TUE", date: "10 Nov", key: 1, isoDate: "2026-11-10" },
  { label: "Day 3", day: "WED", date: "11 Nov", key: 2, isoDate: "2026-11-11" },
];

const FALLBACK_SESSIONS: Record<number, Session[]> = {
  0: [
    { id: "d1-1",  time: "08:00",           title: "Registration & Welcome Coffee",            type: "break",    isBreak: true },
    { id: "d1-2",  time: "09:00", endTime: "10:30", title: "Opening Plenary: Pathways to Impact", speaker: "Dr. Helena Moreau · OAK Foundation", speakerInitial: "D", location: "Main Hall A", type: "plenary", featured: true },
    { id: "d1-3",  time: "10:30",           title: "Coffee Break",                             type: "break",    isBreak: true },
    { id: "d1-4",  time: "10:50", endTime: "12:00", title: "Thematic Dialogue: Climate Justice & Grantmaking", speaker: "Samuel Okafor · Africa Climate Alliance", speakerInitial: "S", location: "Conference Room B2", type: "breakout" },
    { id: "d1-5",  time: "12:00",           title: "Networking Lunch",                         type: "break",    isBreak: true },
    { id: "d1-6",  time: "13:30", endTime: "14:30", title: "Partner Spotlight: Rights-Based Approaches", speaker: "Fatima Zahra Benali · MENA Rights Group", speakerInitial: "F", location: "Main Hall A", type: "plenary" },
    { id: "d1-7",  time: "14:45", endTime: "16:00", title: "Digital Rights in Authoritarian Contexts", speaker: "Li Wei · Digital Frontiers Institute", speakerInitial: "L", location: "Conference Room B1", type: "breakout" },
    { id: "d1-8",  time: "18:00", endTime: "20:00", title: "Welcome Reception & Dinner",       location: "Rooftop Terrace", type: "social" },
  ],
  1: [
    { id: "d2-1",  time: "08:30",           title: "Morning Coffee & Networking",              type: "break",    isBreak: true },
    { id: "d2-2",  time: "09:00", endTime: "10:30", title: "Keynote: The Future of Philanthropy", speaker: "James Odhiambo · OAK Foundation", speakerInitial: "J", location: "Main Hall A", type: "plenary", featured: true },
    { id: "d2-3",  time: "10:30",           title: "Coffee Break",                             type: "break",    isBreak: true },
    { id: "d2-4",  time: "10:50", endTime: "12:00", title: "Community Resilience & Local Leadership", speaker: "Amara Diallo · West Africa Civil Society", speakerInitial: "A", location: "Conference Room B1", type: "breakout" },
    { id: "d2-5",  time: "10:50", endTime: "12:00", title: "Workshop: Data for Impact", speaker: "Maria Schmidt · Open Society Foundations", speakerInitial: "M", location: "Workshop Room C", type: "workshop" },
    { id: "d2-6",  time: "12:00",           title: "Networking Lunch",                         type: "break",    isBreak: true },
    { id: "d2-7",  time: "13:30", endTime: "15:00", title: "Collaborative Grantmaking Frameworks", speaker: "Kayden Mamu · Global Giving Network", speakerInitial: "K", location: "Main Hall A", type: "plenary" },
    { id: "d2-8",  time: "18:30", endTime: "21:00", title: "Cultural Evening",                 location: "Conference Centre Garden", type: "social" },
  ],
  2: [
    { id: "d3-1",  time: "08:30",           title: "Morning Coffee",                           type: "break",    isBreak: true },
    { id: "d3-2",  time: "09:00", endTime: "10:30", title: "Closing Plenary: Commitments & Next Steps", speaker: "Dr. Helena Moreau · OAK Foundation", speakerInitial: "D", location: "Main Hall A", type: "plenary", featured: true },
    { id: "d3-3",  time: "10:30",           title: "Coffee Break",                             type: "break",    isBreak: true },
    { id: "d3-4",  time: "10:50", endTime: "12:00", title: "Working Groups: Action Planning",  speaker: "All Participants", speakerInitial: "A", location: "Breakout Rooms", type: "workshop" },
    { id: "d3-5",  time: "12:00",           title: "Farewell Lunch",                           type: "break",    isBreak: true },
    { id: "d3-6",  time: "13:30", endTime: "14:30", title: "Partner One-to-Ones",              location: "Meeting Pods", type: "breakout" },
    { id: "d3-7",  time: "14:30",           title: "Departure",                                type: "break",    isBreak: true },
  ],
};

function formatTime(t: string) {
  return t.slice(0, 5);
}

function speakerInitials(name: string): string {
  const first = name.split(" · ")[0];
  return first
    .split(/\s+/)
    .slice(0, 1)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function convertServerRows(rows: ProgrammeSession[]): Record<number, Session[]> {
  const out: Record<number, Session[]> = { 0: [], 1: [], 2: [] };
  for (const r of rows) {
    const dayIdx = DAYS.findIndex((d) => d.isoDate === String(r.session_date).slice(0, 10));
    if (dayIdx < 0) continue;
    const st = String(r.start_time);
    const et = r.end_time ? String(r.end_time) : undefined;
    const type = (r.session_type as SessionType) || "plenary";
    const speaker = r.description && r.description.length < 120 ? r.description : undefined;
    out[dayIdx].push({
      id: r.id,
      time: formatTime(st),
      endTime: et ? formatTime(et) : undefined,
      title: r.title,
      location: r.location ?? undefined,
      type,
      isBreak: type === "break",
      featured: r.sort_order === 2 || (type === "plenary" && !out[dayIdx].some((s) => s.featured)),
      speaker,
      speakerInitial: speaker ? speakerInitials(speaker) : undefined,
    });
  }
  return out;
}

/* ── Badge colours ────────────────────────────────────── */
const TYPE_BADGE: Record<SessionType, { bg: string; text: string; dot: string }> = {
  plenary:  { bg: "bg-[#EFF6FF]", text: "text-[#1E40AF]", dot: "bg-[#1E40AF]" },
  breakout: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
  workshop: { bg: "bg-[#F3E8FF]", text: "text-[#7E22CE]", dot: "bg-[#7E22CE]" },
  social:   { bg: "bg-[#FFEDD5]", text: "text-[#C2410C]", dot: "bg-[#C2410C]" },
  break:    { bg: "bg-gray-100",  text: "text-gray-500",  dot: "bg-gray-300"  },
};

/* ── Session card ─────────────────────────────────────── */
function SessionCard({ session }: { session: Session }) {
  const [open, setOpen] = useState(false);

  if (session.isBreak) {
    return (
      <div className="flex items-center gap-3 py-2.5 px-1">
        <span className="shrink-0 text-[13px] text-gray-400 font-medium">{session.time}</span>
        <div className="flex-1 h-px bg-gray-300" />
        <span className="text-[13px] text-gray-400 whitespace-nowrap">{session.title}</span>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
    );
  }

  const badge = TYPE_BADGE[session.type];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-3 px-4 py-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Time */}
        <div className="shrink-0 w-[42px] text-left pt-0.5">
          <p className="text-[13px] font-bold text-gray-800">{session.time}</p>
          {session.endTime && (
            <p className="text-[12px] text-gray-400">-{session.endTime}</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-gray-900 leading-snug">{session.title}</p>
          {session.speaker && (
            <p className="text-[13px] text-gray-500 mt-1">{session.speaker}</p>
          )}
          {session.location && (
            <p className="flex items-center gap-1.5 text-[12px] text-gray-400 mt-1">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {session.location}
            </p>
          )}
        </div>

        {/* Badge + chevron */}
        <div className="shrink-0 flex items-center gap-2 pt-0.5">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${badge.bg} ${badge.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {session.type}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50 text-xs text-gray-600 space-y-1.5">
          {session.speaker && (
            <p><span className="font-semibold text-gray-700">Speaker: </span>{session.speaker}</p>
          )}
          {session.location && (
            <p><span className="font-semibold text-gray-700">Venue: </span>{session.location}</p>
          )}
          {session.endTime && (
            <p><span className="font-semibold text-gray-700">Time: </span>{session.time} – {session.endTime}</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Schedule tab ─────────────────────────────────────── */
export default function ScheduleTab({
  serverSessions = [],
}: {
  serverSessions?: ProgrammeSession[];
}) {
  const [activeDay, setActiveDay] = useState(0);

  const SESSIONS =
    serverSessions && serverSessions.length > 0
      ? convertServerRows(serverSessions)
      : FALLBACK_SESSIONS;

  const sessions = SESSIONS[activeDay] ?? [];
  const featured = sessions.find((s) => s.featured);

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div className="grid grid-cols-3 gap-2">
        {DAYS.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={`rounded-2xl border px-3 py-3 text-left transition-all ${
              activeDay === d.key
                ? "bg-[#1B2B4B] border-[#1B2B4B] text-white shadow-md"
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
          >
            <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${activeDay === d.key ? "text-white/60" : "text-gray-400"}`}>
              {d.day}
            </p>
            <p className="text-lg font-black leading-none">{d.label}</p>
            <p className={`text-xs mt-0.5 ${activeDay === d.key ? "text-white/70" : "text-gray-500"}`}>{d.date}</p>
          </button>
        ))}
      </div>

      {/* Featured session */}
      {featured && (
        <div className="relative overflow-hidden rounded-2xl bg-[#1B2B4B] px-5 py-5 shadow-md">
          <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/[0.08] blur-2xl" />
          <div className="relative">
            {/* Star + FEATURED + time */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[11px] text-yellow-400">★</span>
              <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">FEATURED</p>
              <span className="text-[10px] text-white/40 ml-0.5">·</span>
              <span className="text-[10px] text-white/40">{featured.time} – {featured.endTime}</span>
            </div>
            <h3 className="text-lg font-black text-white leading-snug">{featured.title}</h3>
            {featured.speaker && (
              <p className="flex items-center gap-2 mt-2.5 text-[13px] text-white/70">
                {featured.speakerInitial && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white">
                    {featured.speakerInitial}
                  </span>
                )}
                {featured.speaker}
              </p>
            )}
            {featured.location && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-white/50">
                <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {featured.location}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 px-1">
        {(["plenary", "breakout", "workshop", "social"] as SessionType[]).map((type) => {
          const badge = TYPE_BADGE[type];
          return (
            <span key={type} className="flex items-center gap-1.5 text-[13px] text-gray-600 capitalize">
              <span className={`h-2.5 w-2.5 rounded-full ${badge.dot}`} />
              {type}
            </span>
          );
        })}
      </div>

      {/* Session list */}
      <div className="space-y-2.5">
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
