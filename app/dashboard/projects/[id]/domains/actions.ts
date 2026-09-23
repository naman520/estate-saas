"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeDomain } from "@/lib/domains";
import { addDomainToVercel, removeDomainFromVercel, verifyDomainOnVercel } from "@/lib/vercel-domains";
import { checkDomainCNAME } from "@/lib/dns-verify";
import { getCurrentCompany } from "@/lib/current-company";

// ---------------------------------------------------------------------------
// Add custom domain
// ---------------------------------------------------------------------------

export async function addCustomDomain(
  projectId: string,
  formData: FormData
): Promise<void> {
  const company = await getCurrentCompany();
  const rawDomain = String(formData.get("domain") || "").trim();

  // Validate and normalize
  const normalized = normalizeDomain(rawDomain);
  if (!normalized.ok) {
    throw new Error(normalized.error);
  }
  const domain = normalized.domain;

  // Verify the project belongs to this company
  const project = await prisma.project.findUnique({
    where: { id: projectId, companyId: company.id },
  });
  if (!project) {
    throw new Error("Project not found.");
  }

  // Check if domain is already in use
  const existing = await prisma.projectDomain.findUnique({
    where: { domain },
  });
  if (existing) {
    if (existing.projectId === projectId) {
      throw new Error("This domain is already added to this project.");
    }
    throw new Error("This domain is already in use by another project.");
  }

  // Remove any existing primary domain for this project first
  await prisma.projectDomain.updateMany({
    where: { projectId, isPrimary: true },
    data: { isPrimary: false },
  });

  // Register domain with Vercel (non-blocking — DB record is created regardless)
  const vercelResult = await addDomainToVercel(domain);
  if (!vercelResult.ok) {
    console.warn("[domains/actions] Vercel domain add failed:", vercelResult.error);
  }

  // Create DB record
  await prisma.projectDomain.create({
    data: {
      domain,
      type: "CUSTOM",
      status: "PENDING",
      isPrimary: true,
      projectId,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

// ---------------------------------------------------------------------------
// Verify custom domain (called by "Check DNS" button)
// ---------------------------------------------------------------------------

export async function verifyCustomDomain(
  projectId: string,
  domainId: string
): Promise<{ status: string; message: string }> {
  const company = await getCurrentCompany();

  const domainRecord = await prisma.projectDomain.findUnique({
    where: { id: domainId },
    include: { project: true },
  });

  if (!domainRecord || domainRecord.project.companyId !== company.id) {
    throw new Error("Domain record not found.");
  }

  const domain = domainRecord.domain;

  // Run both checks in parallel
  const [vercelResult, dnsResult] = await Promise.all([
    verifyDomainOnVercel(domain),
    checkDomainCNAME(domain),
  ]);

  const isVerified = vercelResult.verified || dnsResult.verified;

  const newStatus = isVerified ? "ACTIVE" : "ERROR";
  await prisma.projectDomain.update({
    where: { id: domainId },
    data: { status: newStatus },
  });

  revalidatePath(`/dashboard/projects/${projectId}`);

  if (isVerified) {
    return {
      status: "ACTIVE",
      message: `✅ Domain verified! ${domain} is now live.`,
    };
  }

  return {
    status: "ERROR",
    message:
      dnsResult.error ??
      "DNS not verified yet. Make sure you added the CNAME record and allow up to 48 hours for propagation.",
  };
}

// ---------------------------------------------------------------------------
// Remove custom domain
// ---------------------------------------------------------------------------

export async function removeCustomDomain(
  projectId: string,
  domainId: string
): Promise<void> {
  const company = await getCurrentCompany();

  const domainRecord = await prisma.projectDomain.findUnique({
    where: { id: domainId },
    include: { project: true },
  });

  if (!domainRecord || domainRecord.project.companyId !== company.id) {
    throw new Error("Domain record not found.");
  }

  // Remove from Vercel (best effort)
  await removeDomainFromVercel(domainRecord.domain);

  // Delete DB record
  await prisma.projectDomain.delete({ where: { id: domainId } });

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}
