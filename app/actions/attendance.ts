"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
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
 * Uses the ADMIN (service-role) Supabase client because RLS denies
 * anonymous access to attendee + check_in rows.
 *
 * Falls back to zeroed state when Supabase isn't configured
 * (development / preview deployments).
 */
export async function fetchAttendanceSummary(): Promise<AttendanceSummary> {
  const perDay = EVENT_DATES.map((date, i) => ({
    date,
    label: `Day ${i + 1}`,
    count: 0,
  }));

  const empty: AttendanceSummary = {
    totalRegistered: 0,
    totalCheckedIn: 0,
    perDay,
    recentCheckIns: [],
  };

  if (!isSupabaseConfigured()) return empty;

  try {
    const supabase = await createAdminClient();

    // 1. Registered count
    const { count: registered, error: regErr } = await supabase
      .from("attendees")
      .select("*", { count: "exact", head: true });
    if (regErr) console.error("[attendance] register count error:", regErr);
    empty.totalRegistered = registered ?? 0;

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

    if (ciErr) {
      console.error("[attendance] check_ins query error:", ciErr);
      return empty;
    }

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

    // 3. Tally per day
    for (const row of flat) {
      const day = perDay.find((d) => d.date === row.check_in_date);
      if (day) day.count += 1;
    }
    empty.totalCheckedIn = flat.reduce((s, _) => s + 1, 0);

    // 4. Recent check-ins (last 10)
    empty.recentCheckIns = flat.slice(0, 10);

    return empty;
  } catch (err) {
    console.error("[attendance] unexpected error:", err);
    return empty;
  }
}
