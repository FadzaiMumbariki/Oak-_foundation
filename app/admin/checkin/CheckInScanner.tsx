"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { checkInAttendee } from "@/app/actions/checkin";
import type { CheckInResult } from "@/app/actions/checkin";

// ── Demo attendees for the "Simulate QR Scan" list ────────
const DEMO_ATTENDEES = [
  { initials: "CM",  name: "Collin Manyande",  token: "OAK-2026-7842-XXPH", role: "Partner",          color: "bg-[#1B2B4B]" },
  { initials: "JO",  name: "James Odhiambo",   token: "OAK-2026-1193-JWQA", role: "OAK Staff",         color: "bg-[#1B2B4B]" },
  { initials: "AD",  name: "Awa Diallo",        token: "OAK-2026-2034-MBU",  role: "Coordination Team", color: "bg-[#1B2B4B]" },
  { initials: "KM",  name: "Kayden Mamu",       token: "OAK-2026-5592-FWBN", role: "Partner",           color: "bg-[#1B2B4B]" },
];

const ROLE_BADGE: Record<string, string> = {
  "Partner":           "bg-blue-100 text-blue-700",
  "OAK Staff":         "bg-emerald-100 text-emerald-700",
  "Coordination Team": "bg-orange-100 text-orange-700",
  "Presenter":         "bg-purple-100 text-purple-700",
  "Observer":          "bg-gray-100 text-gray-600",
};

type ScanState =
  | { mode: "scanner" }
  | { mode: "success"; result: CheckInResult & { status: "success" } }
  | { mode: "error";   reason: string }
  | { mode: "already" };

