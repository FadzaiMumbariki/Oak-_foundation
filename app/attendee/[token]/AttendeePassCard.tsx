"use client";

import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { AttendeePass } from "@/lib/types";

export default function AttendeePassCard({ attendee }: { attendee: AttendeePass }) {
  const qrRef = useRef<SVGSVGElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const qrValue =
    typeof window !== "undefined"
      ? `${window.location.origin}/attendee/${attendee.qr_token}`
      : `/attendee/${attendee.qr_token}`;

  function handleDownload() {
    setIsDownloading(true);
    try {
      const svg = qrRef.current;
      if (!svg) { setIsDownloading(false); return; }
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas  = document.createElement("canvas");
      const ctx     = canvas.getContext("2d");
      const img     = new Image();
      const SIZE    = 600;
      canvas.width  = SIZE;
      canvas.height = SIZE;
      img.onload = () => {
        if (!ctx) { setIsDownloading(false); return; }
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, SIZE, SIZE);
        const qrSize = 520;
        const offset = (SIZE - qrSize) / 2;
        ctx.drawImage(img, offset, offset, qrSize, qrSize);
        const link = document.createElement("a");
        link.download = `OAK-2026-QR-${attendee.full_name.replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setIsDownloading(false);
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch {
      setIsDownloading(false);
    }
  }

  // Token display: OAK-2026-XXXX-XXXX format
  const raw = attendee.qr_token.replace(/-/g, "").toUpperCase().slice(0, 8);
  const displayToken = `OAK-2026-${raw.slice(0, 4)}-${raw.slice(4, 8)}`;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* ── Success hero banner ─────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-[#1B2B4B] px-6 py-6 shadow-sm">
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 mt-0.5">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-0.5">
              Registration Complete
            </p>
            <h1 className="text-2xl font-black text-white leading-tight">
              You&apos;re Registered,<br />{attendee.full_name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-white/60 mt-1">{attendee.organization}</p>
          </div>
        </div>
      </div>

      {/* ── QR code card ────────────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-5 text-center">
          Your Entry Pass
        </p>

        {/* QR code */}
        <div className="flex justify-center mb-4">
          <div className="rounded-2xl border-2 border-gray-100 bg-white p-5 shadow-inner">
            <QRCodeSVG
              ref={qrRef}
              value={qrValue}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#1B2B4B"
              bgColor="#FFFFFF"
            />
          </div>
        </div>

        <div className="text-center space-y-1 mb-5">
          <p className="font-mono text-xs font-semibold text-gray-500 tracking-widest">
            {displayToken}
          </p>
          <p className="text-xs text-gray-400">Present at event entrance for check-in</p>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1B2B4B] py-3.5 text-sm font-bold text-white
                     hover:bg-[#243a63] transition-colors disabled:opacity-60"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {isDownloading ? "Saving…" : "Download QR Code"}
        </button>
      </div>

      {/* ── Registration details ─────────────────────────── */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
            Registration Details
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { label: "Name",        value: attendee.full_name },
            { label: "Organisation", value: attendee.organization },
            { label: "Role",        value: attendee.role_title },
            { label: "Event Dates", value: "9–11 November 2026" },
            { label: "Location",    value: "Cresta Lodge Msasa, Harare" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-gray-500">{label}</span>
              <span className="text-xs font-semibold text-gray-900 text-right max-w-[60%]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Register another attendee */}
      <div className="text-center pb-2">
        <a
          href="/register"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#1B2B4B] transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Register another attendee
        </a>
      </div>
    </div>
  );
}
