"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createLead(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();
  const companyId = String(formData.get("companyId") || "").trim();
  const projectSlug = String(formData.get("projectSlug") || "").trim();

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const budget = String(formData.get("budget") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const source = String(formData.get("source") || "WEBSITE").trim();

  if (!projectId || !companyId || !projectSlug) {
    throw new Error("Project details are missing.");
  }

  if (!name || !phone) {
    throw new Error("Name and phone are required.");
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      companyId,
      slug: projectSlug,
    },
  });

  if (!project) {
    throw new Error("Invalid project.");
  }

  const existingLead = await prisma.lead.findFirst({
    where: {
      projectId,
      companyId,
      phone,
    },
  });

  if (existingLead) {
    redirect(`/p/${projectSlug}?submitted=true&duplicate=true`);
  }

  await prisma.lead.create({
    data: {
      projectId,
      companyId,
      name,
      phone,
      email: email || null,
      budget: budget || null,
      message: message || null,
      source: source || "WEBSITE",
      status: "NEW",
    },
  });

  redirect(`/p/${projectSlug}?submitted=true`);
}