export default function CheckInScanner() {
  const [scanState, setScanState] = useState<ScanState>({ mode: "scanner" });
  const [manualCode, setManualCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const didInitRef = useRef(false);

  // Start camera
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCameraActive(true);
    } catch {
      setCameraActive(false);
    }
  }

  // Stop camera
  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
  }

  // Start the camera once on mount + whenever we re-enter scanner mode
  useEffect(() => {
    if (scanState.mode === "scanner") {
      // Use microtask deferral to avoid synchronous state set within the effect caller
      const t = window.setTimeout(() => startCamera(), 0);
      return () => window.clearTimeout(t);
    } else {
      stopCamera();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanState.mode]);

  // Cleanup on unmount
  useEffect(() => {
    if (!didInitRef.current) {
      didInitRef.current = true;
    }
    return () => stopCamera();
  }, []);

  async function processToken(token: string) {
    setIsChecking(true);
    try {
      const result = await checkInAttendee(token.trim());
      if (result.status === "success") {
        setScanState({ mode: "success", result });
      } else if (result.status === "already_checked_in") {
        setScanState({ mode: "already" });
      } else {
        setScanState({ mode: "error", reason: result.message ?? "QR code not recognised" });
      }
    } catch {
      setScanState({ mode: "error", reason: "Something went wrong. Please try again." });
    } finally {
      setIsChecking(false);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    processToken(manualCode);
  }

  function reset() {
    setScanState({ mode: "scanner" });
    setManualCode("");
  }

  // ── Success screen ──────────────────────────────────────
  if (scanState.mode === "success") {
    const { attendee, checkedInAt } = scanState.result;
    const time = checkedInAt
      ? new Date(checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      : "";
    const dateStr = checkedInAt
      ? new Date(checkedInAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "";
    const initials = (attendee?.full_name ?? "??")
      .split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();

    return (
      <div className="space-y-4 max-w-xl">
        {/* Green success banner */}
        <div className="relative overflow-hidden rounded-2xl bg-[#22C55E] px-6 py-5 shadow-sm">
          <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/15 blur-xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <div>
              <p className="text-base font-black text-white">Checked In Successfully</p>
              {time && dateStr && (
                <p className="text-xs text-white/70">{time} · {dateStr}</p>
              )}
            </div>
          </div>
        </div>

        {/* Attendee card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B2B4B]">
              <span className="text-sm font-black text-white">{initials}</span>
            </div>
            <div>
              <p className="font-bold text-gray-900">{attendee?.full_name}</p>
              <p className="text-sm text-gray-500">{attendee?.organization}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[attendee?.role_title ?? ""] ?? "bg-gray-100 text-gray-600"}`}>
                • {attendee?.role_title}
              </span>
            </div>
          </div>

          {/* Next session + venue */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] px-4 py-3">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Next Session</p>
              <p className="text-sm font-bold text-gray-900">Opening Plenary</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#F9FAFB] px-4 py-3">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Venue</p>
              <p className="text-sm font-bold text-gray-900">Main Hall A</p>
            </div>
          </div>
        </div>

        {/* Live event status */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Live Event Status</p>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-semibold text-gray-900">Opening Plenary starting at 09:30</p>
          </div>
          <p className="text-xs text-gray-500 mb-2">74 of 110 attendees checked in · Main Hall A</p>
          <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-[#1B2B4B]" style={{ width: "67%" }} />
          </div>
        </div>

        {/* Scan next */}
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2B4B] py-3.5 text-sm font-bold text-white hover:bg-[#243a63] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Scan Next Attendee
        </button>
      </div>
    );
  }

  // ── Error screen ────────────────────────────────────────
  if (scanState.mode === "error" || scanState.mode === "already") {
    const isAlready = scanState.mode === "already";
    return (
      <div className="space-y-4 max-w-xl">
        {/* Red / amber banner */}
        <div className={`relative overflow-hidden rounded-2xl px-6 py-5 shadow-sm ${isAlready ? "bg-amber-500" : "bg-red-500"}`}>
          <div className="pointer-events-none absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/15 blur-xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              {isAlready ? (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8H3m2 0V6m-2 2h2V6m-2 0v2" />
                </svg>
              )}
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-white/60 uppercase mb-0.5">
                {isAlready ? "Already Checked In" : "Check-In Failed"}
              </p>
              <p className="text-base font-black text-white">
                {isAlready ? "Attendee Already Checked In" : "QR Not Recognised"}
              </p>
              <p className="text-xs text-white/70 mt-0.5">
                {isAlready ? "This attendee has already checked in today." : "Code is invalid or unregistered"}
              </p>
            </div>
          </div>
        </div>

        {!isAlready && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-gray-700">Possible reasons</p>
            </div>
            <ul className="space-y-2">
              {[
                "QR code belongs to a different event",
                "Registration was not completed",
                "Code has been altered or corrupted",
                "Attendee registered under a different email",
              ].map((reason) => (
                <li key={reason} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2B4B] py-3.5 text-sm font-bold text-white hover:bg-[#243a63] transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>

        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Contact Coordination Team
        </button>
      </div>
    );
  }

  // ── Main scanner screen ─────────────────────────────────
  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h1 className="text-2xl font-black text-[#1B2B4B]">Event Check-In</h1>
        <p className="text-sm text-gray-500 mt-1">Scan an attendee QR code to check them in</p>
      </div>

      {/* Camera viewport */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] aspect-[4/3] md:aspect-[4/3] shadow-lg">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
        />

        {/* Scan frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative h-48 w-48">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
              "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
              "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
              "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
            ].map((cls, i) => (
              <div key={i} className={`absolute h-8 w-8 border-white ${cls}`} />
            ))}
          </div>
        </div>

        {/* Bottom hint */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-4 text-center">
          <p className="text-white text-xs font-medium">
            {cameraActive ? "Position QR code within the frame" : "Tap to enable camera"}
          </p>
          {cameraActive && (
            <p className="text-white/50 text-[10px] mt-1 flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse" />
              Hold camera steady · Auto scans in 1–2 seconds
            </p>
          )}
        </div>

        {!cameraActive && (
          <button
            onClick={startCamera}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white text-sm font-medium">Enable Camera</p>
            </div>
          </button>
        )}
      </div>

      {/* Simulate QR scan (dev / demo) */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Simulate QR Scan</p>
        </div>
        <div className="divide-y divide-gray-100">
          {DEMO_ATTENDEES.map((a) => (
            <button
              key={a.name}
              onClick={() => processToken("demo-" + a.name.replace(/\s+/g, "-").toLowerCase())}
              disabled={isChecking}
              className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.color}`}>
                <span className="text-xs font-black text-white">{a.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                <p className="text-[11px] font-mono text-gray-400">{a.token}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${ROLE_BADGE[a.role] ?? "bg-gray-100 text-gray-600"}`}>
                • {a.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual code entry */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Manual Code Entry</p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="OAK-2026-XXXX-XXXX"
            className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-mono text-gray-800
                       placeholder:text-gray-400 focus:outline-none focus:border-[#1B2B4B] focus:ring-2 focus:ring-[#1B2B4B]/10"
          />
          <button
            type="submit"
            disabled={isChecking || !manualCode.trim()}
            className="shrink-0 rounded-xl bg-[#1B2B4B] px-5 py-2.5 text-sm font-bold text-white
                       hover:bg-[#243a63] transition-colors disabled:opacity-50"
          >
            {isChecking ? "…" : "Check"}
          </button>
        </form>
      </div>
    </div>
  );
}
