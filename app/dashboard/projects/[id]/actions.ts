"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getCurrentCompany } from "@/lib/current-company";

type ProjectStatus = "ACTIVE" | "UPCOMING" | "SOLD_OUT";

export async function updateProject(projectId: string, formData: FormData) {
  const company = await getCurrentCompany();
  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const priceRange = String(formData.get("priceRange") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mapLink = String(formData.get("mapLink") || "").trim();
  const brochureUrl = String(formData.get("brochureUrl") || "").trim();
  const heroImage = String(formData.get("heroImage") || "").trim();

  const galleryImagesRaw = String(formData.get("galleryImages") || "").trim();
  const amenities = String(formData.get("amenities") || "").trim();
  const locationHighlights = String(
    formData.get("locationHighlights") || "",
  ).trim();
  const ctaHeading = String(formData.get("ctaHeading") || "").trim();
  const ctaSubtext = String(formData.get("ctaSubtext") || "").trim();
  const ctaButtonText = String(formData.get("ctaButtonText") || "").trim();

  const galleryImages = galleryImagesRaw
    ? galleryImagesRaw
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  const status = String(formData.get("status") || "ACTIVE") as ProjectStatus;

  const customDomain = String(formData.get("customDomain") || "").trim();
  const formPosition = String(
    formData.get("formPosition") || "HERO_RIGHT",
  ).trim();

  const showHeroImage = formData.get("showHeroImage") === "on";
  const showLocation = formData.get("showLocation") === "on";
  const showPricing = formData.get("showPricing") === "on";
  const showBrochure = formData.get("showBrochure") === "on";
  const showContactCta = formData.get("showContactCta") === "on";

  if (!name || !location) {
    throw new Error("Project name and location are required.");
  }

  const existingProject = await prisma.project.findUnique({
    where: {
      id: projectId,
      companyId: company.id
    },
  });

  if (!existingProject) {
    throw new Error("Project not found.");
  }

  let slug = existingProject.slug;

  if (name !== existingProject.name) {
    const baseSlug = slugify(name);

    const slugExists = await prisma.project.findFirst({
      where: {
        slug: baseSlug,
        companyId: company.id,
        NOT: {
          id: projectId,
        },
      },
    });

    slug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;
  }

  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      name,
      slug,
      location,
      priceRange: priceRange || null,
      description: description || null,
      mapLink: mapLink || null,
      brochureUrl: brochureUrl || null,
      heroImage: heroImage || null,
      status,

      customDomain: customDomain || null,
      formPosition,

      showHeroImage,
      showLocation,
      showPricing,
      showBrochure,
      showContactCta,

      galleryImages,
      amenities: amenities || null,
      locationHighlights: locationHighlights || null,
      ctaHeading: ctaHeading || null,
      ctaSubtext: ctaSubtext || null,
      ctaButtonText: ctaButtonText || null,
    },
  });

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${projectId}`);
  revalidatePath(`/p/${slug}`);

  redirect(`/dashboard/projects/${projectId}`);
}
