"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";

export async function saveLandingContent(
  projectId: string,
  formData: FormData
) {
  const company = await getCurrentCompany();

  const existing = await prisma.project.findUnique({
    where: { id: projectId, companyId: company.id },
  });

  if (!existing) {
    throw new Error("Project not found.");
  }

  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();

  if (!name || !location) {
    throw new Error("Project name and location are required.");
  }

  const priceRange = String(formData.get("priceRange") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const heroImage = String(formData.get("heroImage") || "").trim();
  const mapLink = String(formData.get("mapLink") || "").trim();
  const brochureUrl = String(formData.get("brochureUrl") || "").trim();
  const amenities = String(formData.get("amenities") || "").trim();
  const locationHighlights = String(
    formData.get("locationHighlights") || ""
  ).trim();
  const ctaHeading = String(formData.get("ctaHeading") || "").trim();
  const ctaSubtext = String(formData.get("ctaSubtext") || "").trim();
  const ctaButtonText = String(formData.get("ctaButtonText") || "").trim();

  await prisma.project.update({
    where: { id: projectId },
    data: {
      name,
      location,
      priceRange: priceRange || null,
      description: description || null,
      heroImage: heroImage || null,
      mapLink: mapLink || null,
      brochureUrl: brochureUrl || null,
      amenities: amenities || null,
      locationHighlights: locationHighlights || null,
      ctaHeading: ctaHeading || null,
      ctaSubtext: ctaSubtext || null,
      ctaButtonText: ctaButtonText || null,
    },
  });

  revalidatePath(`/dashboard/projects/${projectId}/landing/content`);
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/p/${existing.slug}`);
}