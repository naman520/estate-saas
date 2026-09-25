"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/current-company";

export async function selectLandingTemplate(
  projectId: string,
  templateId: string
) {
  if (!projectId || !templateId) {
    throw new Error("Project ID and template ID are required.");
  }

  // Only admins of the owning company may change a project's template
  const { company } = await requireRole("ADMIN");

  const [project, template] = await Promise.all([
    prisma.project.findFirst({
      where: { id: projectId, companyId: company.id },
    }),
    prisma.landingTemplate.findUnique({
      where: { id: templateId },
    }),
  ]);

  if (!project) {
    throw new Error("Project not found.");
  }

  if (!template) {
    throw new Error("Template not found.");
  }

  // Paid templates are gated behind the PRO plan
  if (template.tier === "PAID" && company.plan !== "PRO") {
    throw new Error("This template requires the PRO plan.");
  }

  await prisma.project.update({
    where: { id: project.id },
    data: { templateId },
  });

  revalidatePath(`/dashboard/projects/${projectId}/landing/templates`);
  revalidatePath(`/dashboard/projects/${projectId}`);
  // Revalidate the public landing page so the template change is immediately visible
  revalidatePath(`/p/${project.slug}`);
}
