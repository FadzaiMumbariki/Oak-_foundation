import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import CheckInScanner from "./CheckInScanner";

export const metadata: Metadata = {
  title: "Event Check-In — OAK Partner Convening 2026",
  robots: { index: false, follow: false },
};

export default function CheckInPage() {
  return (
    <AppShell variant="admin">
      <CheckInScanner />
    </AppShell>
  );
}
