"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getDevAttendeeByEmail } from "@/lib/dev-store";

export type LookupResult =
  | { status: "found"; token: string }
  | { status: "not_found" }
  | { status: "error"; message: string };

/**
 * Server Action: look up a registered attendee by email and return
 * only their QR token (no sensitive data is sent to the browser).
 */
export async function lookupAttendeeByEmail(
  email: string
): Promise<LookupResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();

      const { data, error } = await supabase
        .from("attendees")
        .select("qr_token")
        .eq("email", trimmed)
        .maybeSingle();

      if (!error && data?.qr_token) {
        return { status: "found", token: data.qr_token };
      }
    } catch (err) {
      console.error("[lookup] Supabase lookup error:", err);
    }
  }

  // Fallback to dev store
  const devAtt = getDevAttendeeByEmail(trimmed);
  if (devAtt) {
    return { status: "found", token: devAtt.qr_token };
  }

  return { status: "not_found" };
}

