// OAK brand design tokens & shared types
export const OAK_BRAND = {
  navy: "#1B2B4B",
  navyLight: "#2A3F6A",
  green: "#2D6A4F",
  greenLight: "#40916C",
  greenAccent: "#52B788",
  gold: "#C9A84C",
  white: "#FFFFFF",
  offWhite: "#F7F8FA",
  grey: "#6B7280",
  greyLight: "#E5E7EB",
  error: "#DC2626",
};

export type RegistrationFormData = {
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  sub_partner: string;
  role_title: string;
  dietary_needs: string;
  accessibility_needs: string;
  travel_needs: string;
  consent_given: boolean;
};

export type Attendee = {
  id: string;
  created_at?: string;
  full_name: string;
  organization: string;
  sub_partner: string | null;
  role_title: string;
  qr_token: string;
};

export type AttendeePass = Attendee;

export type AttendeeAdmin = Attendee & {
  email: string;
  phone: string | null;
  dietary_needs: string | null;
  accessibility_needs: string | null;
  travel_needs: string | null;
  consent_given: boolean;
};

export type CheckIn = {
  id: string;
  attendee_id: string;
  check_in_date: string;
  checked_in_at: string;
};

export type Partner = {
  id: string;
  name: string;
  website_url: string | null;
  logo_path: string | null;
  description: string | null;
  is_sub_partner: boolean;
  parent_id: string | null;
  sort_order: number;
};

export type ProgrammeSession = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string | null;
  title: string;
  location: string | null;
  description: string | null;
  session_type: string;
  sort_order: number;
};

export type DailyPost = {
  id: string;
  post_date: string;
  notes: string | null;
  photo_paths: string[];
  published: boolean;
};

/** Format a time string (HH:MM:SS) as HH:MM */
export function formatTime(time: string): string {
  return time.slice(0, 5);
}

/** Format a date (YYYY-MM-DD) as readable string */
export function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Event dates */
export const EVENT_DATES = ["2026-11-09", "2026-11-10", "2026-11-11"];
export const EVENT_DAY_LABELS = ["Day 1 · Mon 9 Nov", "Day 2 · Tue 10 Nov", "Day 3 · Wed 11 Nov"];
