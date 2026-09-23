"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function selectLandingTemplate(
  projectId: string,
  templateId: string
) {
  if (!projectId || !templateId) {
    throw new Error("Project ID and template ID are required.");
  }

  const template = await prisma.landingTemplate.findUnique({
    where: {
      id: templateId,
    },
  });

  if (!template) {
    throw new Error("Template not found.");
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found.");
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      templateId,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/landing/templates`);
  revalidatePath(`/dashboard/projects/${projectId}`);
  // Revalidate the public landing page so the template change is immediately visible
  revalidatePath(`/p/${project.slug}`);
}