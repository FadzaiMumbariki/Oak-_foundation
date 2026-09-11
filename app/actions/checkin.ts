"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getDevAttendeeByToken, recordDevCheckIn } from "@/lib/dev-store";

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

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();

      // 1. Look up the attendee by qr_token
      const { data: attendee, error: lookupError } = await supabase
        .from("attendees")
        .select("id, full_name, organization, role_title")
        .eq("qr_token", clean)
        .maybeSingle();

      if (lookupError) {
        console.error("[check-in] Lookup error:", lookupError);
      } else if (attendee) {
        // 2. Insert check-in (UNIQUE constraint handles double-counting)
        const { data: inserted, error: insertError } = await supabase
          .from("check_ins")
          .insert({
            attendee_id:   attendee.id,
            check_in_date: today,
            checked_in_at: new Date().toISOString(),
          })
          .select("checked_in_at")
          .single();

        if (insertError) {
          if (insertError.code === "23505") {
            return {
              status: "already_checked_in",
              message: `${attendee.full_name} has already checked in today.`,
            };
          }
          console.error("[check-in] Insert error:", insertError);
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
      }
    } catch (err) {
      console.error("[check-in] Supabase exception:", err);
    }
  }

  // Check dev store
  const devAtt = getDevAttendeeByToken(clean);
  if (devAtt) {
    const result = recordDevCheckIn(devAtt.id, today);
    if (result.status === "already_checked_in") {
      return {
        status: "already_checked_in",
        message: `${devAtt.full_name} has already checked in today.`,
      };
    }
    return {
      status: "success",
      attendee: {
        full_name:    devAtt.full_name,
        organization: devAtt.organization,
        role_title:   devAtt.role_title,
      },
      checkedInAt: result.checkedInAt,
    };
  }

  return { status: "not_found", message: "QR code not recognised." };
}

