"use client";

import { useState } from "react";
import type { Partner as DBPartner } from "@/lib/types";

/* ── Types ────────────────────────────────────────────── */
type Tag = string;

interface Partner {
  id: string;
  initials: string;
  name: string;
  subline: string;
  tags: Tag[];
  since: string;
  website: string;
  about: string;
  leadContact?: { name: string; role: string; initials: string };
  isOak?: boolean;
  category: string;
}

function deriveInitials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function convertPartners(rows: DBPartner[]): Partner[] {
  return rows.map((r, i) => ({
    id: r.id,
    initials: deriveInitials(r.name),
    name: r.name,
    subline: r.is_sub_partner ? "Sub-partner" : "Partner",
    tags: r.is_sub_partner ? ["Sub-Partner"] : ["Partner"],
    since: r.is_sub_partner ? "Sub-partner" : "Partner",
    website: r.website_url ? stripProtocol(r.website_url) : "",
    about: r.description ?? "",
    category: r.is_sub_partner ? "Sub-Partner Africa" : (i < 4 ? "OAK" : "Global South-Africa"),
  }));
}

/* ── Data ─────────────────────────────────────────────── */
const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "osf",
    initials: "OSF",
    name: "Open Society Foundations",
    subline: "Partner since 2018",
    tags: ["Foundation", "Global Org", "Human Rights"],
    since: "Partner since 2018",
    website: "opensocietyfoundations.org",
    category: "OAK",
    about: "Open Society Foundations builds vibrant and tolerant democracies. OSF partnership covers digital rights and justice initiatives across Eastern Europe and various base.",
    leadContact: { name: "Maria Schmidt", role: "Partnerships Manager", initials: "MS" },
  },
  {
    id: "aca",
    initials: "ACA",
    name: "Africa Climate Alliance",
    subline: "Sub-partner since 2020",
    tags: ["NGO", "Climate Justice", "South Africa"],
    since: "Sub-partner since 2020",
    website: "africaclimatealliance.org",
    category: "Sub-Partner Africa",
    about: "Africa Climate Alliance advances climate justice through advocacy and community organising across Southern and East Africa.",
    leadContact: { name: "Samuel Okafor", role: "Programme Director", initials: "SO" },
  },
  {
    id: "nec",
    initials: "NEC",
    name: "Nordic Evaluation Centre",
    subline: "Partner since 2019",
    tags: ["Research", "Evaluation", "Grantmaking"],
    since: "Partner since 2019",
    website: "nordiceval.org",
    category: "OAK",
    about: "Nordic Evaluation Centre provides independent evaluation services for philanthropic organisations working in complex environments.",
    leadContact: { name: "Dr. Ingrid Heim", role: "Lead Evaluator", initials: "IH" },
  },
  {
    id: "mrg",
    initials: "MRG",
    name: "MENA Rights Group",
    subline: "Sub-partner since 2021 · North Africa & Gulf area",
    tags: ["NGO", "Human Rights", "Documentation"],
    since: "Sub-partner since 2021",
    website: "menarights.org",
    category: "Sub-Partner Africa",
    about: "MENA Rights Group documents human rights violations and advocates for accountability across the Middle East and North Africa.",
    leadContact: { name: "Fatima Zahra Benali", role: "Executive Director", initials: "FZB" },
  },
  {
    id: "dfi",
    initials: "DFI",
    name: "Digital Frontiers Institute",
    subline: "Global · Cape Town",
    tags: ["Research", "Digital Rights", "Net Neutrality"],
    since: "Partner since 2022",
    website: "digitalfrontiers.org",
    category: "OAK",
    about: "Digital Frontiers Institute researches and advocates for open, accessible and rights-respecting digital infrastructure globally.",
    leadContact: { name: "Li Wei", role: "Research Director", initials: "LW" },
  },
  {
    id: "gal",
    initials: "GAL",
    name: "Global Advocacy Lab",
    subline: "Global",
    tags: ["NGO", "Policy Advocacy", "Campaigning"],
    since: "Partner since 2020",
    website: "globaladvocacylab.org",
    category: "OakFound Group",
    about: "Global Advocacy Lab develops advocacy capacity for civil society organisations operating in restricted political environments.",
    leadContact: { name: "James Odhiambo", role: "Strategy Lead", initials: "JO" },
  },
  {
    id: "gn",
    initials: "GN",
    name: "Salesforce Philanthropies",
    subline: "Global, CA",
    tags: ["Foundation", "Finance", "Policy"],
    since: "Partnership since 2020",
    website: "salesforce.org",
    category: "Global South-Africa",
    about: "Salesforce Philanthropies invests in technology and economic mobility initiatives for nonprofits and NGOs worldwide.",
    leadContact: { name: "Awa Diallo", role: "Partnerships Lead", initials: "AD" },
  },
  {
    id: "efg",
    initials: "EFG",
    name: "Environmental Funders Group",
    subline: "Global",
    tags: ["Network", "Climate Justice", "Grantors"],
    since: "Member since 2021",
    website: "envfunders.org",
    category: "Global South-Africa",
    about: "Environmental Funders Group is a network of philanthropic organisations committed to collaborative environmental grantmaking.",
    leadContact: { name: "Kayden Mamu", role: "Network Director", initials: "KM" },
  },
];

const FILTERS = ["All types", "OAK", "Sub-Partner Africa", "OakFound Group", "Global South-Africa"];

