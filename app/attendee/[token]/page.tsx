import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getDevAttendeeByToken } from "@/lib/dev-store";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import AttendeePassCard from "./AttendeePassCard";
import type { AttendeePass } from "@/lib/types";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: "You're Registered — OAK Partner Convening 2026",
    description: "Your digital pass and QR code for the OAK Foundation Partner Convening.",
    robots: { index: false, follow: false },
  };
}

export default async function AttendeePage({ params }: Props) {
  const { token } = await params;
  let attendee: AttendeePass | null = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createAdminClient();
      const { data, error } = await supabase
        .from("attendees")
        .select("id, full_name, organization, sub_partner, role_title, qr_token")
        .eq("qr_token", token)
        .maybeSingle();

      if (!error && data) {
        attendee = data as AttendeePass;
      }
    } catch (err) {
      console.error("[attendee-pass] Supabase fetch error:", err);
    }
  }

  // Check dev-store for real registered attendees in local dev
  if (!attendee) {
    const devAtt = getDevAttendeeByToken(token);
    if (devAtt) {
      attendee = {
        id: devAtt.id,
        full_name: devAtt.full_name,
        organization: devAtt.organization,
        sub_partner: devAtt.sub_partner,
        role_title: devAtt.role_title,
        qr_token: devAtt.qr_token,
      };
    }
  }

  if (!attendee) {
    notFound();
  }

  return (
    <AppShell variant="public">
      <AttendeePassCard attendee={attendee} />
    </AppShell>
  );
}

