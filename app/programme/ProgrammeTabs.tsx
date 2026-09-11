"use client";

import { useState } from "react";
import ScheduleTab from "./ScheduleTab";
import DocsTab from "./DocsTab";
import type { ProgrammeSession } from "@/lib/types";

export default function ProgrammeTabs({
  serverSessions = [],
}: {
  serverSessions?: ProgrammeSession[];
}) {
  const [tab, setTab] = useState<"schedule" | "docs">("schedule");

  return (
    <div>
      {/* Tab switcher — gray container with white active pill */}
      <div className="flex rounded-xl bg-gray-200/60 p-1 mb-5">
        {(["schedule", "docs"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "schedule" ? "Schedule" : "Docs"}
          </button>
        ))}
      </div>

      {tab === "schedule" ? (
        <ScheduleTab serverSessions={serverSessions} />
      ) : (
        <DocsTab />
      )}
    </div>
  );
}
