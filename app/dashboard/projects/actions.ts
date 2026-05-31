"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { getCurrentCompany } from "@/lib/current-company";

export async function createProject(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const priceRange = String(formData.get("priceRange") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const mapLink = String(formData.get("mapLink") || "").trim();
  const brochureUrl = String(formData.get("brochureUrl") || "").trim();
  const heroImage = String(formData.get("heroImage") || "").trim();

  const status = String(formData.get("status") || "ACTIVE") as
    | "ACTIVE"
    | "UPCOMING"
    | "SOLD_OUT";

  if (!name || !location) {
    throw new Error("Project name and location are required.");
  }

  const company = await getCurrentCompany();

  const baseSlug = slugify(name);

  const existingProject = await prisma.project.findUnique({
    where: {
      slug: baseSlug,
    },
  });

  const slug = existingProject ? `${baseSlug}-${Date.now()}` : baseSlug;

  await prisma.project.create({
    data: {
      companyId: company.id,
      name,
      slug,
      location,
      priceRange,
      description,
      mapLink,
      brochureUrl,
      heroImage,
      status,
    },
  });

  redirect("/dashboard/projects");
}