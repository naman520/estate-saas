"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCompany } from "@/lib/current-company";

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "SITE_VISIT_PLANNED",
  "SITE_VISIT_DONE",
  "NEGOTIATION",
  "BOOKED",
  "LOST",
] as const;

type LeadStatus = (typeof LEAD_STATUSES)[number];

export async function updateLead(leadId: string, formData: FormData) {
  const status = String(formData.get("status") || "NEW") as LeadStatus;
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error("Invalid lead status.");
  }
  const notes = String(formData.get("notes") || "").trim();
  const followUpAtValue = String(formData.get("followUpAt") || "").trim();
  const company = await getCurrentCompany();
  const followUpAt = followUpAtValue ? new Date(followUpAtValue) : null;
  if (followUpAt && Number.isNaN(followUpAt.getTime())) {
    throw new Error("Invalid follow-up date.");
  }

  const lead = await prisma.lead.findFirst({
  where: {
    id: leadId,
    companyId: company.id,
  },
});

if (!lead) {
  throw new Error("Lead not found.");
}

  await prisma.lead.update({
    where: {
      id: lead.id,
    },
    data: {
      status,
      notes: notes || null,
      followUpAt,
    },
  });

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${leadId}`);

  redirect(`/dashboard/leads/${leadId}`);
}