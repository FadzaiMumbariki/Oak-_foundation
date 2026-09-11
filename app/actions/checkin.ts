"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type CheckInResult =
  | {
      status: "success";
      attendee: {
        full_name: string;
        organization: string;
        role_title: string;
      };
      checkedInAt: string;
    }
  | { status: "already_checked_in"; message: string }
  | { status: "not_found";          message: string }
  | { status: "error";              message: string };

/**
 * Record a daily check-in for the attendee identified by qr_token.
 * The UNIQUE constraint (attendee_id, check_in_date) prevents double-counting.
 */
export async function checkInAttendee(token: string): Promise<CheckInResult> {
  const clean = token.trim();
  if (!clean) {
    return { status: "not_found", message: "No token provided." };
  }

  // ── Dev / demo fallback ──────────────────────────────
  if (!isSupabaseConfigured() || clean.startsWith("demo-")) {
    // Simulate a successful check-in for development
    return {
      status: "success",
      attendee: {
        full_name:    "Maria Schmidt",
        organization: "Open Society Foundations",
        role_title:   "Partner",
      },
      checkedInAt: new Date().toISOString(),
    };
  }

  try {
    const supabase = await createClient();

    // 1. Look up the attendee by qr_token
    const { data: attendee, error: lookupError } = await supabase
      .from("attendees")
      .select("id, full_name, organization, role_title")
      .eq("qr_token", clean)
      .maybeSingle();

    if (lookupError) {
      console.error("Check-in lookup error:", lookupError);
      return { status: "error", message: "Database error during lookup." };
    }

    if (!attendee) {
      return { status: "not_found", message: "QR code not recognised." };
    }

    // 2. Insert check-in (UNIQUE constraint handles double-counting)
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const { data: inserted, error: insertError } = await supabase
      .from("check_ins")
      .insert({
        attendee_id:    attendee.id,
        check_in_date:  today,
        checked_in_at:  new Date().toISOString(),
      })
      .select("checked_in_at")
      .single();

    if (insertError) {
      // Postgres unique violation = already checked in today
      if (insertError.code === "23505") {
        return {
          status: "already_checked_in",
          message: `${attendee.full_name} has already checked in today.`,
        };
      }
      console.error("Check-in insert error:", insertError);
      return { status: "error", message: "Failed to record check-in." };
    }

    return {
      status: "success",
      attendee: {
        full_name:    attendee.full_name,
        organization: attendee.organization,
        role_title:   attendee.role_title,
      },
      checkedInAt: inserted.checked_in_at,
    };
  } catch (err) {
    console.error("Check-in exception:", err);
    return { status: "error", message: "Unexpected error. Please try again." };
  }
}
