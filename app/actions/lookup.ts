"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

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

  if (!isSupabaseConfigured()) {
    // Dev fallback — return a demo token so the flow can be tested
    return { status: "found", token: "demo" };
  }

  try {
    const supabase = await createClient();

    // Server-side query: only qr_token is returned — email stays on the server
    const { data, error } = await supabase
      .from("attendees")
      .select("qr_token")
      .eq("email", trimmed)
      .maybeSingle();

    if (error) {
      console.error("Lookup error:", error);
      return { status: "error", message: "Something went wrong. Please try again." };
    }

    if (!data) {
      return { status: "not_found" };
    }

    return { status: "found", token: data.qr_token };
  } catch (err) {
    console.error("Lookup server exception:", err);
    return { status: "error", message: "Something went wrong. Please try again." };
  }
}
