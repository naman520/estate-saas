"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseFormConfig } from "@/lib/form-config";

export async function createLead(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();
  const companyId = String(formData.get("companyId") || "").trim();
  const projectSlug = String(formData.get("projectSlug") || "").trim();
  const returnPath = String(formData.get("_returnPath") || "").trim() || `/p/${projectSlug}`;

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
    redirect(`${returnPath}?submitted=true&duplicate=true`);
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

  redirect(`${returnPath}?submitted=true`);
}

/**
 * createFormLead — handles submissions from the dynamic PublicLeadForm.
 * Validates submitted field values against the project's saved formSettings,
 * then maps known field IDs to Lead columns and stores all values in formData.
 */
export async function createFormLead(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();
  const companyId = String(formData.get("companyId") || "").trim();
  const projectSlug = String(formData.get("projectSlug") || "").trim();
  const returnPath = String(formData.get("_returnPath") || "").trim() || `/p/${projectSlug}`;
  const source = String(formData.get("source") || "WEBSITE").trim();

  if (!projectId || !companyId || !projectSlug) {
    throw new Error("Project details are missing.");
  }

  // Load the project to get the authoritative formSettings
  const project = await prisma.project.findFirst({
    where: { id: projectId, companyId, slug: projectSlug },
  });

  if (!project) {
    throw new Error("Invalid project.");
  }

  // Parse and validate against saved config (not browser-supplied data)
  const config = parseFormConfig(project.formSettings);

  const submittedValues: Record<string, string> = {};

  for (const field of config.fields) {
    const rawValue = String(formData.get(`field_${field.id}`) || "").trim();

    if (field.required && !rawValue) {
      throw new Error(`${field.label} is required.`);
    }

    if (rawValue) {
      submittedValues[field.id] = rawValue;
    }
  }

  // Map well-known field IDs to dedicated Lead columns
  const name = submittedValues["name"] || "Enquiry";
  const phone = submittedValues["phone"] || "";
  const email = submittedValues["email"] || null;
  const budget = submittedValues["budget"] || null;
  const message = submittedValues["message"] || null;

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  // Deduplication by project + phone
  const existingLead = await prisma.lead.findFirst({
    where: { projectId, companyId, phone },
  });

  if (existingLead) {
    redirect(`${returnPath}?submitted=true&duplicate=true`);
  }

  await prisma.lead.create({
    data: {
      projectId,
      companyId,
      name,
      phone,
      email,
      budget,
      message,
      source,
      status: "NEW",
      formData: submittedValues,
    },
  });

  redirect(`${returnPath}?submitted=true`);
}
