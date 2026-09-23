/**
 * Domain normalization and hostname resolution utilities.
 *
 * Reusable across Day 21 (foundation), Day 22 (Vercel API), and Day 23 (UI).
 */

// ---------------------------------------------------------------------------
// System hostname detection
// ---------------------------------------------------------------------------

/**
 * Hostnames that are considered part of the EstateFlow platform.
 * Custom domains must NOT match any of these.
 */
const SYSTEM_HOSTNAME_SUFFIXES = [
  ".vercel.app",
  ".vercel.sh",
  ".ngrok-free.dev",
  ".ngrok.io",
];

/**
 * Returns the configured production app host, if any.
 * e.g. "estateflow.vercel.app" or "app.estateflow.in"
 */
function getAppHost(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_HOST?.toLowerCase().trim() || undefined;
}

/**
 * Returns true when `hostname` belongs to the EstateFlow platform itself
 * (localhost, Vercel preview, production host, etc.).
 *
 * A custom domain should never match this.
 */
export function isSystemHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().trim();

  // Strip port for comparison (e.g. "localhost:3000" → "localhost")
  const hostWithoutPort = h.replace(/:\d+$/, "");

  // localhost / 127.0.0.1 / [::1]
  if (
    hostWithoutPort === "localhost" ||
    hostWithoutPort === "127.0.0.1" ||
    hostWithoutPort === "[::1]" ||
    hostWithoutPort === "::1"
  ) {
    return true;
  }

  // Known platform suffixes
  for (const suffix of SYSTEM_HOSTNAME_SUFFIXES) {
    if (hostWithoutPort === suffix.slice(1) || hostWithoutPort.endsWith(suffix)) {
      return true;
    }
  }

  // Explicit app host from environment
  const appHost = getAppHost();
  if (appHost && hostWithoutPort === appHost) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Domain normalization
// ---------------------------------------------------------------------------

export type NormalizeDomainResult =
  | { ok: true; domain: string }
  | { ok: false; error: string };

/**
 * Normalizes a user-entered domain string.
 *
 * - lowercases
 * - trims whitespace
 * - removes protocol (http:// / https://)
 * - removes trailing slash
 * - removes accidental path/query/fragment
 * - preserves port for local dev (e.g. "mysite.localhost:3000")
 * - rejects empty strings, IP addresses, obviously invalid values
 * - rejects EstateFlow system hostnames
 */
export function normalizeDomain(input: string): NormalizeDomainResult {
  if (!input || typeof input !== "string") {
    return { ok: false, error: "Domain cannot be empty." };
  }

  let value = input.trim().toLowerCase();

  if (!value) {
    return { ok: false, error: "Domain cannot be empty." };
  }

  // Strip protocol
  value = value.replace(/^https?:\/\//, "");

  // Strip trailing slash and everything after (path, query, fragment)
  const slashIdx = value.indexOf("/");
  if (slashIdx !== -1) {
    value = value.substring(0, slashIdx);
  }

  // Strip query/fragment that might remain if no path was present
  const queryIdx = value.indexOf("?");
  if (queryIdx !== -1) {
    value = value.substring(0, queryIdx);
  }
  const hashIdx = value.indexOf("#");
  if (hashIdx !== -1) {
    value = value.substring(0, hashIdx);
  }

  value = value.trim();

  if (!value) {
    return { ok: false, error: "Domain cannot be empty after normalization." };
  }

  // Strip development/runtime port.
  // Database domains are always stored as hostnames only.
  value = value.replace(/:\d+$/, "");

  // Reject bare IP addresses (v4)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$/.test(value)) {
    return { ok: false, error: "IP addresses are not allowed as custom domains." };
  }

  // Basic domain format validation: must have at least one dot or be a .localhost domain
  const hostWithoutPort = value.replace(/:\d+$/, "");
  if (!hostWithoutPort.includes(".") && !hostWithoutPort.endsWith("localhost")) {
    return {
      ok: false,
      error: "Invalid domain format. Must contain at least one dot (e.g. plots.example.com).",
    };
  }

  // Reject invalid characters
  if (!/^[a-z0-9._-]+(:\d+)?$/.test(value)) {
    return {
      ok: false,
      error: "Domain contains invalid characters.",
    };
  }

  // Reject system hostnames
  if (isSystemHostname(value)) {
    return {
      ok: false,
      error: "This hostname belongs to the EstateFlow platform and cannot be used as a custom domain.",
    };
  }

  return { ok: true, domain: value };
}

// ---------------------------------------------------------------------------
// Hostname → Project resolver
// ---------------------------------------------------------------------------

import { prisma } from "@/lib/prisma";

/**
 * Resolves a hostname to a project slug by looking up an ACTIVE ProjectDomain.
 *
 * Returns the project slug if a matching active domain is found, or null.
 * Only domains with status ACTIVE are resolved — PENDING, VERIFYING, ERROR
 * domains will NOT serve a landing page.
 */
export async function resolveProjectFromHostname(
  hostname: string,
): Promise<string | null> {
  const result = normalizeDomain(hostname);

  // If normalization fails or it's a system host, don't resolve
  if (!result.ok) {
    return null;
  }

  // System hosts are handled via /p/[slug] — never resolve them to a domain record
  // (normalizeDomain already rejects system hosts, but double-check)
  if (isSystemHostname(result.domain)) {
    return null;
  }

  try {
    const domainRecord = await prisma.projectDomain.findUnique({
      where: {
        domain: result.domain,
        status: "ACTIVE",
      },
      select: {
        project: {
          select: {
            slug: true,
          },
        },
      },
    });

    return domainRecord?.project?.slug ?? null;
  } catch (error) {
    console.error("[resolveProjectFromHostname] Error:", error);
    return null;
  }
}
