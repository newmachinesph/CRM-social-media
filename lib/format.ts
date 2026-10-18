import { format, formatDistance, parseISO } from "date-fns";

/**
 * The demo universe's fixed "now" (26 Aug 2026, 10:15 AEST).
 * Keeps relative times deterministic between server render and hydration.
 */
export const DEMO_NOW = parseISO("2026-08-26T10:15");

/** "$5,500" — whole dollars, AUD */
export function aud(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "$6,050.00" — cents shown, for invoices */
export function audExact(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount);
}

/** "26 Aug 2026" */
export function fmtDate(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy");
}

/** "26 Aug" */
export function fmtDateShort(iso: string): string {
  return format(parseISO(iso), "d MMM");
}

/** "Wed 26 Aug" */
export function fmtDayDate(iso: string): string {
  return format(parseISO(iso), "EEE d MMM");
}

/** "26 Aug 2026, 10:42 AM" */
export function fmtDateTime(iso: string): string {
  return format(parseISO(iso), "d MMM yyyy, h:mm a");
}

/** "2 minutes ago" — relative to the fixed demo clock */
export function timeAgo(iso: string): string {
  return formatDistance(parseISO(iso), DEMO_NOW, { addSuffix: true });
}

/** 42 -> "0:42", 96 -> "1:36" */
export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 84230 -> "84.2K" */
export function compact(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
