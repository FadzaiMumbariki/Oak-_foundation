"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ProgrammeSession, Partner } from "@/lib/types";

/**
 * Fetch programme sessions from Supabase (ordered by date + sort_order).
 * Falls back to an empty array when DB isn't configured — the client-side
 * ScheduleTab component already has a full static dataset as backup.
 */
export async function fetchProgrammeSessions(): Promise<ProgrammeSession[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("programme_sessions")
      .select("*")
      .order("session_date", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[programme] query error:", error);
      return [];
    }
    return (data ?? []) as ProgrammeSession[];
  } catch (err) {
    console.error("[programme] unexpected error:", err);
    return [];
  }
}

/**
 * Fetch the partner directory.
 * Client-side PartnerDirectory already contains a rich mock list; we use
 * the DB rows only when available.
 */
export async function fetchPartners(): Promise<Partner[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[partners] query error:", error);
      return [];
    }
    return (data ?? []) as Partner[];
  } catch (err) {
    console.error("[partners] unexpected error:", err);
    return [];
  }
}
