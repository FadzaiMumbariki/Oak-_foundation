"use server";

import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface NametagAttendee {
  id: string;
  full_name: string;
  organization: string;
  sub_partner: string | null;
  role_title: string;
  qr_token: string;
}

export async function fetchAllAttendees(): Promise<NametagAttendee[]> {
  const fallback: NametagAttendee[] = [
    {
      id: "demo-1",
      full_name: "Collin Manyande",
      organization: "Open Society Foundations",
      sub_partner: null,
      role_title: "Partner",
      qr_token: "OAK-2026-7842-XXPH",
    },
    {
      id: "demo-2",
      full_name: "James Odhiambo",
      organization: "OAK Foundation",
      sub_partner: null,
      role_title: "OAK Staff",
      qr_token: "OAK-2026-1193-JWQA",
    },
    {
      id: "demo-3",
      full_name: "Awa Diallo",
      organization: "Salesforce Philanthropies",
      sub_partner: null,
      role_title: "Coordination Team",
      qr_token: "OAK-2026-2034-MBU",
    },
    {
      id: "demo-4",
      full_name: "Kayden Mamu",
      organization: "Environmental Funders Group",
      sub_partner: null,
      role_title: "Partner",
      qr_token: "OAK-2026-5592-FWBN",
    },
    {
      id: "demo-5",
      full_name: "Maria Schmidt",
      organization: "Open Society Foundations",
      sub_partner: null,
      role_title: "Presenter",
      qr_token: "OAK-2026-8821-PQMS",
    },
    {
      id: "demo-6",
      full_name: "Dr. Helena Moreau",
      organization: "OAK Foundation",
      sub_partner: null,
      role_title: "OAK Staff",
      qr_token: "OAK-2026-3347-ZXKL",
    },
    {
      id: "demo-7",
      full_name: "Samuel Okafor",
      organization: "Africa Climate Alliance",
      sub_partner: "Sub-partner",
      role_title: "Presenter",
      qr_token: "OAK-2026-9902-VBND",
    },
    {
      id: "demo-8",
      full_name: "Fatima Zahra Benali",
      organization: "MENA Rights Group",
      sub_partner: "Sub-partner",
      role_title: "Partner",
      qr_token: "OAK-2026-1120-RTYU",
    },
  ];

  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("attendees")
      .select("id, full_name, organization, sub_partner, role_title, qr_token")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("[nametags] fetch error:", error);
      return fallback;
    }

    return (data ?? []) as NametagAttendee[];
  } catch (err) {
    console.error("[nametags] unexpected error:", err);
    return fallback;
  }
}
