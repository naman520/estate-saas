import { prisma } from "@/lib/prisma";
import { checkDomainCNAME } from "@/lib/dns-verify";
import {
  hasVercelCredentials,
  verifyDomainOnVercel,
} from "@/lib/vercel-domains";

export type DomainVerificationResult = {
  status: "ACTIVE" | "PENDING" | "ERROR";
  resolvedTo: string | null;
  message: string;
};

/**
 * Single source of truth for verifying a custom domain.
 *
 * - With Vercel credentials (production): Vercel's `verified` flag decides.
 *   Our own DNS lookup is only used to give the user a helpful hint. A domain
 *   whose CNAME merely *looks* right is not marked ACTIVE until Vercel agrees,
 *   otherwise it would go live without an SSL certificate.
 * - Without credentials (local dev): fall back to the DNS check.
 *
 * Status semantics:
 *   ACTIVE  → verified, serving traffic
 *   PENDING → DNS not propagated / not configured yet (user can retry)
 *   ERROR   → Vercel API returned a real error (needs attention)
 */
export async function verifyAndUpdateDomain(
  domainId: string,
  domain: string,
): Promise<DomainVerificationResult> {
  const useVercel = hasVercelCredentials();

  const [vercelResult, dnsResult] = await Promise.all([
    useVercel ? verifyDomainOnVercel(domain) : Promise.resolve(null),
    checkDomainCNAME(domain),
  ]);

  let status: DomainVerificationResult["status"];
  let message: string;

  if (vercelResult) {
    if (vercelResult.verified) {
      status = "ACTIVE";
      message = `✅ ${domain} is verified and live!`;
    } else if (vercelResult.error) {
      status = "ERROR";
      message = `Vercel could not verify this domain: ${vercelResult.error}`;
    } else {
      status = "PENDING";
      message =
        dnsResult.error ??
        "DNS not verified yet. Check your registrar and try again in a few minutes.";
    }
  } else {
    status = dnsResult.verified ? "ACTIVE" : "PENDING";
    message = dnsResult.verified
      ? `✅ ${domain} DNS looks correct (local dev: Vercel check skipped).`
      : (dnsResult.error ??
        "DNS not verified yet. Check your registrar and try again in a few minutes.");
  }

  await prisma.projectDomain.update({
    where: { id: domainId },
    data: { status },
  });

  return { status, resolvedTo: dnsResult.resolvedTo, message };
}
