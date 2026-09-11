import { createBrowserClient } from "@supabase/ssr";

const FALLBACK_URL = "https://placeholder-oak-project.supabase.co";
const FALLBACK_KEY = "placeholder-anon-key";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

  return createBrowserClient(url, anonKey);
}
