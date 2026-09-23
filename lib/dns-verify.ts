/**
 * DNS verification utility.
 *
 * Uses Node.js built-in dns/promises — no external dependencies.
 * Checks whether a custom domain's CNAME (or A record) correctly
 * points to our expected target (DNS_CNAME_TARGET env var).
 */

import { promises as dns } from "dns";

/**
 * The expected CNAME target for custom domains.
 * e.g. "cname.vercel-dns.com" on Vercel.
 */
function getCnameTarget(): string {
  return process.env.DNS_CNAME_TARGET?.trim() ?? "cname.vercel-dns.com";
}

export type DnsCheckResult = {
  verified: boolean;
  resolvedTo: string | null;
  error?: string;
};

/**
 * Checks whether the given domain's DNS resolves to our expected target.
 *
 * Tries CNAME first, then falls back to A record (some registrars only
 * support A records on root domains).
 */
export async function checkDomainCNAME(
  domain: string
): Promise<DnsCheckResult> {
  const expected = getCnameTarget();

  // Strip port if present (local dev)
  const cleanDomain = domain.replace(/:\d+$/, "");

  // 1. Try CNAME resolution
  try {
    const cnames = await dns.resolveCname(cleanDomain);
    const resolvedTo = cnames[0] ?? null;

    if (
      resolvedTo &&
      (resolvedTo === expected ||
        resolvedTo.endsWith(`.${expected}`) ||
        resolvedTo.includes("vercel"))
    ) {
      return { verified: true, resolvedTo };
    }

    return {
      verified: false,
      resolvedTo,
      error: `CNAME points to "${resolvedTo}" but expected "${expected}".`,
    };
  } catch {
    // CNAME not set — try A record fallback
  }

  // 2. Fallback: A record check
  try {
    const addresses = await dns.resolve4(cleanDomain);
    const resolvedTo = addresses[0] ?? null;

    // For A records we just confirm it resolves (can't check for Vercel IP reliably
    // since Vercel uses anycast IPs). Return resolved + not verified via CNAME.
    return {
      verified: false,
      resolvedTo: resolvedTo ? `A: ${resolvedTo}` : null,
      error: `Domain resolves via A record (${resolvedTo}) but needs a CNAME pointing to ${expected}.`,
    };
  } catch {
    return {
      verified: false,
      resolvedTo: null,
      error: `Domain "${cleanDomain}" does not resolve. DNS record may not be set yet.`,
    };
  }
}
