import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import NametagsGenerator from "./NametagsGenerator";
import { fetchAllAttendees, NametagAttendee } from "@/app/actions/nametags";

export const metadata: Metadata = {
  title: "Nametags — OAK Partner Convening 2026",
  robots: { index: false, follow: false },
};

export default async function NametagsPage() {
  const attendees: NametagAttendee[] = await fetchAllAttendees();

  return (
    <AppShell variant="admin">
      <NametagsGenerator attendees={attendees} />
    </AppShell>
  );
}
