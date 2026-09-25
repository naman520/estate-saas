"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseFormConfig } from "@/lib/form-config";
import { normalizePhone, safeRelativePath } from "@/lib/utils";

/** Ad-attribution params captured from the landing page URL. */
const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

/**
 * Hidden honeypot input name. Real users never see or fill it; bots do.
 * Keep in sync with components/landing-form/public-lead-form.tsx
 * ("use server" files may only export async functions).
 */
const HONEYPOT_FIELD = "_company_website";

/**
 * createFormLead — handles submissions from the dynamic PublicLeadForm.
 * Validates submitted field values against the project's saved formSettings,
 * then maps known field IDs to Lead columns and stores all values in formData.
 */
export async function createFormLead(formData: FormData) {
  const projectId = String(formData.get("projectId") || "").trim();
  const projectSlug = String(formData.get("projectSlug") || "").trim();

  if (!projectId || !projectSlug) {
    throw new Error("Project details are missing.");
  }

  // Only ever redirect to a relative path on our own site (no open redirect)
  const returnPath = safeRelativePath(
    String(formData.get("_returnPath") || ""),
    `/p/${projectSlug}`,
  );

  // Bot filled the honeypot → pretend success, store nothing
  if (String(formData.get(HONEYPOT_FIELD) || "").trim()) {
    redirect(`${returnPath}?submitted=true`);
  }

  // Load the project; companyId comes from the DB, never from the browser
  const project = await prisma.project.findFirst({
    where: { id: projectId, slug: projectSlug },
    select: { id: true, companyId: true, formSettings: true },
  });

  if (!project) {
    throw new Error("Invalid project.");
  }

  // Parse and validate against saved config (not browser-supplied data)
  const config = parseFormConfig(project.formSettings);

  const submittedValues: Record<string, string> = {};

  for (const field of config.fields) {
    const rawValue = String(formData.get(`field_${field.id}`) || "")
      .trim()
      .slice(0, 1000);

    if (field.required && !rawValue) {
      throw new Error(`${field.label} is required.`);
    }

    if (rawValue) {
      submittedValues[field.id] = rawValue;
    }
  }

  // Map well-known field IDs to dedicated Lead columns
  const name = submittedValues["name"] || "Enquiry";
  const phone = normalizePhone(submittedValues["phone"] || "");
  const email = submittedValues["email"] || null;
  const budget = submittedValues["budget"] || null;
  const message = submittedValues["message"] || null;

  if (phone.replace(/\D/g, "").length < 7) {
    throw new Error("A valid phone number is required.");
  }

  // Ad attribution (UTM / click IDs)
  const attribution: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = String(formData.get(key) || "").trim().slice(0, 200);
    if (value) attribution[key] = value;
  }

  const source = (
    String(formData.get("source") || "").trim() ||
    attribution.utm_source ||
    "WEBSITE"
  ).slice(0, 50);

  try {
    await prisma.lead.create({
      data: {
        projectId: project.id,
        companyId: project.companyId,
        name,
        phone,
        email,
        budget,
        message,
        source,
        status: "NEW",
        formData: {
          ...submittedValues,
          ...(Object.keys(attribution).length ? { _attribution: attribution } : {}),
        },
      },
    });
  } catch (error) {
    // @@unique([projectId, phone]) — same person enquired twice
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      redirect(`${returnPath}?submitted=true&duplicate=true`);
    }
    throw error;
  }

  redirect(`${returnPath}?submitted=true`);
}
