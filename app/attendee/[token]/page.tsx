import { createClient } from "@/lib/supabase/server";
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

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("attendee_passes")
      .select("id, full_name, organization, sub_partner, role_title, qr_token")
      .eq("qr_token", token)
      .single();
    if (!error && data) attendee = data as AttendeePass;
  } catch {
    // dev fallback below
  }

  if (!attendee) {
    if (token.startsWith("mock-") || token === "demo" || process.env.NODE_ENV === "development") {
      attendee = {
        id: "mock-001",
        full_name: "Tinashe Smith",
        organization: "uncommon.org",
        sub_partner: null,
        role_title: "Partner",
        qr_token: token,
      };
    } else {
      notFound();
    }
  }

  return (
    <AppShell variant="public">
      <AttendeePassCard attendee={attendee} />
    </AppShell>
  );
}
