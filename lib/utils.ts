import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Normalises an Indian phone number to its 10-digit form so that
 * "+91 98765 43210", "098765-43210" and "9876543210" dedupe as one lead.
 * Non-Indian / unrecognised numbers are returned as digits only
 * (with a leading "+" preserved).
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);

  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/**
 * Returns a safe, same-origin relative path for redirects.
 * Anything that isn't a plain "/path" (e.g. "https://evil.com",
 * "//evil.com", "/\\evil.com") falls back to `fallback`.
 */
export function safeRelativePath(input: string, fallback: string): string {
  const value = input.trim();

  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\") ||
    /[\r\n]/.test(value)
  ) {
    return fallback;
  }

  return value;
}

/**
 * Converts a stored phone number to international digits for wa.me / tel:.
 * 10-digit numbers are assumed to be Indian (+91).
 * Returns null if the number is too short to be valid.
 */
export function toInternationalDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

/** "9876543210" → "+91 98765 43210" (other formats are returned as-is). */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  return phone;
}

/** Click-to-chat WhatsApp link with an optional prefilled message. */
export function whatsappLink(phone: string, message?: string): string | null {
  const intl = toInternationalDigits(phone);
  if (!intl) return null;
  return `https://wa.me/${intl}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