const TAG_COLOR: Record<string, string> = {
  Foundation:        "bg-blue-100 text-blue-700",
  "Global Org":      "bg-indigo-100 text-indigo-700",
  "Human Rights":    "bg-rose-100 text-rose-700",
  NGO:               "bg-gray-100 text-gray-600",
  "Climate Justice": "bg-green-100 text-green-700",
  "South Africa":    "bg-amber-100 text-amber-700",
  Research:          "bg-purple-100 text-purple-700",
  Evaluation:        "bg-purple-100 text-purple-700",
  Grantmaking:       "bg-blue-100 text-blue-700",
  Documentation:     "bg-gray-100 text-gray-600",
  "Digital Rights":  "bg-cyan-100 text-cyan-700",
  "Net Neutrality":  "bg-cyan-100 text-cyan-700",
  "Policy Advocacy": "bg-orange-100 text-orange-700",
  Campaigning:       "bg-orange-100 text-orange-700",
  Finance:           "bg-emerald-100 text-emerald-700",
  Policy:            "bg-indigo-100 text-indigo-700",
  Network:           "bg-teal-100 text-teal-700",
  Grantors:          "bg-teal-100 text-teal-700",
  "OAK Staff":       "bg-blue-100 text-blue-700",
};

function tagCls(tag: string) {
  return TAG_COLOR[tag] ?? "bg-gray-100 text-gray-600";
}

/* ── Partner detail panel ─────────────────────────────── */
function PartnerDetail({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Navy hero */}
      <div className="relative overflow-hidden bg-[#1B2B4B] px-5 py-5">
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center gap-3 relative">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <span className="text-xs font-black text-white">{partner.initials}</span>
          </div>
          <h3 className="text-base font-black text-white">{partner.name}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3 relative">
          {partner.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-white/80">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">About</p>
        <p className="text-xs text-gray-600 leading-relaxed">{partner.about}</p>
      </div>

      {/* Lead contact */}
      {partner.leadContact && (
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">Lead at Convening</p>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B2B4B]">
              <span className="text-[11px] font-black text-white">{partner.leadContact.initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{partner.leadContact.name}</p>
              <p className="text-xs text-gray-500">{partner.leadContact.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4 space-y-2">
        <a
          href={`https://${partner.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full rounded-xl bg-[#1B2B4B] px-4 py-3 text-sm font-bold text-white hover:bg-[#243a63] transition-colors"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
            </svg>
            Visit Website
          </span>
          <svg className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        <button className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Message
        </button>
      </div>
    </div>
  );
}

/* ── Partner row ──────────────────────────────────────── */
function PartnerRow({ partner, onSelect, selected }: { partner: Partner; onSelect: () => void; selected: boolean }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-colors rounded-xl border shadow-sm ${
        selected ? "border-[#1B2B4B] bg-[#F0F4FF]" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {/* Logo / initials */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1B2B4B]">
        <span className="text-[11px] font-black text-white">{partner.initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-bold text-gray-900">{partner.name}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{partner.subline}</p>
          </div>
          <svg className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {partner.tags.map((t) => (
            <span key={t} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagCls(t)}`}>
              {t}
            </span>
          ))}
        </div>

        {/* Website */}
        <p className="text-[10px] text-gray-400 mt-1.5">{partner.website} ↗</p>
      </div>
    </button>
  );
}

/* ── Main component ───────────────────────────────────── */
export default function PartnerDirectory({
  serverPartners = [],
}: {
  serverPartners?: DBPartner[];
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All types");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const PARTNERS: Partner[] =
    serverPartners && serverPartners.length > 0
      ? convertPartners(serverPartners)
      : FALLBACK_PARTNERS;

  const SUB_PARTNERS = PARTNERS.filter(
    (p) => p.category === "Sub-Partner Africa"
  ).slice(0, 3);

  const filtered = PARTNERS.filter((p) => {
    const matchFilter = activeFilter === "All types" || p.category === activeFilter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const selected = PARTNERS.find((p) => p.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search organisations, focus areas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1B2B4B] focus:ring-2 focus:ring-[#1B2B4B]/10"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === f
                ? "bg-[#1B2B4B] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* OAK sub-partners row */}
      {(activeFilter === "All types" || activeFilter === "Sub-Partner Africa") && !search && SUB_PARTNERS.length > 0 && (
        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">OAK Sub-Partners</p>
          <div className="grid grid-cols-3 gap-2">
            {SUB_PARTNERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}
                className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 transition-all ${
                  selectedId === p.id
                    ? "border-[#1B2B4B] bg-[#F0F4FF]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B2B4B]">
                  <span className="text-[11px] font-black text-white">{p.initials}</span>
                </div>
                <p className="text-[10px] font-bold text-gray-700 text-center leading-tight">{p.initials}</p>
                <p className="text-[9px] text-gray-400 text-center leading-tight truncate w-full">{p.name.split(" ").slice(0, 2).join(" ")}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected partner detail */}
      {selected && (
        <PartnerDetail
          partner={selected}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/* All partners list */}
      <div>
        <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">All Partners</p>
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <p className="text-sm text-gray-500">No partners match your search.</p>
            </div>
          ) : (
            filtered.map((p) => (
              <PartnerRow
                key={p.id}
                partner={p}
                selected={selectedId === p.id}
                onSelect={() => setSelectedId(p.id === selectedId ? null : p.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
