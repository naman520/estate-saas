"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { normalizeDomain } from "@/lib/domains";
import {
  addDomainToVercel,
  hasVercelCredentials,
  removeDomainFromVercel,
} from "@/lib/vercel-domains";
import { requireRole } from "@/lib/current-company";

// ---------------------------------------------------------------------------
// Add custom domain
// ---------------------------------------------------------------------------

export async function addCustomDomain(
  projectId: string,
  formData: FormData
): Promise<void> {
  const { company } = await requireRole("ADMIN");
  const rawDomain = String(formData.get("domain") || "").trim();

  // Validate and normalize
  const normalized = normalizeDomain(rawDomain);
  if (!normalized.ok) {
    throw new Error(normalized.error);
  }
  const domain = normalized.domain;

  // Verify the project belongs to this company
  const project = await prisma.project.findFirst({
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

  // Register with Vercel first. In production (credentials present) a failure
  // here is fatal: a DB record without a Vercel domain can never go live.
  if (hasVercelCredentials()) {
    const vercelResult = await addDomainToVercel(domain);
    if (!vercelResult.ok) {
      throw new Error(
        `Could not register domain with hosting provider: ${vercelResult.error}`
      );
    }
  }

  // Swap the primary domain atomically
  await prisma.$transaction([
    prisma.projectDomain.updateMany({
      where: { projectId, isPrimary: true },
      data: { isPrimary: false },
    }),
    prisma.projectDomain.create({
      data: {
        domain,
        type: "CUSTOM",
        status: "PENDING",
        isPrimary: true,
        projectId,
      },
    }),
  ]);

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}

// ---------------------------------------------------------------------------
// Remove custom domain
// ---------------------------------------------------------------------------

export async function removeCustomDomain(
  projectId: string,
  domainId: string
): Promise<void> {
  const { company } = await requireRole("ADMIN");

  const domainRecord = await prisma.projectDomain.findFirst({
    where: { id: domainId, project: { companyId: company.id } },
  });

  if (!domainRecord) {
    throw new Error("Domain record not found.");
  }

  // Remove from Vercel (best effort)
  await removeDomainFromVercel(domainRecord.domain);

  // Delete DB record
  await prisma.projectDomain.delete({ where: { id: domainRecord.id } });

  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}
