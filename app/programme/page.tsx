import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import ProgrammeTabs from "./ProgrammeTabs";
import { fetchProgrammeSessions } from "@/app/actions/content";
import type { ProgrammeSession } from "@/lib/types";

export const metadata: Metadata = {
  title: "Programme — OAK Partner Convening 2026",
};

export default async function ProgrammePage() {
  const sessions: ProgrammeSession[] = await fetchProgrammeSessions();

  return (
    <AppShell variant="public">
      <div className="max-w-2xl">
        <h1 className="oak-h1">Programme</h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-5">
          OAK Partner Convening 2026
        </p>
        <ProgrammeTabs serverSessions={sessions} />
      </div>
    </AppShell>
  );
}
