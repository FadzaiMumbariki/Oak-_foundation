export function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function formatDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDateTime(iso: string): { time: string; date: string } {
  const d = new Date(iso);
  return {
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function generateQrCode(id?: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rand = () =>
    Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `OAK-2026-${rand()}-${rand()}`;
}
