import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import AttendanceDashboard from "./AttendanceDashboard";
import { fetchAttendanceSummary, AttendanceSummary } from "@/app/actions/attendance";

export const metadata: Metadata = {
  title: "Attendance — OAK Partner Convening 2026",
  robots: { index: false, follow: false },
};

export default async function AttendancePage() {
  const data: AttendanceSummary = await fetchAttendanceSummary();

  return (
    <AppShell variant="admin">
      <AttendanceDashboard data={data} />
    </AppShell>
  );
}
