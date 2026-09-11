// Client-side helper to persist the attendee's QR token after registration.
// Uses localStorage so the nav can show "My Pass" instead of "Register".

const KEY = "oak_qr_token";

export function savePassToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, token);
  }
}

export function getPassToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function clearPassToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(KEY);
  }
}
