"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAllDevAttendees, getDevCheckIns } from "@/lib/dev-store";
import { EVENT_DATES } from "@/lib/types";

export interface AttendanceSummary {
  totalRegistered: number;
  totalCheckedIn: number;
  perDay: {
    date: string;
    label: string;
    count: number;
  }[];
  recentCheckIns: {
    full_name: string;
    organization: string;
    role_title: string;
    checked_in_at: string;
    check_in_date: string;
  }[];
}

/**
 * Server Action: fetch live attendance headcount.
 * Uses the ADMIN (service-role) Supabase client when configured,
 * or falls back to the persistent dev-store.
 */
export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const perDay = EVENT_DATES.map((date, i) => ({
    date,
    label: `Day ${i + 1}`,
    count: 0,
  }));

  const summary: AttendanceSummary = {
    totalRegistered: 0,
    totalCheckedIn: 0,
    perDay,
    recentCheckIns: [],
  };

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();

      // 1. Registered count
      const { count: registered, error: regErr } = await supabase
        .from("attendees")
        .select("*", { count: "exact", head: true });
      if (regErr) console.error("[attendance] register count error:", regErr);
      summary.totalRegistered = registered ?? 0;

      // 2. All check-ins (joined with attendee names)
      type CheckInJoin = {
        check_in_date: string;
        checked_in_at: string;
        attendees: { full_name: string; organization: string; role_title: string }[];
      };
      const { data: rows, error: ciErr } = await supabase
        .from("check_ins")
        .select(
          `check_in_date, checked_in_at,
           attendees: attendee_id (full_name, organization, role_title)`
        )
        .order("checked_in_at", { ascending: false })
        .limit(50);

      if (!ciErr && rows) {
        const flat = ((rows ?? []) as unknown as CheckInJoin[]).map((r) => {
          const a = r.attendees?.[0];
          return {
            check_in_date: String(r.check_in_date),
            checked_in_at: String(r.checked_in_at),
            full_name: a?.full_name ?? "Unknown",
            organization: a?.organization ?? "",
            role_title: a?.role_title ?? "",
          };
        });

        for (const row of flat) {
          const day = perDay.find((d) => d.date === row.check_in_date);
          if (day) day.count += 1;
        }
        summary.totalCheckedIn = flat.length;
        summary.recentCheckIns = flat.slice(0, 10);
        return summary;
      }
    } catch (err) {
      console.error("[attendance] unexpected Supabase error:", err);
    }
  }

  // Fallback to dev store
  const devAttendees = getAllDevAttendees();
  const devCheckIns = getDevCheckIns();

  summary.totalRegistered = devAttendees.length;
  summary.totalCheckedIn = devCheckIns.length;

  for (const c of devCheckIns) {
    const day = perDay.find((d) => d.date === c.check_in_date);
    if (day) day.count += 1;
  }

  summary.recentCheckIns = devCheckIns.slice(0, 10).map((c) => ({
    full_name: c.attendee.full_name,
    organization: c.attendee.organization,
    role_title: c.attendee.role_title,
    checked_in_at: c.checked_in_at,
    check_in_date: c.check_in_date,
  }));

  return summary;
}

