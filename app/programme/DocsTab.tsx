"use client";

/* ── Session notes data ───────────────────────────────── */
const NOTES = [
  {
    id: "n1",
    author: "Maria Schmidt",
    session: "Opening Plenary · Day 1, 09:30",
    avatar: "MS",
    text: "The rights-based approaches session surfaced strong dynamics for a shared learning ambition. OAK will follow-up with MENA Rights Group on co-programming opportunities for the Mediterranean region.",
  },
  {
    id: "n2",
    author: "James Odhiambo",
    session: "Digital Rights · Day 1, 14:45",
    avatar: "JO",
    text: "Digital Rights breakout participants were a working group to sharetrack for operating in resistant digital environments. Immediate steps: Digital Frontiers, Access Now, EFF.",
  },
  {
    id: "n3",
    author: "Awa Diallo",
    session: "Partner Spotlight · Day 1, 13:30",
    avatar: "AD",
    text: "Strategy, communications workshop highly noted. Produce adaptive messaging framework to diversify application across 40% of the portfolio. Responding follow-up bodies.",
  },
  {
    id: "n4",
    author: "Prof. Inese Ozola",
    session: "Closing Plenary · Day 3, 14:30",
    avatar: "IO",
    text: "Framework-backed consensual philanthropy trends to accept/manage transformation blueprints and establish structuring. Key ask: OAK to publish Future report alongside outcomes alpha.",
  },
];

/* ── Resources data ───────────────────────────────────── */
const RESOURCES = [
  { id: "r1", title: "Opening Plenary Presentation", meta: "PDF · 12.4MB · Day 1" },
  { id: "r2", title: "Side Funding Overview 2025–26", meta: "PPT · 5.8MB · Day 1" },
  { id: "r3", title: "Notes: Financing Practicum",    meta: "DOCX · 1.2MB · Day 2" },
  { id: "r4", title: "Partner Contact Directory",     meta: "XLSX · 0.4MB · Day 2" },
  { id: "r5", title: "Photo Gallery Slide Show",      meta: "ZIP · 134 MB · All Days" },
];

/* ── Key takeaways ────────────────────────────────────── */
const TAKEAWAYS = [
  "Philanthropy needs to accept the year from the points for systems change.",
  "Shared learning infrastructure is the most competitive resource across the portfolio.",
  "Digital rights must be integrated into all programme areas, not siloed.",
  "Multi-thread funding significantly improves grantee resilience.",
  "Peer workshops created more valuable than export-led sessions: 50% vs 74%.",
];

/* ── Photo placeholders ───────────────────────────────── */
const PHOTOS = [
  { id: "p1", bg: "bg-gray-800" },
  { id: "p2", bg: "bg-slate-700" },
  { id: "p3", bg: "bg-gray-700" },
  { id: "p4", bg: "bg-slate-600" },
  { id: "p5", bg: "bg-gray-600" },
  { id: "p6", bg: "bg-slate-800" },
];

/* ── Download icon ────────────────────────────────────── */
function DownloadIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

export default function DocsTab() {
  return (
    <div className="space-y-6">

      {/* ── Session Notes ──────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#1B2B4B]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Session Notes
          </h2>
          <button className="rounded-lg bg-[#1B2B4B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#243a63] transition-colors">
            + Add Note
          </button>
        </div>

        <div className="space-y-3">
          {NOTES.map((note) => (
            <div key={note.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B2B4B]">
                  <span className="text-[10px] font-black text-white">{note.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-900">{note.author}</p>
                    <p className="text-[10px] text-gray-400 shrink-0">{note.session}</p>
                  </div>
                  <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{note.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo Gallery ─────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-[#1B2B4B]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Photo Gallery
          </h2>
          <button className="text-xs text-[#1B2B4B] font-semibold hover:underline">Browse</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PHOTOS.map((p) => (
            <div
              key={p.id}
              className={`${p.bg} rounded-xl aspect-[4/3] flex items-center justify-center`}
            >
              <svg className="h-8 w-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">Photos will be added during the event</p>
      </section>

      {/* ── Key Takeaways ─────────────────────────── */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#1B2B4B] mb-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Key Takeaways
        </h2>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2.5">
          {TAKEAWAYS.map((t, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1B2B4B]" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── Resources ─────────────────────────────── */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-bold text-[#1B2B4B] mb-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          Resources
        </h2>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden divide-y divide-gray-100">
          {RESOURCES.map((r) => (
            <button
              key={r.id}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
            >
              {/* File icon */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F4FF] border border-[#1B2B4B]/10">
                <svg className="h-4 w-4 text-[#1B2B4B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{r.title}</p>
                <p className="text-[10px] text-gray-400">{r.meta}</p>
              </div>
              <DownloadIcon />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
