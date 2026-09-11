"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getAllDevAttendees } from "@/lib/dev-store";

export interface NametagAttendee {
  id: string;
  full_name: string;
  organization: string;
  sub_partner: string | null;
  role_title: string;
  qr_token: string;
}

export async function fetchAllAttendees(): Promise<NametagAttendee[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("attendees")
        .select("id, full_name, organization, sub_partner, role_title, qr_token")
        .order("full_name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as NametagAttendee[];
      }
    } catch (err) {
      console.error("[nametags] fetch error:", err);
    }
  }

  // Fallback to dev store
  const devList = getAllDevAttendees();
  return devList.map((a) => ({
    id: a.id,
    full_name: a.full_name,
    organization: a.organization,
    sub_partner: a.sub_partner,
    role_title: a.role_title,
    qr_token: a.qr_token,
  }));
}

